import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_DIR = path.join(__dirname, '../data');
const DB_PATH = path.join(DB_DIR, 'data.db');

// Ensure the data directory exists
fs.mkdirSync(DB_DIR, { recursive: true });

const db = new Database(DB_PATH);

// Enable WAL mode for better concurrent read performance
db.pragma('journal_mode = WAL');

// Create tables on startup
db.exec(`
  CREATE TABLE IF NOT EXISTS locations (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    userEmail    TEXT    NOT NULL,
    address     TEXT    NOT NULL,
    lat         REAL    NOT NULL,
    lng         REAL    NOT NULL,
    created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
  );
`);

export default db;
