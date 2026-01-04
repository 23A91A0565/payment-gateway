import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:8000/api/v1";

function Checkout() {
  const params = new URLSearchParams(window.location.search);
  const orderId = params.get("order_id")?.trim();

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

  useEffect(() => {
    if (!orderId) return;

    axios
      .get(`${API}/orders/${orderId}/public`)
      .then(res => setOrder(res.data))
      .catch(() => setState("error"));
  }, [orderId]);

  const createPayment = async body => {
    try {
      setState("processing");

      const res = await axios.post(
        `${API}/payments/public`,
        body
      );

      setPaymentId(res.data.id);
      setState(res.data.status === "success" ? "success" : "failed");
    } catch (err) {
      console.error(err);
      setState("failed");
    }
  };

  if (!orderId) return <div>Missing order_id</div>;
  if (!order) return <div>Loading...</div>;

  return (
    <div data-test-id="checkout-container">
      <h2>Complete Payment</h2>

      <p>Amount: ₹{(order.amount / 100).toFixed(2)}</p>
      <p>Order ID: {order.id}</p>

      <button onClick={() => setMethod("upi")}>UPI</button>
      <button onClick={() => setMethod("card")}>Card</button>

      {method === "upi" && (
        <form
          onSubmit={e => {
            e.preventDefault();
            createPayment({ order_id: order.id, method: "upi", vpa });
          }}
        >
          <input
            placeholder="user@paytm"
            value={vpa}
            onChange={e => setVpa(e.target.value)}
          />
          <button disabled={state === "processing"}>
            Pay ₹{order.amount / 100}
          </button>
        </form>
      )}

      {method === "card" && (
        <form
          onSubmit={e => {
            e.preventDefault();
            const [m, y] = card.expiry.split("/");
            createPayment({
              order_id: order.id,
              method: "card",
              card: {
                number: card.number,
                expiry_month: m,
                expiry_year: y,
                cvv: card.cvv,
                holder_name: card.name
              }
            });
          }}
        >
          <input placeholder="4111111111111111"
            onChange={e => setCard({ ...card, number: e.target.value })} />
          <input placeholder="12/30"
            onChange={e => setCard({ ...card, expiry: e.target.value })} />
          <input placeholder="123"
            onChange={e => setCard({ ...card, cvv: e.target.value })} />
          <input placeholder="John Doe"
            onChange={e => setCard({ ...card, name: e.target.value })} />
          <button disabled={state === "processing"}>
            Pay ₹{order.amount / 100}
          </button>
        </form>
      )}

      {state === "processing" && <p>Processing payment...</p>}
      {state === "success" && <h3>Payment Successful! ({paymentId})</h3>}
      {state === "failed" && (
        <>
          <h3>Payment Failed</h3>
          <button onClick={() => setState("idle")}>Try Again</button>
        </>
      )}
    </div>
  );
}

export default Checkout;
