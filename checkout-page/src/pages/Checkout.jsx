import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:8000/api/v1";

function Checkout() {
  const params = new URLSearchParams(window.location.search);
  const orderId = params.get("order_id");

  // ✅ ALL HOOKS FIRST — NO RETURNS ABOVE THIS
  const [order, setOrder] = useState(null);
  const [method, setMethod] = useState(null);
  const [vpa, setVpa] = useState("");
  const [card, setCard] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: ""
  });
  const [paymentId, setPaymentId] = useState(null);
  const [state, setState] = useState("idle");

  // ✅ Order fetch effect (guard inside)
  useEffect(() => {
    if (!orderId) return;

    axios
      .get(`${API}/orders/${orderId}/public`)
      .then(res => setOrder(res.data))
      .catch(() => setState("error"));
  }, [orderId]);

  // ✅ Payment status polling (guard inside)
  useEffect(() => {
    if (!paymentId) return;

    const interval = setInterval(async () => {
      const res = await axios.get(`${API}/payments/${paymentId}`);
      if (res.data.status === "success") {
        setState("success");
        clearInterval(interval);
      }
      if (res.data.status === "failed") {
        setState("failed");
        clearInterval(interval);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [paymentId]);

  const createPayment = async (body) => {
    setState("processing");
    const res = await axios.post(`${API}/payments/public`, body);
    setPaymentId(res.data.id);
  };

  // ✅ CONDITIONAL RENDERING — AFTER ALL HOOKS
  if (!orderId) {
    return <div>Missing order_id in URL</div>;
  }

  if (!order) {
    return <div>Loading...</div>;
  }

  return (
    <div data-test-id="checkout-container">
      <div data-test-id="order-summary">
        <h2>Complete Payment</h2>
        <div>
          <span>Amount: </span>
          <span data-test-id="order-amount">
            ₹{(order.amount / 100).toFixed(2)}
          </span>
        </div>
        <div>
          <span>Order ID: </span>
          <span data-test-id="order-id">{order.id}</span>
        </div>
      </div>

      <div data-test-id="payment-methods">
        <button data-test-id="method-upi" onClick={() => setMethod("upi")}>
          UPI
        </button>
        <button data-test-id="method-card" onClick={() => setMethod("card")}>
          Card
        </button>
      </div>

      {method === "upi" && (
        <form
          data-test-id="upi-form"
          onSubmit={e => {
            e.preventDefault();
            createPayment({
              order_id: order.id,
              method: "upi",
              vpa
            });
          }}
        >
          <input
            data-test-id="vpa-input"
            placeholder="username@bank"
            value={vpa}
            onChange={e => setVpa(e.target.value)}
          />
          <button data-test-id="pay-button">
            Pay ₹{order.amount / 100}
          </button>
        </form>
      )}

      {method === "card" && (
        <form
          data-test-id="card-form"
          onSubmit={e => {
            e.preventDefault();
            const [month, year] = card.expiry.split("/");
            createPayment({
              order_id: order.id,
              method: "card",
              card: {
                number: card.number,
                expiry_month: month,
                expiry_year: year,
                cvv: card.cvv,
                holder_name: card.name
              }
            });
          }}
        >
          <input data-test-id="card-number-input" placeholder="Card Number"
            onChange={e => setCard({ ...card, number: e.target.value })} />
          <input data-test-id="expiry-input" placeholder="MM/YY"
            onChange={e => setCard({ ...card, expiry: e.target.value })} />
          <input data-test-id="cvv-input" placeholder="CVV"
            onChange={e => setCard({ ...card, cvv: e.target.value })} />
          <input data-test-id="cardholder-name-input" placeholder="Name on Card"
            onChange={e => setCard({ ...card, name: e.target.value })} />
          <button data-test-id="pay-button">
            Pay ₹{order.amount / 100}
          </button>
        </form>
      )}

      {state === "processing" && (
        <div data-test-id="processing-state">
          <span data-test-id="processing-message">
            Processing payment...
          </span>
        </div>
      )}

      {state === "success" && (
        <div data-test-id="success-state">
          <h2>Payment Successful!</h2>
          <span data-test-id="payment-id">{paymentId}</span>
          <span data-test-id="success-message">
            Your payment has been processed successfully
          </span>
        </div>
      )}

      {state === "failed" && (
        <div data-test-id="error-state">
          <h2>Payment Failed</h2>
          <span data-test-id="error-message">
            Payment could not be processed
          </span>
          <button
            data-test-id="retry-button"
            onClick={() => setState("idle")}
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}

export default Checkout;
