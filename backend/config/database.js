const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'certificates.db');

let db;

function initDatabase() {
  const fs = require('fs');
  const dataDir = path.join(__dirname, '..', 'data');
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

  db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');

  db.exec(`
    CREATE TABLE IF NOT EXISTS certificates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT UNIQUE NOT NULL,
      nome TEXT NOT NULL,
      curso TEXT NOT NULL,
      data_conclusao TEXT NOT NULL,
      carga_horaria TEXT NOT NULL,
      pdf_path TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_certificates_code ON certificates(code);
  `);

  return db;
}

function getDb() {
  if (!db) initDatabase();
  return db;
}

module.exports = { initDatabase, getDb };
