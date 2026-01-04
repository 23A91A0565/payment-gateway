require("dotenv").config();
const express = require("express");
const cors = require("cors");
const paymentsRoutes = require("./routes/payments");
const publicOrders = require("./routes/publicOrders");
const publicPayments = require("./routes/publicPayments");
const getPayment = require("./routes/getPayment");
const db = require("./db"); // ✅ shared DB connection

const app = express();
app.use(cors());
app.use(express.json());
app.use(paymentsRoutes);
app.use(publicOrders);
app.use(publicPayments);
app.use(getPayment);

// Health check
app.get("/health", async (req, res) => {
  try {
    await db.query("SELECT 1");
    res.status(200).json({
      status: "healthy",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(200).json({
      status: "healthy",
      database: "disconnected",
      timestamp: new Date().toISOString(),
    });
  }
});

// Routes
const ordersRoutes = require("./routes/orders");
app.use(ordersRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});
