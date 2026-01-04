const { Client } = require("pg");

const db = new Client({
  connectionString: process.env.DATABASE_URL,
});

db.connect()
  .then(() => console.log("Database connected"))
  .catch((err) => {
    console.error("Database connection failed", err);
    process.exit(1);
  });

module.exports = db;
