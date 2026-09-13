const authService = require('../services/authService');
const config = require('../config');

async function login(req, res, next) {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const result = await authService.login(username, password);

    res.cookie('token', result.token, {
      httpOnly: true,
      secure: config.app.env === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    res.json({ user: result.user });
  } catch (err) {
    if (err.message === 'Invalid username or password') {
      return res.status(401).json({ error: err.message });
    }
    next(err);
  }
}

async function logout(req, res) {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
}

async function me(req, res, next) {
  try {
    const result = await authService.getMe(req.user.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = { login, logout, me };
