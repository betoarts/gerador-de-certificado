# 🛠️ API Reference — Gerador de Certificados Pro

Documentação completa dos endpoints do backend.

---

## Base

| Propriedade | Valor |
|---|---|
| **Base URL (local)** | `http://localhost:3001/api` |
| **Base URL (produção)** | `https://seu-dominio.com/api` |
| **Content-Type padrão** | `application/json` |
| **Exceção** | Endpoints de upload usam `multipart/form-data` |

---

## 📂 Upload

### `POST /api/upload` — Upload de Planilha Excel

Processa um arquivo `.xlsx` e retorna os dados dos alunos.

**Body:** `multipart/form-data`

| Campo | Tipo | Descrição |
|---|---|---|
| `file` | File | Arquivo `.xlsx` |

**Resposta (200):**
```json
{
  "success": true,
  "message": "10 registros encontrados",
  "total": 10,
  "data": [
    {
      "nome": "Humberto Moura Neto",
      "cpf": "000.000.000-00",
      "curso": "React do Zero ao Pro",
      "data_conclusao": "2026-04-04",
      "carga_horaria": "40"
    }
  ],
  "errors": []
}
```

> [!NOTE]
> As colunas são mapeadas de forma case-insensitive. Nomes aceitos: `Nome`, `CPF`, `Curso`, `Data`, `Data Conclusão`, `Carga Horária`, `CH`.

---

### `POST /api/upload/assets` — Upload de Imagens

Envia imagens de logo, assinatura ou fundo para uso no template.

**Query Params:**

| Param | Valores aceitos |
|---|---|
| `type` | `logo`, `signature`, `background` |

**Body:** `multipart/form-data`

| Campo | Tipo | Formatos aceitos |
|---|---|---|
| `file` | File | PNG, JPG, JPEG, SVG, WebP |

**Resposta (200):**
```json
{
  "success": true,
  "url": "/assets/logo-1712245200.png",
  "filename": "logo-1712245200.png"
}
```

---

## 🎓 Certificados

### `POST /api/certificates/preview` — Prévia HTML

Retorna o HTML renderizado do certificado para prévia no navegador.

**Body:**
```json
{
  "record": {
    "nome": "Humberto",
    "cpf": "000.000.000-00",
    "curso": "React Pro",
    "data_conclusao": "2026-04-04",
    "carga_horaria": "40"
  },
  "templateConfig": {
    "primaryColor": "#0f4c75",
    "secondaryColor": "#1b262c",
    "textColor": "#1a1a2e",
    "fontFamily": "Playfair Display",
    "titleFontWeight": "700",
    "bodyFontFamily": "Inter",
    "bodyFontWeight": "400",
    "titleText": "CERTIFICADO DE CONCLUSÃO",
    "showParticipantName": true,
    "descriptionTemplate": "Certificamos que <strong>{{nome}}</strong>...",
    "signatureName": "Diretor(a) de Ensino",
    "signatureTitle": "Coordenação Acadêmica",
    "backgroundImage": "",
    "logoImage": "",
    "signatureImage": "",
    "courseContent": "<p>Conteúdo do curso em HTML...</p>"
  }
}
```

**Resposta:** `text/html` — HTML completo do certificado.

---

### `POST /api/certificates/generate` — Geração em Massa

Gera PDFs para todos os registros e empacota em um `.zip`.

**Body:**
```json
{
  "records": [ { "nome": "...", "cpf": "...", "curso": "..." } ],
  "templateConfig": { ... }
}
```

**Resposta (200):**
```json
{
  "success": true,
  "total": 5,
  "certificates": [
    {
      "code": "ATDFP-RFQT",
      "nome": "Humberto",
      "fileName": "humberto_ATDFP-RFQT.pdf"
    }
  ],
  "zipName": "certificados_1712245200.zip"
}
```

---

## ⬇️ Downloads

### `GET /api/certificates/download/:fileName` — PDF Individual

Retorna o stream do arquivo PDF.

```
GET /api/certificates/download/humberto_ATDFP-RFQT.pdf
```

---

### `GET /api/certificates/download-zip?fileName=:zipName` — ZIP Completo

Retorna o pacote ZIP com todos os certificados gerados.

```
GET /api/certificates/download-zip?fileName=certificados_1712245200.zip
```

> [!NOTE]
> O header `Cache-Control: no-store` é aplicado para garantir que o arquivo não seja cacheado.

---

## 🔍 Validação

### `GET /api/validate/:code` — Verificar Autenticidade

Verifica se um certificado é legítimo consultando o banco SQLite.

```
GET /api/validate/ATDFP-RFQT
```

**Resposta (200 — válido):**
```json
{
  "valid": true,
  "certificate": {
    "nome": "Humberto Moura Neto",
    "curso": "React do Zero ao Pro",
    "data": "2026-04-04",
    "carga_horaria": "40",
    "generated_at": "2026-04-04T19:30:00.000Z"
  }
}
```

**Resposta (404 — inválido):**
```json
{
  "valid": false,
  "message": "Certificado não encontrado."
}
```

---

## 🏥 Health Check

### `GET /api/health`

```json
{
  "status": "ok",
  "timestamp": "2026-04-04T19:30:00.000Z"
}
```

Usado pelo Easypanel/Docker para verificação de saúde do container.

---

## 📋 templateConfig — Referência Completa

| Campo | Tipo | Padrão | Descrição |
|---|---|---|---|
| `primaryColor` | `string` | `#0f4c75` | Cor principal (título, ornamentos) |
| `secondaryColor` | `string` | `#1b262c` | Cor secundária (nome do aluno) |
| `textColor` | `string` | `#1a1a2e` | Cor do corpo do texto |
| `fontFamily` | `string` | `Playfair Display` | Fonte do título e nome |
| `titleFontWeight` | `string` | `700` | Peso da fonte do título (300–800) |
| `bodyFontFamily` | `string` | `Inter` | Fonte do corpo do texto |
| `bodyFontWeight` | `string` | `400` | Peso da fonte do corpo (300–800) |
| `titleText` | `string` | `CERTIFICADO DE CONCLUSÃO` | Texto principal do título |
| `showParticipantName` | `boolean` | `true` | Exibe/oculta o nome em destaque |
| `descriptionTemplate` | `string` | _(template padrão)_ | Texto do corpo. Suporta `{{nome}}`, `{{cpf}}`, `{{curso}}`, `{{carga_horaria}}`, `{{data}}` |
| `signatureName` | `string` | `Diretor(a) de Ensino` | Nome abaixo da linha de assinatura |
| `signatureTitle` | `string` | `Coordenação Acadêmica` | Cargo/título abaixo da assinatura |
| `backgroundImage` | `string` | `""` | URL da imagem de fundo |
| `logoImage` | `string` | `""` | URL da logo |
| `signatureImage` | `string` | `""` | URL da imagem da assinatura |
| `courseContent` | `string` | `""` | HTML do conteúdo programático (2ª página) |
