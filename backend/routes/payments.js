const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const db = require("../db");

/**
 * GET /api/v1/payments/stats
 * MUST COME FIRST
 */
router.get("/stats", auth, async (req, res) => {
  const totalRes = await db.query(
    "SELECT COUNT(*) FROM payments WHERE merchant_id=$1",
    [req.merchant.id]
  );

  const successRes = await db.query(
    "SELECT COUNT(*) FROM payments WHERE merchant_id=$1 AND status='success'",
    [req.merchant.id]
  );

  const amountRes = await db.query(
    "SELECT COALESCE(SUM(amount),0) FROM payments WHERE merchant_id=$1 AND status='success'",
    [req.merchant.id]
  );

  res.json({
    total: Number(totalRes.rows[0].count),
    amount: Number(amountRes.rows[0].coalesce),
    successRate:
      totalRes.rows[0].count == 0
        ? 0
        : Math.round(
            (successRes.rows[0].count / totalRes.rows[0].count) * 100
          )
  });
});

/**
 * GET /api/v1/payments
 */
router.get("/", auth, async (req, res) => {
  const { rows } = await db.query(
    "SELECT * FROM payments WHERE merchant_id=$1 ORDER BY created_at DESC",
    [req.merchant.id]
  );
  res.json(rows);
});

/**
 * GET /api/v1/payments/:id
 * MUST COME LAST
 */
router.get("/:id", auth, async (req, res) => {
  const { rows } = await db.query(
    "SELECT * FROM payments WHERE id=$1 AND merchant_id=$2",
    [req.params.id, req.merchant.id]
  );

  if (!rows.length) {
    return res.status(404).json({
      error: {
        code: "NOT_FOUND_ERROR",
        description: "Payment not found"
      }
    });
  }

  res.json(rows[0]);
});

module.exports = router;
