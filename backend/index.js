require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./db");

const paymentsRoutes = require("./routes/payments");
const ordersRoutes = require("./routes/orders");
const publicOrdersRoutes = require("./routes/publicOrders");
const publicPaymentsRoutes = require("./routes/publicPayments");

const app = express();

app.use(cors());
app.use(express.json());

/* Health */
app.get("/health", async (req, res) => {
  try {
    await db.query("SELECT 1");
    res.json({ status: "healthy" });
  } catch {
    res.json({ status: "db disconnected" });
  }
});

/* AUTH ROUTES */
app.use("/api/v1/orders", ordersRoutes);
app.use("/api/v1/payments", paymentsRoutes);

/* PUBLIC ROUTES */
app.use("/api/v1/orders", publicOrdersRoutes);
app.use("/api/v1/payments", publicPaymentsRoutes);

const PORT = 8000;
app.listen(PORT, () => {
  console.log("API running on port", PORT);
});
