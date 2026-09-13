require('dotenv').config();

const config = {
  app: {
    port: parseInt(process.env.APP_PORT, 10) || 3000,
    env: process.env.NODE_ENV || 'development',
  },
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    name: process.env.DB_NAME || 'billing',
    user: process.env.DB_USER || 'billing_user',
    password: process.env.DB_PASSWORD || 'change_me',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'change_me_too',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },
  admin: {
    password: process.env.ADMIN_PASSWORD || 'admin123',
  },
  business: {
    name: process.env.BUSINESS_NAME || 'Your Business Name',
    address: process.env.BUSINESS_ADDRESS || '123 Main Street, City',
    phone: process.env.BUSINESS_PHONE || '+1234567890',
    email: process.env.BUSINESS_EMAIL || 'business@example.com',
    gstin: process.env.BUSINESS_GSTIN || '',
  },
};

module.exports = config;
