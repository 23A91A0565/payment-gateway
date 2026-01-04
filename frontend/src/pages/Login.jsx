import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = (e) => {
    e.preventDefault();

    // Simple login for Deliverable 1
    if (email === "test@example.com") {
      localStorage.setItem("loggedIn", "true");
      navigate("/dashboard");
    }
  };

  return (
    <form data-test-id="login-form" onSubmit={login}>
      <input
        data-test-id="email-input"
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <input
        data-test-id="password-input"
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button data-test-id="login-button">Login</button>
    </form>
  );
}

export default Login;
