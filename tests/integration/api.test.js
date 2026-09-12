const { describe, it, before, after } = require('node:test');
const assert = require('node:assert/strict');

const TEST_APP_PORT = 3099;
let serverProcess;
let baseUrl;

before(async function () {
  process.env.APP_PORT = TEST_APP_PORT;
  process.env.DB_HOST = 'localhost';
  process.env.DB_PORT = '5432';
  process.env.DB_NAME = 'billing_test';
  process.env.DB_USER = 'billing_user';
  process.env.DB_PASSWORD = 'change_me';
  process.env.NODE_ENV = 'test';

  const { execSync, spawn } = require('child_process');

  baseUrl = `http://localhost:${TEST_APP_PORT}`;

  serverProcess = spawn('node', ['src/server.js'], {
    env: { ...process.env, APP_PORT: TEST_APP_PORT },
    stdio: 'pipe',
  });

  await new Promise(function (resolve) {
    serverProcess.stdout.on('data', function (data) {
      if (data.toString().includes('Server running')) {
        resolve();
      }
    });
    serverProcess.stderr.on('data', function (data) {
      console.error('stderr:', data.toString());
    });
    setTimeout(resolve, 5000);
  });
});

after(function () {
  if (serverProcess) {
    serverProcess.kill();
  }
});

async function apiCall(method, path, body) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body) {
    options.body = JSON.stringify(body);
  }
  const res = await fetch(`${baseUrl}${path}`, options);
  const data = await res.json();
  return { status: res.status, data };
}

describe('Health endpoint', function () {
  it('should return ok status', async function () {
    const { status, data } = await apiCall('GET', '/api/health');
    assert.equal(status, 200);
    assert.equal(data.status, 'ok');
  });
});

describe('Bill creation', function () {
  it('should create a bill with valid data', async function () {
    const { status, data } = await apiCall('POST', '/api/bills', {
      customer_name: 'Test Customer',
      customer_phone: '1234567890',
      customer_address: '123 Test Street',
      items: [
        { product_name: 'Shirt', quantity: 2, unit_price: 500 },
        { product_name: 'Pants', quantity: 1, unit_price: 800 },
      ],
      discount: 100,
      bill_date: '2026-01-15',
    });

    assert.equal(status, 201);
    assert.ok(data.bill_number);
    assert.ok(data.bill_number.startsWith('BILL-'));
    assert.equal(data.customer_name, 'Test Customer');
    assert.equal(data.subtotal, 1800);
    assert.equal(data.discount, 100);
    assert.equal(data.total, 1700);
    assert.equal(data.items.length, 2);
  });

  it('should reject bill without customer name', async function () {
    const { status, data } = await apiCall('POST', '/api/bills', {
      items: [{ product_name: 'Shirt', quantity: 1, unit_price: 100 }],
    });

    assert.equal(status, 400);
    assert.ok(data.error);
  });

  it('should reject bill without items', async function () {
    const { status, data } = await apiCall('POST', '/api/bills', {
      customer_name: 'Test',
      items: [],
    });

    assert.equal(status, 400);
    assert.ok(data.error);
  });
});

describe('Bill retrieval', function () {
  it('should list bills', async function () {
    const { status, data } = await apiCall('GET', '/api/bills');
    assert.equal(status, 200);
    assert.ok(Array.isArray(data));
    assert.ok(data.length > 0);
  });

  it('should get bill by id', async function () {
    const list = await apiCall('GET', '/api/bills');
    const firstBill = list.data[0];

    const { status, data } = await apiCall('GET', '/api/bills/' + firstBill.id);
    assert.equal(status, 200);
    assert.equal(data.id, firstBill.id);
    assert.ok(Array.isArray(data.items));
  });

  it('should return 404 for non-existent bill', async function () {
    const { status } = await apiCall('GET', '/api/bills/999999');
    assert.equal(status, 404);
  });
});

describe('Bill search', function () {
  it('should search bills', async function () {
    const { status, data } = await apiCall('GET', '/api/bills/search?q=Test');
    assert.equal(status, 200);
    assert.ok(Array.isArray(data));
  });
});
