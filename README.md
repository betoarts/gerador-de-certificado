# 🎓 Gerador de Certificados Pro

Uma aplicação completa de ponta a ponta para geração automatizada de certificados em PDF a partir de planilhas Excel. Ideal para cursos, workshops e eventos educacionais.

[![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20Node.js%20%7C%20SQLite-blue)](https://github.com/humbertomouraneto/gerador-de-certificado)

---

## 🚀 Guia Rápido (Quick Start)

Para rodar a aplicação localmente no Windows:

1.  **Instalação**: Execute o arquivo `install.bat` para instalar todas as dependências do Frontend e Backend.
2.  **Iniciar**: Execute o arquivo `start.bat`.
    -   O **Backend** rodará em: `http://localhost:3001`
    -   O **Frontend** rodará em: `http://localhost:5173` (ou porta alternativa mostrada no terminal).

> [!TIP]
> Para acesso via rede local (celular ou outro PC), o Vite está configurado para expor o servidor via `--host`. Utilize o IP mostrado no terminal do Frontend.

---

## ✨ Funcionalidades Principais

| Recurso | Descrição |
| :--- | :--- |
| **Upload Excel** | Suporte a arquivos `.xlsx` com mapeamento dinâmico de colunas. |
| **Editor Visual** | Personalização de cores, fontes e upload de logos, assinaturas e fundos. |
| **Preview em Real-Time** | Visualize o certificado exatamente como será gerado. |
| **QR Code & Tracking** | Cada certificado possui um QR Code único e código de validação. |
| **Download em Lote** | Geração ultrarrápida com opção de download consolidado em arquivo ZIP. |
| **Validação Online** | Página dedicada para verificação de autenticidade (`/validar`). |

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 19** + **Vite 8**
- **Lucide-React** para ícones.
- **Axios** para comunicação com API.
- **CSS3 Vanilla** com design system customizado (Dark Navy & Gold).

### Backend
- **Node.js** + **Express**
- **Puppeteer**: Motor de renderização PDF de alta qualidade.
- **ExcelJS**: Processamento de planilhas de dados.
- **Archiver**: Gerenciamento de compressão ZIP.
- **SQLite (better-sqlite3)**: Armazenamento local para validação de certificados.

---

## 📁 Estrutura de Pastas

```text
/
├── backend/            # Servidor Express, Rotas e Lógica de PDF
│   ├── assets/         # Logo, assinaturas e fundos enviados
│   ├── controllers/    # Controladores da API
│   ├── services/       # Serviços de Template, PDF e ZIP
│   └── templates/      # Estrutura HTML/CSS do certificado
├── frontend/           # Aplicação React
│   ├── src/            # Componentes e Estilos
│   └── public/         # Ativos estáticos
├── install.bat         # Script de instalação automatizada
└── start.bat           # Script de inicialização simultânea
```

---

## 📌 Nomenclatura de Arquivos

Para facilitar a identificação, os PDFs são nomeados automaticamente seguindo o padrão:
`[nome_aluno]_[codigo_unico].pdf`

Exemplo: `humberto_ATDFP-RFQT.pdf`

---

## 🔐 Segurança e Performance

- **Windows Compatibility**: Fix de erro `0x80004005` integrado na geração de ZIP.
- **Rate Limiting**: Proteção básica de endpoints no backend.
- **Sanitização**: Filtro de nomes e variáveis para evitar problemas no sistema de arquivos.

---

## 👨‍💻 Desenvolvedor

Este projeto foi desenvolvido por **Humberto Moura Neto**.

&copy; 2026 - Todos os direitos reservados.
