const ExcelJS = require('exceljs');
const path = require('path');

async function createTestExcel() {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Certificados');

  worksheet.columns = [
    { header: 'Nome', key: 'nome', width: 30 },
    { header: 'Curso', key: 'curso', width: 30 },
    { header: 'Data de Conclusão', key: 'data', width: 20 },
    { header: 'Carga Horária', key: 'horas', width: 15 },
  ];

  const records = [
    { nome: 'Maria Silva', curso: 'Desenvolvimento Web Full Stack', data: '15/03/2026', horas: '120' },
    { nome: 'João Santos', curso: 'Inteligência Artificial Aplicada', data: '20/03/2026', horas: '80' },
    { nome: 'Ana Oliveira', curso: 'Design UX/UI', data: '25/03/2026', horas: '60' },
    { nome: 'Carlos Pereira', curso: 'Gestão de Projetos Ágeis', data: '01/04/2026', horas: '40' },
    { nome: 'Fernanda Costa', curso: 'Marketing Digital', data: '05/04/2026', horas: '90' },
  ];

  records.forEach(r => worksheet.addRow(r));

  // Style header
  worksheet.getRow(1).font = { bold: true };
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF2196F3' },
  };
  worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };

  const outputPath = path.join(__dirname, 'test-data.xlsx');
  await workbook.xlsx.writeFile(outputPath);
  console.log(`Test Excel created: ${outputPath}`);
}

createTestExcel().catch(console.error);
