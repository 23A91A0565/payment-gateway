const express = require("express");
const router = express.Router();
const { Client } = require("pg");
const auth = require("../middleware/auth");
const { generateId } = require("../utils/idGenerator");

const db = new Client({
  connectionString: process.env.DATABASE_URL
});
db.connect();

/**
 * POST /api/v1/orders
 */
router.post("/api/v1/orders", auth, async (req, res) => {
  const { amount, currency = "INR", receipt, notes } = req.body;

  // Validation
  if (!amount || !Number.isInteger(amount) || amount < 100) {
    return res.status(400).json({
      error: {
        code: "BAD_REQUEST_ERROR",
        description: "amount must be at least 100"
      }
    });
  }

  const orderId = generateId("order_");

  await db.query(
    `
    INSERT INTO orders
    (id, merchant_id, amount, currency, receipt, notes)
    VALUES ($1, $2, $3, $4, $5, $6)
    `,
    [
      orderId,
      req.merchant.id,
      amount,
      currency,
      receipt || null,
      notes || null
    ]
  );

  return res.status(201).json({
    id: orderId,
    merchant_id: req.merchant.id,
    amount,
    currency,
    receipt: receipt || null,
    notes: notes || {},
    status: "created",
    created_at: new Date().toISOString()
  });
});

/**
 * GET /api/v1/orders/:order_id
 */
router.get("/api/v1/orders/:order_id", auth, async (req, res) => {
  const { order_id } = req.params;

  const { rows } = await db.query(
    "SELECT * FROM orders WHERE id=$1 AND merchant_id=$2",
    [order_id, req.merchant.id]
  );

  if (!rows.length) {
    return res.status(404).json({
      error: {
        code: "NOT_FOUND_ERROR",
        description: "Order not found"
      }
    });
  }

  return res.status(200).json(rows[0]);
});

module.exports = router;
