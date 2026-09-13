const bcrypt = require('bcryptjs');
const db = require('./pool');
const config = require('../config');

async function seedAdmin() {
  try {
    const existing = await db.query(
      'SELECT id FROM admin_users WHERE username = $1',
      ['admin']
    );

    const passwordHash = await bcrypt.hash(config.admin.password, 10);

    if (existing.rows.length > 0) {
      await db.query(
        'UPDATE admin_users SET password_hash = $1 WHERE username = $2',
        [passwordHash, 'admin']
      );
      console.log('Admin password synced from ADMIN_PASSWORD env var.');
      return;
    }

    await db.query(
      'INSERT INTO admin_users (username, password_hash) VALUES ($1, $2)',
      ['admin', passwordHash]
    );
    console.log('Admin user seeded successfully.');
  } catch (err) {
    console.error('Failed to seed admin user:', err.message);
  }
}

module.exports = seedAdmin;
