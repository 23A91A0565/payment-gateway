const { Client } = require("pg");

const client = new Client({
  connectionString: process.env.DATABASE_URL
});

async function seed() {
  await client.connect();

  await client.query(`
    INSERT INTO merchants (
      id, name, email, api_key, api_secret
    ) VALUES (
      '550e8400-e29b-41d4-a716-446655440000',
      'Test Merchant',
      'test@example.com',
      'key_test_abc123',
      'secret_test_xyz789'
    )
    ON CONFLICT (email) DO NOTHING;
  `);

  console.log("Test merchant ready");
  await client.end();
}

seed();
