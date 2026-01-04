function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function processPayment(method) {
  const testMode = process.env.TEST_MODE === "true";

  let delay = 5000 + Math.random() * 5000;
  let successRate = method === "upi" ? 0.9 : 0.95;

  if (testMode) {
    delay = Number(process.env.TEST_PROCESSING_DELAY || 1000);
    return {
      success: process.env.TEST_PAYMENT_SUCCESS !== "false",
      delay
    };
  }

  await sleep(delay);

  return {
    success: Math.random() < successRate,
    delay
  };
}

module.exports = { processPayment };
