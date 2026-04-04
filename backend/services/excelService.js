const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

const REQUIRED_COLUMNS = ['Nome', 'Curso', 'Data de Conclusão', 'Carga Horária'];

const COLUMN_ALIASES = {
  'nome': 'Nome',
  'name': 'Nome',
  'aluno': 'Nome',
  'participante': 'Nome',
  'curso': 'Curso',
  'course': 'Curso',
  'treinamento': 'Curso',
  'data de conclusão': 'Data de Conclusão',
  'data conclusão': 'Data de Conclusão',
  'data de conclusao': 'Data de Conclusão',
  'data conclusao': 'Data de Conclusão',
  'data': 'Data de Conclusão',
  'date': 'Data de Conclusão',
  'carga horária': 'Carga Horária',
  'carga horaria': 'Carga Horária',
  'carga': 'Carga Horária',
  'horas': 'Carga Horária',
  'hours': 'Carga Horária',
  'cpf': 'CPF',
  'conteudo do curso': 'Conteudo do curso',
  'conteúdo do curso': 'Conteudo do curso',
  'conteudo': 'Conteudo do curso'
};

function getCellValueText(value) {
  if (value === null || value === undefined) return '';
  if (typeof value === 'object') {
    if (value.richText) return value.richText.map(rt => rt.text).join('');
    if (value.result !== undefined) return value.result;
    if (value.text) return value.text;
    if (value instanceof Date) return value;
  }
  return value;
}

function normalizeColumnName(name) {
  const nameText = getCellValueText(name);
  if (!nameText) return null;
  const normalized = String(nameText).trim().toLowerCase();
  
  if (normalized.includes('cpf') || normalized.includes('documento')) {
    return 'CPF';
  }
  
  return COLUMN_ALIASES[normalized] || null;
}

async function parseExcel(filePath) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);

  const worksheet = workbook.worksheets[0];
  if (!worksheet) {
    throw new Error('Planilha vazia ou inválida');
  }

  // Get header row
  const headerRow = worksheet.getRow(1);
  const columnMap = {};
  const foundColumns = [];

  headerRow.eachCell((cell, colNumber) => {
    const rawVal = getCellValueText(cell.value);
    const normalized = normalizeColumnName(cell.value);
    
    // Log the raw value for debugging
    try {
      fs.appendFileSync(path.join(__dirname, '../debug_headers.log'), `Col ${colNumber}: Raw="${rawVal}", Norm="${normalized}"\n`);
    } catch(e) {}

    if (normalized) {
      columnMap[normalized] = colNumber;
      foundColumns.push(normalized);
    }
  });

  // Validate required columns
  const missingColumns = REQUIRED_COLUMNS.filter(col => !foundColumns.includes(col));
  if (missingColumns.length > 0) {
    throw new Error(
      `Colunas obrigatórias não encontradas: ${missingColumns.join(', ')}. ` +
      `Colunas encontradas: ${headerRow.values?.filter(Boolean).map(getCellValueText).join(', ') || 'nenhuma'}`
    );
  }

  // Parse data rows
  const data = [];
  const errors = [];

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return; // Skip header

    const record = {
      row: rowNumber,
      nome: sanitizeText(getCellValueText(row.getCell(columnMap['Nome']).value)),
      curso: sanitizeText(getCellValueText(row.getCell(columnMap['Curso']).value)),
      data_conclusao: formatDate(getCellValueText(row.getCell(columnMap['Data de Conclusão']).value)),
      carga_horaria: sanitizeText(getCellValueText(row.getCell(columnMap['Carga Horária']).value)),
      cpf: columnMap['CPF'] ? sanitizeText(getCellValueText(row.getCell(columnMap['CPF']).value)) : '',
    };

    // Validate record
    const rowErrors = validateRecord(record, rowNumber);
    if (rowErrors.length > 0) {
      errors.push(...rowErrors);
    } else {
      data.push(record);
    }
  });

  return {
    data,
    errors,
    total: data.length,
    hasErrors: errors.length > 0,
  };
}

function sanitizeHtml(value) {
  if (value === null || value === undefined) return '';
  let text = String(value).trim();
  text = text.replace(/<[^>]*>/g, '');
  text = text.replace(/javascript:/gi, '');
  text = text.replace(/on\w+=/gi, '');
  return text;
}

function sanitizeText(value) {
  if (value === null || value === undefined) return '';
  let text = String(value).trim();
  // Remove HTML tags
  text = text.replace(/<[^>]*>/g, '');
  // Remove script injections
  text = text.replace(/javascript:/gi, '');
  text = text.replace(/on\w+=/gi, '');
  return text;
}

function formatDate(value) {
  if (!value) return '';
  if (value instanceof Date) {
    return value.toLocaleDateString('pt-BR');
  }
  return sanitizeText(String(value));
}

function validateRecord(record, rowNumber) {
  const errors = [];
  if (!record.nome) errors.push({ row: rowNumber, field: 'Nome', message: 'Nome é obrigatório' });
  if (!record.curso) errors.push({ row: rowNumber, field: 'Curso', message: 'Curso é obrigatório' });
  if (!record.data_conclusao) errors.push({ row: rowNumber, field: 'Data de Conclusão', message: 'Data é obrigatória' });
  if (!record.carga_horaria) errors.push({ row: rowNumber, field: 'Carga Horária', message: 'Carga horária é obrigatória' });
  return errors;
}

module.exports = { parseExcel, REQUIRED_COLUMNS };
