const express = require('express');
const router = express.Router();
const billController = require('../controllers/billController');
const authMiddleware = require('../middleware/auth');
const config = require('../config');

router.get('/health', async (req, res) => {
  try {
    const db = require('../db/pool');
    await db.query('SELECT 1');
    res.json({ status: 'ok', database: 'connected' });
  } catch (err) {
    res.status(503).json({ status: 'error', database: 'disconnected' });
  }
});

router.get('/config', (req, res) => {
  res.json({
    business: config.business,
  });
});

router.post('/bills', authMiddleware, billController.createBill);
router.get('/bills/search', authMiddleware, billController.searchBills);
router.get('/bills', authMiddleware, billController.getBills);
router.get('/bills/:id', authMiddleware, billController.getBillById);

module.exports = router;
