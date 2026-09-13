const db = require('../db/pool');

async function findByUsername(username) {
  const result = await db.query(
    'SELECT id, username, password_hash FROM admin_users WHERE username = $1',
    [username]
  );
  return result.rows[0] || null;
}

async function findById(id) {
  const result = await db.query(
    'SELECT id, username FROM admin_users WHERE id = $1',
    [id]
  );
  return result.rows[0] || null;
}

async function create(username, passwordHash) {
  const result = await db.query(
    'INSERT INTO admin_users (username, password_hash) VALUES ($1, $2) RETURNING id, username',
    [username, passwordHash]
  );
  return result.rows[0];
}

module.exports = { findByUsername, findById, create };
