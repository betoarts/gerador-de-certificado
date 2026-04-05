# 🎓 Gerador de Certificados Pro

Uma plataforma sofisticada e robusta para automação de certificados de alta qualidade. Transforme planilhas Excel em documentos PDF profissionais com QR Code, validação em tempo real e um sistema de design premium.

[![Stack](https://img.shields.io/badge/Stack-React%20%7C%20Node.js%20%7C%20SQLite-blue?style=for-the-badge)](https://github.com/humbertomouraneto) 
[![Docker](https://img.shields.io/badge/Deploy-Docker%20%7C%20Easypanel-2496ED?style=for-the-badge&logo=docker)](https://easypanel.io)

---

## 🚀 Início Rápido (Desenvolvimento Local)

Para rodar em sua máquina Windows:

```powershell
# 1. Instalação Completa
./install.bat

# 2. Iniciar Aplicação (Frontend + Backend)
./start.bat
```

| Serviço | URL | Status |
| :--- | :--- | :--- |
| **Painel Administrativo** | `http://localhost:5173` | 🟢 Online |
| **API do Sistema** | `http://localhost:3001` | 🟢 Online |

---

## ✨ Funcionalidades "Pro"

| Recurso | Excelência Técnica |
| :--- | :--- |
| **Inteligência Excel** | Mapeamento dinâmico e inteligente de colunas (Nome, CPF, Curso, CH, Data). |
| **Design System Custom** | Paleta *Dark Navy & Gold* para uma estética premium e corporativa. |
| **Tipografia Granular** | Fontes **Playfair Display**, **Inter** e **Arial** com pesos variando de 300 a 800. |
| **Rich Text Editor** | Edição visual para o conteúdo programático com suporte a HTML e listas. |
| **QR Code Dinâmico** | Geração automática de QR Code único para validação de autenticidade. |
| **Config Engine** | Sistema de **Exportar/Importar Configuração** via JSON para salvar seus templates. |
| **Suporte Ágil** | Botões de suporte WhatsApp integrados diretamente na interface. |
| **Batch Processing** | Geração assíncrona com processamento de ZIP otimizado para Windows. |

---

## 🐳 Produção & Deploy (Docker)

A aplicação está preparada para deploy em containers, ideal para **Easypanel** ou qualquer ambiente Docker.

### 🧪 Teste Local com Docker
```bash
docker compose up --build
```

### 📋 Configuração de Volumes (Essencial)
Certifique-se de mapear os seguintes volumes para garantir a persistência:

- `cert-uploads`: `/app/backend/uploads` (Planilhas temporárias)
- `cert-outputs`: `/app/backend/outputs` (Certificados e ZIPs gerados)
- `cert-assets`: `/app/backend/assets` (Logos, fundos e assinaturas)
- `cert-data`: `/app/backend/data` (Banco de dados de validação SQLite)

### 🔧 Solução de Problemas (Troubleshooting)

**Erro: "Invalid ELF Header"**
- **Causa**: Ocorre quando módulos nativos (como `better-sqlite3`) são copiados de um ambiente Windows para um container Linux.
- **Solução**: O `Dockerfile` atual já realiza o build interno e o `.dockerignore` exclui os `node_modules` locais. Certifique-se de que o comando `git push` incluiu as últimas alterações do `.dockerignore`.

---

## 🛠️ Stack Tecnológica

### Core
- **Frontend**: React 19, Vite 8, React Router v7.
- **Backend**: Node.js 20 (LTS), Express.
- **Renderização**: Puppeteer (Chromium Headless) para PDFs pixel-perfect.
- **Storage**: SQLite para rastreabilidade e validação ultrarrápida.

### UX/UI
- **Icons**: Lucide-React.
- **Animation**: CSS Transições suaves e Pulse Effects.
- **Colors**: Sistema HSL para contrastes perfeitos.

---

## 👨‍💻 Créditos & Suporte

Desenvolvido com foco em performance e design por **Humberto Moura Neto**.

Para suporte técnico ou customizações:
- 📱 [Chamar no WhatsApp](https://wa.me/5554991680204)
- 🌐 [LinkedIn](https://www.linkedin.com/in/humbertomouraneto/)

---
&copy; 2026 Gerador de Certificados Pro.
