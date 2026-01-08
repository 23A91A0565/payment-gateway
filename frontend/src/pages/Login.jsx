import React from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();

  return (
    <form data-test-id="login-form" style={styles.form}>
      <h2>Merchant Login</h2>

      <input
        data-test-id="email-input"
        type="email"
        placeholder="Email"
        style={styles.input}
      />

      <input
        data-test-id="password-input"
        type="password"
        placeholder="Password"
        style={styles.input}
      />

      <button
        data-test-id="login-button"
        onClick={(e) => {
          e.preventDefault();
          navigate('/dashboard');
        }}
      >
        Login
      </button>
    </form>
  );
}
