const express = require("express");
const router = express.Router();
const db = require("../db");

/**
 * GET /api/v1/payments/:payment_id
 */
router.get("/api/v1/payments/:payment_id", async (req, res) => {
  const { payment_id } = req.params;

  const { rows } = await db.query(
    "SELECT * FROM payments WHERE id=$1",
    [payment_id]
  );

  if (!rows.length) {
    return res.status(404).json({
      error: {
        code: "NOT_FOUND_ERROR",
        description: "Payment not found"
      }
    });
  }

  res.status(200).json(rows[0]);
});

module.exports = router;
