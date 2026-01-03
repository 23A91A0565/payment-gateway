require("dotenv").config();
const express = require("express");
const { Client } = require("pg");

const app = express();
app.use(express.json());

const db = new Client({ connectionString: process.env.DATABASE_URL });
db.connect();

app.get("/health", async (req, res) => {
  try {
    await db.query("SELECT 1");
    res.status(200).json({
      status: "healthy",
      database: "connected",
      timestamp: new Date().toISOString()
    });
  } catch {
    res.status(200).json({
      status: "healthy",
      database: "disconnected",
      timestamp: new Date().toISOString()
    });
  }
});

app.listen(process.env.PORT, () =>
  console.log("API running on port", process.env.PORT)
);
