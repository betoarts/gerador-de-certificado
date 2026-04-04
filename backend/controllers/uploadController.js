const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { parseExcel } = require('../services/excelService');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
  ];
  if (allowedMimes.includes(file.mimetype) || file.originalname.endsWith('.xlsx')) {
    cb(null, true);
  } else {
    cb(new Error('Apenas arquivos .xlsx são aceitos'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// POST /api/upload — Upload and parse Excel
router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }

    const result = await parseExcel(req.file.path);

    // Cleanup uploaded file after parsing
    fs.unlink(req.file.path, () => {});

    res.json({
      success: true,
      message: `${result.total} registros encontrados`,
      ...result,
    });
  } catch (err) {
    // Cleanup on error
    if (req.file?.path) fs.unlink(req.file.path, () => {});

    res.status(400).json({
      error: err.message || 'Erro ao processar planilha',
    });
  }
});

// POST /api/upload/assets — Upload logo, signature, or background
const assetUpload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const assetsDir = path.join(__dirname, '..', 'assets');
      if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });
      cb(null, assetsDir);
    },
    filename: (req, file, cb) => {
      const type = req.query.type || 'asset';
      const ext = path.extname(file.originalname);
      cb(null, `${type}-${Date.now()}${ext}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Apenas imagens (PNG, JPG, WebP, SVG) são aceitas'), false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

router.post('/assets', assetUpload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }

    // Read file and convert to base64 data URL
    const filePath = req.file.path;
    const fileBuffer = fs.readFileSync(filePath);
    const base64 = fileBuffer.toString('base64');
    const mimeType = req.file.mimetype;
    const dataUrl = `data:${mimeType};base64,${base64}`;

    res.json({
      success: true,
      url: `/assets/${req.file.filename}`,
      dataUrl,
      filename: req.file.filename,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
