const express = require('express');
const { getDb } = require('../config/database');

const router = express.Router();

// GET /api/validate/:code — Validate certificate by code
router.get('/:code', (req, res) => {
  try {
    const { code } = req.params;
    if (!code || code.length < 5) {
      return res.status(400).json({ error: 'Código inválido' });
    }

    const db = getDb();
    const certificate = db.prepare(
      'SELECT code, nome, curso, data_conclusao, carga_horaria, created_at FROM certificates WHERE code = ?'
    ).get(code);

    if (!certificate) {
      return res.status(404).json({
        valid: false,
        error: 'Certificado não encontrado',
      });
    }

    res.json({
      valid: true,
      certificate: {
        code: certificate.code,
        nome: certificate.nome,
        curso: certificate.curso,
        data_conclusao: certificate.data_conclusao,
        carga_horaria: certificate.carga_horaria,
        emitido_em: certificate.created_at,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
