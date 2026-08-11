const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, '..', 'data', 'cotbav.sqlite'));

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS quotes (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    payload TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );
`);

function upsertUser(user) {
  const stmt = db.prepare(`
    INSERT INTO users (id, email, name)
    VALUES (@id, @email, @name)
    ON CONFLICT(id) DO UPDATE SET email=excluded.email, name=excluded.name
  `);
  stmt.run(user);
}

function createQuote(userId, payload) {
  const id = `quote-${Date.now()}`;
  const stmt = db.prepare(`
    INSERT INTO quotes (id, user_id, payload)
    VALUES (@id, @userId, @payload)
  `);
  stmt.run({ id, userId, payload: JSON.stringify(payload) });
  return { id, userId, payload };
}

function listQuotesByUser(userId) {
  const stmt = db.prepare(`SELECT id, user_id AS userId, payload, created_at AS createdAt FROM quotes WHERE user_id = ? ORDER BY created_at DESC`);
  return stmt.all(userId).map((row) => ({ ...row, payload: JSON.parse(row.payload) }));
}

module.exports = { upsertUser, createQuote, listQuotesByUser };
