const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const { buildCertificateHtml } = require('./templateService');

let browserInstance = null;

async function getBrowser() {
  if (!browserInstance || !browserInstance.connected) {
    browserInstance = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
      ],
    });
  }
  return browserInstance;
}

async function generatePdf(data, templateConfig, outputDir) {
  const html = buildCertificateHtml(data, templateConfig);
  const browser = await getBrowser();
  const page = await browser.newPage();

  try {
    await page.setContent(html, { waitUntil: 'networkidle0', timeout: 30000 });
    
    const firstName = (data.nome || 'aluno').split(' ')[0]
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove accents
      .replace(/[^a-z0-9]/g, "");    // Keep only alphanumeric
      
    const fileName = `${firstName}_${data.code}.pdf`;
    const outputPath = path.join(outputDir, fileName);

    await page.pdf({
      path: outputPath,
      format: 'A4',
      landscape: true,
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });

    return { fileName, outputPath };
  } finally {
    await page.close();
  }
}

async function generatePreviewHtml(data, templateConfig) {
  return buildCertificateHtml(data, templateConfig);
}

async function closeBrowser() {
  if (browserInstance) {
    await browserInstance.close();
    browserInstance = null;
  }
}

process.on('exit', () => closeBrowser());
process.on('SIGINT', () => closeBrowser());

module.exports = { generatePdf, generatePreviewHtml, closeBrowser };
