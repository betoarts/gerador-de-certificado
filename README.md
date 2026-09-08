# Gerador de Certificados Pro

> Plataforma para transformar planilhas de participantes em certificados profissionais em PDF, com personalização visual, QR Code de validação e geração em lote.

![Gerador de Certificados — Excel, PDF e QR Code](https://github.com/betoarts/gerador-de-certificado/raw/main/docs/certificado-generator-cover.jpg)

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=20232a)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![SQLite](https://img.shields.io/badge/SQLite-local-003B57?logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![Docker](https://img.shields.io/badge/Docker-ready-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

O **Gerador de Certificados Pro** simplifica a criação de certificados digitais para cursos, treinamentos, eventos e capacitações. A aplicação importa dados de Excel, permite configurar o layout, gera PDFs individualmente ou em lote e inclui QR Codes para validação da autenticidade.

> **Status:** em desenvolvimento ativo. Valide os requisitos legais, a identidade visual e o fluxo de conferência antes de usar em produção.

## Principais recursos

- **Importação de Excel:** leitura de planilhas com mapeamento flexível de nome, CPF, curso, carga horária e data.
- **Editor visual:** personalização de textos, campos, posições, fontes, cores, logos, fundos e assinaturas.
- **Templates reutilizáveis:** exportação e importação de configurações em JSON.
- **Pré-visualização:** conferência do certificado antes da geração final.
- **PDF de alta fidelidade:** renderização com Puppeteer e Chromium headless.
- **QR Code individual:** código único para validação de autenticidade.
- **Geração em lote:** processamento de vários participantes e compactação em ZIP.
- **Validação:** armazenamento local dos registros e consulta de certificados emitidos.
- **Segurança operacional:** rate limit, Helmet e sanitização de HTML no backend.
- **Interface responsiva:** uso em desktop, tablet e diferentes tamanhos de tela.
- **Suporte Docker:** volumes persistentes para dados, uploads, assets e arquivos gerados.

## Fluxo de geração

    Planilha Excel
          ↓
    Mapeamento dos campos
          ↓
    Escolha e personalização do template
          ↓
    Pré-visualização
          ↓
    Geração de PDF + QR Code
          ↓
    Download individual ou pacote ZIP

## Arquitetura

    gerador-de-certificado/
    ├── backend/
    │   ├── server.js              # API Express
    │   ├── database/              # SQLite, schema e migrações
    │   ├── uploads/               # Planilhas recebidas
    │   ├── outputs/               # PDFs e ZIPs gerados
    │   ├── assets/                # Logos, fundos e assinaturas
    │   ├── data/                  # Banco e dados persistentes
    │   └── package.json           # Dependências do backend
    ├── frontend/
    │   ├── src/                   # Interface React
    │   ├── public/                # Assets públicos
    │   └── package.json           # Dependências do frontend
    ├── API.md                     # Referência da API
    ├── Dockerfile                 # Build da aplicação
    ├── docker-compose.yml         # Execução containerizada
    ├── install.bat                # Instalação no Windows
    └── start.bat                  # Inicialização no Windows

## Stack tecnológica

| Camada | Tecnologia |
| --- | --- |
| Frontend | React 19 + Vite 8 |
| Linguagem | JavaScript |
| Backend | Node.js + Express |
| Planilhas | ExcelJS |
| PDF | Puppeteer |
| QR Code | qrcode |
| Banco de dados | SQLite + better-sqlite3 |
| Arquivos ZIP | Archiver |
| Segurança | Helmet, express-rate-limit e sanitize-html |
| Infraestrutura | Docker e Docker Compose |

## Pré-requisitos

- Node.js 20 ou superior;
- npm;
- Chromium compatível com Puppeteer;
- Docker Desktop, caso utilize containers;
- Windows, Linux ou macOS.

## Execução local

### Windows

1. Execute o instalador:

       install.bat

2. Inicie frontend e backend:

       start.bat

3. Acesse:

       http://localhost:5173

A API estará disponível em:

       http://localhost:3001

### Execução manual

1. Instale as dependências do backend:

       cd backend
       npm install

2. Inicie a API:

       npm start

3. Em outro terminal, instale e inicie o frontend:

       cd frontend
       npm install
       npm run dev

O frontend utiliza a porta padrão do Vite e o backend utiliza a porta definida por `PORT`, com padrão `3001`.

## Execução com Docker

1. Construa e inicie a aplicação:

       docker compose up --build -d

2. Acesse:

       http://localhost:3001

O Docker Compose utiliza volumes persistentes para:

| Volume | Diretório | Conteúdo |
| --- | --- | --- |
| cert_uploads | `/app/backend/uploads` | Planilhas recebidas |
| cert_outputs | `/app/backend/outputs` | PDFs e arquivos ZIP |
| cert_assets | `/app/backend/assets` | Logos, fundos e assinaturas |
| cert_data | `/app/backend/data` | Banco SQLite e registros |

Para encerrar:

       docker compose down

## Variáveis de ambiente

| Variável | Padrão | Finalidade |
| --- | --- | --- |
| `PORT` | `3001` | Porta da API |
| `NODE_ENV` | desenvolvimento | Ambiente de execução |
| `FRONTEND_URL` | vazio | Origem permitida para integrações externas |

Exemplo:

       PORT=3001
       NODE_ENV=production
       FRONTEND_URL=https://seu-dominio.com

Não versione arquivos `.env` nem credenciais no repositório.

## API

A API está documentada em [API.md](API.md). Os grupos principais incluem:

| Grupo | Finalidade |
| --- | --- |
| Saúde | Verificar disponibilidade da API |
| Certificados | Criar, gerar, consultar e validar certificados |
| Participantes | Importar e consultar dados de planilhas |
| Templates | Salvar, editar e reutilizar modelos |
| Assets | Gerenciar imagens, logos, fundos e assinaturas |
| Exportação | Gerar PDFs individuais ou ZIPs |
| Configuração | Exportar e importar definições do sistema |

O endpoint de saúde usado pelo Docker é:

       GET /api/health

## Dados e persistência

O sistema utiliza SQLite para manter registros de validação e configurações. Os diretórios de trabalho são:

- `backend/data`: banco e dados internos;
- `backend/uploads`: arquivos de entrada;
- `backend/outputs`: PDFs e ZIPs;
- `backend/assets`: recursos visuais dos certificados.

Faça backup dos quatro diretórios quando precisar preservar integralmente a operação.

## Boas práticas de uso

- Padronize os nomes das colunas da planilha antes da importação.
- Revise a pré-visualização antes de gerar grandes lotes.
- Teste QR Codes e links de validação antes de distribuir certificados.
- Use nomes de arquivos e identificadores consistentes.
- Evite inserir dados pessoais desnecessários em certificados públicos.
- Mantenha templates e assets organizados por evento ou instituição.

## Segurança

- Troque configurações padrão antes da implantação.
- Coloque a aplicação atrás de HTTPS em ambientes externos.
- Restrinja uploads por tamanho e tipo de arquivo.
- Proteja os diretórios de saída e assets contra acesso indevido.
- Faça backups e valide restaurações periodicamente.
- Não exponha o SQLite diretamente na internet.
- Revise dados pessoais, links de validação e requisitos da LGPD.
- Nunca versione credenciais, arquivos de ambiente ou certificados de clientes.

## Scripts úteis

| Comando | Descrição |
| --- | --- |
| `npm install` | Instala dependências |
| `npm start` | Inicia o backend |
| `npm run dev` | Inicia o frontend |
| `npm run build` | Gera o build de produção |
| `npm run preview` | Visualiza o build local |
| `docker compose up --build -d` | Constrói e inicia o container |
| `docker compose down` | Para os containers |
| `install.bat` | Instala dependências no Windows |
| `start.bat` | Inicia a aplicação no Windows |

## Contribuição

1. Crie uma branch para sua alteração.
2. Mantenha as mudanças de frontend, backend e templates documentadas.
3. Execute o build antes de abrir um pull request.
4. Teste importação, pré-visualização, geração individual, geração em lote e validação.
5. Descreva no pull request os testes realizados e os possíveis impactos.

## Licença

Este projeto está distribuído sob a licença [MIT](LICENSE).

## Autor

Desenvolvido por [betoarts](https://github.com/betoarts).
