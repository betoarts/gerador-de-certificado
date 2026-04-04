const fs = require('fs');
const path = require('path');

const DEFAULT_TEMPLATE_PATH = path.join(__dirname, '..', 'templates', 'certificate.html');

function buildCertificateHtml(data, templateConfig = {}) {
  let html = fs.readFileSync(DEFAULT_TEMPLATE_PATH, 'utf-8');

  const {
    primaryColor = '#0f4c75',
    secondaryColor = '#1b262c',
    textColor = '#1a1a2e',
    fontFamily = 'Playfair Display',
    bodyFontFamily = 'Inter',
    titleText = 'CERTIFICADO DE CONCLUSÃO',
    descriptionTemplate = 'Certificamos que <strong>{{nome}}</strong> concluiu com êxito o curso de <strong>{{curso}}</strong>, com carga horária de <strong>{{carga_horaria}} horas</strong>, concluído em <strong>{{data}}</strong>.',
    signatureName = 'Diretor(a) de Ensino',
    signatureTitle = 'Coordenação Acadêmica',
    backgroundImage = '',
    logoImage = '',
    signatureImage = '',
    courseContent = '',
  } = templateConfig;

  // Build description with data
  let finalDescription = descriptionTemplate;
  finalDescription = finalDescription.replace(/\{\{nome\}\}/g, data.nome || '');
  finalDescription = finalDescription.replace(/\{\{curso\}\}/g, data.curso || '');
  finalDescription = finalDescription.replace(/\{\{data\}\}/g, data.data_conclusao || '');
  finalDescription = finalDescription.replace(/\{\{carga_horaria\}\}/g, data.carga_horaria || '');
  finalDescription = finalDescription.replace(/\{\{cpf\}\}/g, data.cpf || '');

  const formattedCourseContent = courseContent || '';

  // Handle conditional blocks {{#if var}}...{{/if}} (process innermost first)
  const condValues = {
    backgroundImage,
    logoImage,
    signatureImage,
    showBorders: !backgroundImage,
    courseContent: !!formattedCourseContent,
  };
  const condRegex = /\{\{#if (\w+)\}\}((?:(?!\{\{#if)[\s\S])*?)\{\{\/if\}\}/g;
  let prevHtml;
  do {
    prevHtml = html;
    html = html.replace(condRegex, (match, varName, content) => {
      return condValues[varName] ? content : '';
    });
  } while (html !== prevHtml);

  // Replace template variables
  const replacements = {
    '{{nome}}': data.nome || '',
    '{{curso}}': data.curso || '',
    '{{data}}': data.data_conclusao || '',
    '{{carga_horaria}}': data.carga_horaria || '',
    '{{codigo}}': data.code || '',
    '{{qrcode}}': data.qrDataUrl || '',
    '{{primaryColor}}': primaryColor,
    '{{secondaryColor}}': secondaryColor,
    '{{textColor}}': textColor,
    '{{fontFamily}}': fontFamily,
    '{{bodyFontFamily}}': bodyFontFamily,
    '{{titleText}}': titleText,
    '{{descriptionText}}': finalDescription,
    '{{signatureName}}': signatureName,
    '{{signatureTitle}}': signatureTitle,
    '{{backgroundImage}}': backgroundImage,
    '{{logoImage}}': logoImage,
    '{{signatureImage}}': signatureImage,
    '{{courseContent}}': formattedCourseContent,
    '{{cpf}}': data.cpf || '',
  };

  for (const [key, value] of Object.entries(replacements)) {
    html = html.split(key).join(value);
  }

  return html;
}

module.exports = { buildCertificateHtml };
