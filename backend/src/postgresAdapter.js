const { Pool } = require('pg');

const pool = process.env.DATABASE_URL
  ? new Pool({ connectionString: process.env.DATABASE_URL })
  : null;

async function initPostgres() {
  if (!pool) return;

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS quotes (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      payload JSONB NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);
}

async function saveQuotePostgres(userId, quoteData) {
  if (!pool) return null;
  const id = `quote-${Date.now()}`;
  await pool.query(
    'INSERT INTO quotes (id, user_id, payload) VALUES ($1, $2, $3)',
    [id, userId, quoteData]
  );
  return { id, userId, payload: quoteData };
}

async function listQuotesPostgres(userId) {
  if (!pool) return [];
  const result = await pool.query(
    'SELECT id, user_id as "userId", payload, created_at as "createdAt" FROM quotes WHERE user_id = $1 ORDER BY created_at DESC',
    [userId]
  );
  return result.rows;
}

module.exports = { initPostgres, saveQuotePostgres, listQuotesPostgres };
