const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const config = require('./config');
const routes = require('./routes');
const authRoutes = require('./routes/auth');
const errorHandler = require('./middleware/errorHandler');
const migrate = require('./db/migrate');
const seedAdmin = require('./db/seed');

const app = express();

app.use(helmet({
  contentSecurityPolicy: false,
}));
app.use(cors({
  origin: config.app.env === 'production'
    ? true
    : ['http://localhost:3001', 'http://127.0.0.1:3001'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api', routes);

app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.status(404).json({ error: 'Not found' });
  }
});

app.use(errorHandler);

async function start() {
  try {
    console.log('Running database migrations...');
    await migrate();

    console.log('Seeding admin user...');
    await seedAdmin();

    app.listen(config.app.port, '0.0.0.0', () => {
      console.log(`Server running on port ${config.app.port} (${config.app.env})`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();

module.exports = app;
