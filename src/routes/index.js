const express = require('express');
const router = express.Router();
const billController = require('../controllers/billController');
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

router.post('/bills', billController.createBill);
router.get('/bills/search', billController.searchBills);
router.get('/bills', billController.getBills);
router.get('/bills/:id', billController.getBillById);

module.exports = router;
