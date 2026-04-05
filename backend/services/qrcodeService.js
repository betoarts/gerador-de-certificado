const QRCode = require('qrcode');

const BASE_URL = process.env.VALIDATION_URL || 'https://certats.servicestec.pro';

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
