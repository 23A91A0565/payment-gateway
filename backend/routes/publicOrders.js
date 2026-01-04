const express = require("express");
const router = express.Router();
const db = require("../db");

/**
 * GET /api/v1/orders/:id/public
 */
router.get("/:id/public", async (req, res) => {
  const { id } = req.params;

  const { rows } = await db.query(
    "SELECT id, amount, currency FROM orders WHERE id=$1",
    [id]
  );

  if (!rows.length) {
    return res.status(404).json({
      error: {
        code: "NOT_FOUND_ERROR",
        description: "Order not found"
      }
    });
  }

  res.json(rows[0]);
});

module.exports = router;
