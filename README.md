# 🎓 Gerador de Certificados Pro

Uma aplicação completa de ponta a ponta para geração automatizada de certificados em PDF a partir de planilhas Excel. Ideal para cursos, workshops e eventos educacionais.

[![Stack](https://img.shields.io/badge/Stack-React%20%7C%20Node.js%20%7C%20SQLite-blue)](https://github.com/humbertomouraneto) [![Docker](https://img.shields.io/badge/Deploy-Docker%20%7C%20Easypanel-2496ED?logo=docker)](https://easypanel.io)

---

## 🚀 Início Rápido (Desenvolvimento Local — Windows)

```bash
# 1. Instalar dependências (frontend e backend)
install.bat

# 2. Iniciar a aplicação
start.bat
```

| Serviço | URL |
|---|---|
| Frontend (React) | `http://localhost:5173` |
| Backend (API) | `http://localhost:3001` |

> [!TIP]
> Acesso via **rede local** (celular/outro PC): o Vite está configurado com `--host`. Utilize o IP exibido no terminal do Frontend.

---

## ✨ Funcionalidades

| Recurso | Descrição |
|:---|:---|
| **Upload Excel** | Suporte a `.xlsx` com mapeamento dinâmico de colunas (Nome, CPF, Curso, Carga Horária, Data) |
| **Editor Visual** | Personalização completa: cores, fontes, peso tipográfico, logos, assinatura e fundo |
| **Tipografia Avançada** | Suporte a **Playfair Display**, **Inter**, **Arial** com controle de peso (300–800) para títulos e corpo |
| **Nome do Aluno Opcional** | Toggle para exibir ou ocultar o nome em destaque no certificado |
| **Editor de Conteúdo** | Mini rich-text editor para o verso do certificado (negrito, itálico, listas) |
| **Preview em Tempo Real** | Visualização HTML do certificado antes da geração em PDF |
| **QR Code & Tracking** | Código único por certificado com QR Code embutido para validação online |
| **Download em Lote** | Geração em massa com download consolidado em arquivo `.zip` |
| **Validação Online** | Página pública em `/validar/:codigo` para verificação de autenticidade |
| **Exportar / Importar Config** | Salva todas as configurações do template em `.json` para reutilização futura |
| **Suporte WhatsApp** | Botão flutuante de suporte direto no app |

---

## 🛠️ Tecnologias

### Frontend
- **React 19** + **Vite 8**
- **React Router DOM 7** — roteamento SPA
- **Lucide React** — ícones
- **Axios** — requisições HTTP
- **CSS3 Vanilla** — design system customizado (Dark Navy & Gold)

### Backend
- **Node.js** + **Express**
- **Puppeteer + Chromium** — renderização e exportação de PDF
- **ExcelJS** — leitura de planilhas `.xlsx`
- **Archiver** — geração de pacotes `.zip`
- **SQLite (`better-sqlite3`)** — banco de dados para validação de certificados
- **Helmet + express-rate-limit** — segurança e proteção de endpoints
- **sanitize-html** — sanitização de entradas

---

## 📁 Estrutura de Pastas

```text
/
├── Dockerfile              # Build multi-stage para deploy em container
├── .dockerignore           # Arquivos excluídos do build Docker
├── docker-compose.yml      # Configuração para teste local com Docker
├── backend/
│   ├── assets/             # Logos, assinaturas e fundos enviados
│   ├── config/             # Inicialização do banco SQLite
│   ├── controllers/        # Controladores: upload, certificate, validation
│   ├── data/               # Banco de dados SQLite (gerado em runtime)
│   ├── outputs/            # PDFs e ZIPs gerados
│   ├── services/           # PDF, Template, Excel, ZIP
│   ├── templates/          # HTML/CSS do certificado
│   ├── uploads/            # Planilhas enviadas temporariamente
│   └── server.js           # Entry point Express
├── frontend/
│   ├── src/
│   │   ├── components/     # FileUpload, TemplateEditor, RichTextEditor, Header...
│   │   ├── App.jsx         # Máquina de estados principal (5 etapas)
│   │   └── index.css       # Design system global
│   └── vite.config.js
├── install.bat             # Instalação automatizada (Windows)
└── start.bat               # Inicialização simultanea frontend + backend
```

---

## 🔄 Fluxo da Aplicação

```
[1. Upload Excel] → [2. Pré-visualização de Dados] → [3. Editor de Template]
       → [4. Geração de PDFs] → [5. Download ZIP]
```

Cada etapa é gerenciada pelo `App.jsx` como uma máquina de estados simples.

---

## 📌 Padrão de Nomenclatura dos PDFs

```
[nome_do_aluno]_[codigo_unico].pdf
Exemplo: humberto_ATDFP-RFQT.pdf
```

---

## 🐳 Deploy (Easypanel / Docker)

A aplicação é distribuída como um **único container** (frontend buildado dentro do backend):

```bash
# Testar localmente com Docker
docker compose up --build

# Acesse: http://localhost:3001
```

### Configuração Easypanel

| Campo | Valor |
|---|---|
| Build Method | Dockerfile |
| Port | `3001` |

**Volumes obrigatórios** (para persistência de dados):

| Nome | Caminho no Container |
|---|---|
| `cert-uploads` | `/app/backend/uploads` |
| `cert-outputs` | `/app/backend/outputs` |
| `cert-assets` | `/app/backend/assets` |
| `cert-data` | `/app/backend/data` |

> [!IMPORTANT]
> Sem os volumes, certificados gerados, imagens enviadas e o banco de dados serão **perdidos** ao reiniciar o container.

---

## 🔐 Segurança

- **Rate Limiting** — proteção de endpoints de geração
- **Helmet** — headers HTTP de segurança
- **sanitize-html** — sanitização de entradas do usuário
- **CORS** — configurável via variável de ambiente `FRONTEND_URL`

---

## 👨‍💻 Desenvolvedor

Desenvolvido por **Humberto Moura Neto**  
📞 Suporte: [WhatsApp](https://wa.me/5554991680204)

&copy; 2026 — Todos os direitos reservados.
