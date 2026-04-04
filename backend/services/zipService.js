const archiver = require('archiver');
const fs = require('fs');
const path = require('path');

function createZip(pdfFiles, outputPath) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outputPath);
    const archive = archiver('zip', { 
      zlib: { level: 6 },
      forceZip64: false 
    });

    archive.on('warning', (err) => {
      if (err.code === 'ENOENT') {
        process.env.NODE_ENV !== 'production' && console.warn('Archiver warning:', err);
      } else {
        reject(err);
      }
    });

    archive.on('error', (err) => {
      reject(err);
    });

    output.on('error', (err) => {
      reject(err);
    });

    output.on('close', () => {
      resolve({ size: archive.pointer(), path: outputPath });
    });

    archive.pipe(output);

    for (const file of pdfFiles) {
      if (fs.existsSync(file.outputPath)) {
        archive.file(file.outputPath, { name: file.fileName });
      }
    }

    archive.finalize();
  });
}

module.exports = { createZip };
