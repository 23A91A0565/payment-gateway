const express = require("express");
const router = express.Router();
const db = require("../db");

/**
 * GET /api/v1/orders/:order_id/public
 * Public order lookup for checkout page
 */
router.get("/api/v1/orders/:order_id/public", async (req, res) => {
  const { order_id } = req.params;

  const { rows } = await db.query(
    "SELECT id, amount, currency, status FROM orders WHERE id=$1",
    [order_id]
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
