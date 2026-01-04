const express = require("express");
const router = express.Router();
const db = require("../db");

const { isValidVPA } = require("../utils/vpaValidator");
const { luhnCheck, detectNetwork, isValidExpiry } = require("../utils/cardValidator");
const { processPayment } = require("../utils/paymentProcessor");
const { generateId } = require("../utils/idGenerator");

/**
 * POST /api/v1/payments/public
 */
router.post("/api/v1/payments/public", async (req, res) => {
  const { order_id, method, vpa, card } = req.body;

  const orderRes = await db.query(
    "SELECT * FROM orders WHERE id=$1",
    [order_id]
  );

  if (!orderRes.rows.length) {
    return res.status(404).json({
      error: {
        code: "NOT_FOUND_ERROR",
        description: "Order not found"
      }
    });
  }

  const order = orderRes.rows[0];
  const paymentId = generateId("pay_");

  let cardNetwork = null;
  let cardLast4 = null;

  if (method === "upi") {
    if (!vpa || !isValidVPA(vpa)) {
      return res.status(400).json({
        error: {
          code: "INVALID_VPA",
          description: "Invalid VPA format"
        }
      });
    }
  }

  if (method === "card") {
    if (
      !card ||
      !luhnCheck(card.number) ||
      !isValidExpiry(card.expiry_month, card.expiry_year)
    ) {
      return res.status(400).json({
        error: {
          code: "INVALID_CARD",
          description: "Card validation failed"
        }
      });
    }

    cardNetwork = detectNetwork(card.number);
    cardLast4 = card.number.slice(-4);
  }

  await db.query(
    `
    INSERT INTO payments
    (id, order_id, merchant_id, amount, currency, method, status, vpa, card_network, card_last4)
    VALUES ($1,$2,$3,$4,$5,$6,'processing',$7,$8,$9)
    `,
    [
      paymentId,
      order.id,
      order.merchant_id,
      order.amount,
      order.currency,
      method,
      vpa || null,
      cardNetwork,
      cardLast4
    ]
  );

  const result = await processPayment(method);

  if (result.success) {
    await db.query(
      "UPDATE payments SET status='success', updated_at=NOW() WHERE id=$1",
      [paymentId]
    );
  } else {
    await db.query(
      `
      UPDATE payments
      SET status='failed',
          error_code='PAYMENT_FAILED',
          error_description='Payment could not be processed',
          updated_at=NOW()
      WHERE id=$1
      `,
      [paymentId]
    );
  }

  res.status(201).json({
    id: paymentId,
    order_id: order.id,
    amount: order.amount,
    currency: order.currency,
    method,
    status: result.success ? "success" : "failed",
    vpa: vpa || undefined,
    card_network: cardNetwork || undefined,
    card_last4: cardLast4 || undefined,
    created_at: new Date().toISOString()
  });
});

module.exports = router;
