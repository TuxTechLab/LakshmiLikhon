const db = require('../db/pool');

async function findAll({ search, limit = 50, offset = 0 } = {}) {
  let query = `
    SELECT id, bill_number, customer_name, customer_phone, customer_address,
           bill_date, subtotal, discount, total, created_at, updated_at
    FROM bills
  `;
  const params = [];

  if (search) {
    query += ` WHERE bill_number ILIKE $1 OR customer_name ILIKE $1 OR customer_phone ILIKE $1`;
    params.push(`%${search}%`);
  }

  query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
  params.push(limit, offset);

  const result = await db.query(query, params);
  return result.rows;
}

async function findById(id) {
  const billResult = await db.query(
    `SELECT id, bill_number, customer_name, customer_phone, customer_address,
            bill_date, subtotal, discount, total, created_at, updated_at
     FROM bills WHERE id = $1`,
    [id]
  );

  if (billResult.rows.length === 0) return null;

  const itemsResult = await db.query(
    `SELECT id, bill_id, product_name, description, quantity, unit_price, total
     FROM bill_items WHERE bill_id = $1 ORDER BY id`,
    [id]
  );

  return {
    ...billResult.rows[0],
    items: itemsResult.rows,
  };
}

async function create({ customer_name, customer_phone, customer_address, bill_date, items, subtotal, discount, total }) {
  const client = await db.getClient();

  try {
    await client.query('BEGIN');

    const billResult = await client.query(
      `INSERT INTO bills (customer_name, customer_phone, customer_address, bill_date, subtotal, discount, total)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, bill_number, customer_name, customer_phone, customer_address,
                 bill_date, subtotal, discount, total, created_at, updated_at`,
      [customer_name, customer_phone || null, customer_address || null, bill_date, subtotal, discount || 0, total]
    );

    const bill = billResult.rows[0];

    for (const item of items) {
      await client.query(
        `INSERT INTO bill_items (bill_id, product_name, description, quantity, unit_price, total)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [bill.id, item.product_name, item.description || null, item.quantity, item.unit_price, item.total]
      );
    }

    await client.query('COMMIT');

    return await findById(bill.id);
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

async function count() {
  const result = await db.query('SELECT COUNT(*)::int as count FROM bills');
  return result.rows[0].count;
}

module.exports = { findAll, findById, create, count };
