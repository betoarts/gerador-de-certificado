const { createZip } = require('./backend/services/zipService');
const fs = require('fs');
const path = require('path');

async function testZip() {
  const outputDir = path.join(__dirname, 'backend', 'outputs');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

  // Create dummy files
  const file1 = path.join(outputDir, 'test1.pdf');
  const file2 = path.join(outputDir, 'test2.pdf');
  fs.writeFileSync(file1, 'dummy pdf 1');
  fs.writeFileSync(file2, 'dummy pdf 2');

  const files = [
    { outputPath: file1, fileName: 'test1.pdf' },
    { outputPath: file2, fileName: 'test2.pdf' }
  ];

  const zipPath = path.join(outputDir, 'test_manual.zip');
  try {
    const result = await createZip(files, zipPath);
    console.log('Zip created successfully:', result);
    
    // Test if zip is valid? 
    // We can't easily test zip integrity here without extra libs, 
    // but we can check if it exists and has size.
    if (fs.existsSync(zipPath) && fs.statSync(zipPath).size > 0) {
      console.log('Zip file exists and is not empty.');
    } else {
      console.log('Zip file is empty or missing!');
    }
  } catch (err) {
    console.error('Error creating zip:', err);
  }
}

testZip();
