const ExcelJS = require('exceljs');
const path = require('path');

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
};

function normalizeColumnName(name) {
  if (!name) return null;
  const normalized = String(name).trim().toLowerCase();
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
    const normalized = normalizeColumnName(cell.value);
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
      `Colunas encontradas: ${headerRow.values?.filter(Boolean).join(', ') || 'nenhuma'}`
    );
  }

  // Parse data rows
  const data = [];
  const errors = [];

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return; // Skip header

    const record = {
      row: rowNumber,
      nome: sanitizeText(row.getCell(columnMap['Nome']).value),
      curso: sanitizeText(row.getCell(columnMap['Curso']).value),
      data_conclusao: formatDate(row.getCell(columnMap['Data de Conclusão']).value),
      carga_horaria: sanitizeText(row.getCell(columnMap['Carga Horária']).value),
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
