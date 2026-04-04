const express = require('express');
const path = require('path');
const fs = require('fs');
const { nanoid } = require('nanoid/non-secure');
const { generateQRCode } = require('../services/qrcodeService');
const { generatePdf, generatePreviewHtml } = require('../services/pdfService');
const { createZip } = require('../services/zipService');
const { getDb } = require('../config/database');

const router = express.Router();

// POST /api/certificates/preview — Generate preview HTML for first record
router.post('/preview', async (req, res) => {
  try {
    const { record, templateConfig } = req.body;
    if (!record) {
      return res.status(400).json({ error: 'Registro não fornecido' });
    }

    const code = nanoid(10).toUpperCase();
    const { qrDataUrl } = await generateQRCode(code);

    const data = { ...record, code, qrDataUrl };
    const html = await generatePreviewHtml(data, templateConfig || {});

    res.json({ success: true, html, code });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/certificates/generate — Generate all certificates
router.post('/generate', async (req, res) => {
  try {
    const { records, templateConfig } = req.body;
    if (!records || !Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ error: 'Nenhum registro fornecido' });
    }

    if (records.length > 200) {
      return res.status(400).json({ error: 'Máximo de 200 certificados por vez' });
    }

    const db = getDb();
    const outputDir = path.join(__dirname, '..', 'outputs');
    
    // Clean output directory
    if (fs.existsSync(outputDir)) {
      const files = fs.readdirSync(outputDir);
      files.forEach(file => {
        if (file.endsWith('.pdf') || file.endsWith('.zip')) {
          fs.unlinkSync(path.join(outputDir, file));
        }
      });
    }

    const insertStmt = db.prepare(
      'INSERT OR REPLACE INTO certificates (code, nome, curso, data_conclusao, carga_horaria, pdf_path) VALUES (?, ?, ?, ?, ?, ?)'
    );

    const results = [];
    const errors = [];

    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      try {
        const code = nanoid(10).toUpperCase();
        const { qrDataUrl } = await generateQRCode(code);

        const data = { ...record, code, qrDataUrl };
        const { fileName, outputPath } = await generatePdf(data, templateConfig || {}, outputDir);

        // Save to database
        insertStmt.run(code, record.nome, record.curso, record.data_conclusao, record.carga_horaria, outputPath);

        results.push({ code, nome: record.nome, fileName, index: i });
      } catch (err) {
        errors.push({ index: i, nome: record.nome, error: err.message });
      }
    }

    // Generate ZIP if multiple files
    let zipName = null;
    if (results.length > 1) {
      // Small sleep for file handles on Windows
      await new Promise(resolve => setTimeout(resolve, 200));

      zipName = `certificados_${Date.now()}.zip`;
      const zipPath = path.join(outputDir, zipName);
      
      const pdfFiles = results.map(r => ({
        outputPath: path.join(outputDir, r.fileName),
        fileName: r.fileName,
      }));
      await createZip(pdfFiles, zipPath);
    }

    res.json({
      success: true,
      total: results.length,
      certificates: results,
      errors,
      zipName,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/certificates/download/:fileName — Download individual PDF
router.get('/download/:fileName', (req, res) => {
  const filePath = path.join(__dirname, '..', 'outputs', req.params.fileName);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Arquivo não encontrado' });
  }
  res.download(filePath);
});

// GET /api/certificates/download-zip — Download ZIP
router.get('/download-zip', (req, res) => {
  const { fileName } = req.query;
  const zipName = fileName || 'certificados.zip';
  const zipPath = path.join(__dirname, '..', 'outputs', zipName);
  
  if (!fs.existsSync(zipPath)) {
    // If specific zipName not found, maybe look for the most recent one?
    // For simplicity, just return 404.
    return res.status(404).json({ error: 'Arquivo ZIP não encontrado.' });
  }

  // Cache busting
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  
  res.download(zipPath, zipName);
});

// GET /api/certificates/list — List generated certificates
router.get('/list', (req, res) => {
  try {
    const db = getDb();
    const certificates = db.prepare('SELECT * FROM certificates ORDER BY created_at DESC LIMIT 500').all();
    res.json({ success: true, certificates });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
