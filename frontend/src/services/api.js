import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 120000, // 2 min for PDF generation
});

export async function uploadExcel(file) {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function uploadAsset(file, type) {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await api.post(`/upload/assets?type=${type}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function getPreview(record, templateConfig) {
  const { data } = await api.post('/certificates/preview', { record, templateConfig });
  return data;
}

export async function generateCertificates(records, templateConfig) {
  const { data } = await api.post('/certificates/generate', { records, templateConfig });
  return data;
}

export function getDownloadUrl(fileName) {
  return `/api/certificates/download/${fileName}`;
}

export function getZipDownloadUrl(fileName) {
  const url = '/api/certificates/download-zip';
  return fileName ? `${url}?fileName=${fileName}` : url;
}

export async function validateCertificate(code) {
  const { data } = await api.get(`/validate/${code}`);
  return data;
}

export default api;
