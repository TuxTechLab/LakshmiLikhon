const bcrypt = require('bcryptjs');
const adminRepository = require('../repositories/adminRepository');
const { generateToken } = require('../utils/jwt');

async function login(username, password) {
  const admin = await adminRepository.findByUsername(username);
  if (!admin) {
    throw new Error('Invalid username or password');
  }

  const valid = await bcrypt.compare(password, admin.password_hash);
  if (!valid) {
    throw new Error('Invalid username or password');
  }

  const token = generateToken(admin);
  return { token, user: { id: admin.id, username: admin.username } };
}

async function getMe(userId) {
  const admin = await adminRepository.findById(userId);
  if (!admin) {
    throw new Error('User not found');
  }
  return { user: admin };
}

module.exports = { login, getMe };
