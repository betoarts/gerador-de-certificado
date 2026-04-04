# 🛠️ Documentação da API - Gerador de Certificados Pro

Esta documentação descreve os endpoints disponíveis no backend da aplicação para integração e automação.

---

## 🏗️ Estrutura Base
- **Base URL**: `http://localhost:3001/api`
- **Content-Type**: `application/json` (exceto uploads de arquivos)

---

## 📂 Upload de Arquivos

### 1. Upload de Planilha Excel
Envia um arquivo `.xlsx` para processamento de dados.

- **URL**: `/upload`
- **Método**: `POST`
- **Body**: `multipart/form-data`
  - `file`: Arquivo Excel (.xlsx)
- **Resposta (Sucesso)**:
  ```json
  {
    "success": true,
    "message": "10 registros encontrados",
    "total": 10,
    "data": [
      { "nome": "Fulano", "curso": "React", "data": "2024-01-01", "carga_horaria": 40 },
      ...
    ],
    "errors": []
  }
  ```

### 2. Upload de Ativos (Imagens)
Envia logos, assinaturas ou imagens de fundo para o servidor.

- **URL**: `/upload/assets`
- **Método**: `POST`
- **Query Params**: `type` (ex: `logo`, `signature`, `background`)
- **Body**: `multipart/form-data`
  - `file`: Imagem (PNG, JPG, SVG, WebP)
- **Resposta (Sucesso)**:
  ```json
  {
    "success": true,
    "url": "/assets/logo-1712245200.png",
    "filename": "logo-1712245200.png"
  }
  ```

---

## 🎓 Certificados

### 1. Gerar Preview HTML
Gera o HTML do certificado para visualização instantânea.

- **URL**: `/certificates/preview`
- **Método**: `POST`
- **Body**:
  ```json
  {
    "record": { "nome": "Humberto", "curso": "Vite", "data": "2026-04-04", "carga_horaria": 10 },
    "templateConfig": { "primaryColor": "#0f4c75", "fontFamily": "Inter" }
  }
  ```
- **Resposta**: Retorna a string HTML formatada.

### 2. Geração em Massa (PDF + ZIP)
Processa a lista de registros e gera os arquivos PDF.

- **URL**: `/certificates/generate`
- **Método**: `POST`
- **Body**:
  ```json
  {
    "records": [...],
    "templateConfig": {...}
  }
  ```
- **Resposta**:
  ```json
  {
    "success": true,
    "total": 5,
    "certificates": [
      { "code": "ABC123XYZ", "nome": "Fulano", "fileName": "fulano_ABC123XYZ.pdf" },
      ...
    ],
    "zipName": "certificados_1712245200.zip"
  }
  ```

---

## ⬇️ Downloads

### 1. Download de PDF Individual
- **URL**: `/certificates/download/:fileName`
- **Método**: `GET`
- **Nota**: Retorna o stream do arquivo PDF.

### 2. Download do Pacote ZIP
- **URL**: `/certificates/download-zip`
- **Método**: `GET`
- **Query Params**: `fileName` (Obrigatório - nome do ZIP retornado na geração)
- **Nota**: Este endpoint possui headers de `Cache-Control: no-store` para garantir a integridade.

---

## 🔍 Validação

### Verificação de Autenticidade
Valida se um certificado é legítimo através do código único.

- **URL**: `/validate/:code`
- **Método**: `GET`
- **Exemplo**: `/validate/ABC123XYZ`
- **Resposta (Sucesso)**:
  ```json
  {
    "valid": true,
    "certificate": {
      "nome": "Fulano",
      "curso": "React Pro",
      "data": "2024-05-10",
      "carga_horaria": 60,
      "generated_at": "2024-05-10T15:30:00.000Z"
    }
  }
  ```

---

## 🏥 Health Check
- **URL**: `/health`
- **Método**: `GET`
- **Uso**: Monitoramento de status do servidor.
