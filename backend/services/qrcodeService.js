const QRCode = require('qrcode');

const BASE_URL = process.env.VALIDATION_URL || 'http://localhost:5173';

async function generateQRCode(certificateCode) {
  const validationUrl = `${BASE_URL}/validar/${certificateCode}`;

  const qrDataUrl = await QRCode.toDataURL(validationUrl, {
    width: 150,
    margin: 1,
    color: {
      dark: '#1a1a2e',
      light: '#ffffff',
    },
    errorCorrectionLevel: 'M',
  });

  return { qrDataUrl, validationUrl };
}

module.exports = { generateQRCode };
