const express = require('express');
const helmet = require('helmet');
const path = require('path');
const config = require('./config');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const migrate = require('./db/migrate');

const app = express();

app.use(helmet({
  contentSecurityPolicy: false,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '../public')));

app.use('/api', routes);

app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '../public/index.html'));
  }
});

app.use(errorHandler);

async function start() {
  try {
    console.log('Running database migrations...');
    await migrate();

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
