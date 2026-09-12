const billService = require('../services/billService');

async function createBill(req, res, next) {
  try {
    const bill = await billService.createBill(req.body);
    res.status(201).json(bill);
  } catch (err) {
    next(err);
  }
}

async function getBills(req, res, next) {
  try {
    const { search, limit, offset } = req.query;
    const bills = await billService.getBills({
      search,
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : undefined,
    });
    res.json(bills);
  } catch (err) {
    next(err);
  }
}

async function getBillById(req, res, next) {
  try {
    const bill = await billService.getBillById(req.params.id);
    res.json(bill);
  } catch (err) {
    next(err);
  }
}

async function searchBills(req, res, next) {
  try {
    const { q } = req.query;
    const bills = await billService.searchBills(q || '');
    res.json(bills);
  } catch (err) {
    next(err);
  }
}

async function getStats(req, res, next) {
  try {
    const count = await billService.getBillCount();
    res.json({ billCount: count });
  } catch (err) {
    next(err);
  }
}

module.exports = { createBill, getBills, getBillById, searchBills, getStats };
