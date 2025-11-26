// src/pages/Login.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../lib/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

export default function Login() {
  const { signInWithEmail, isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Where should Supabase send the user back to after clicking the magic link?
  // If we came from "Save Simulation" this will be the full simulationresults URL.
  const redirectTo =
    location.state?.redirectTo || window.location.origin;

  // If already logged in, send them to profile
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/profile");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      // pass redirectTo so the magic link returns to the right place
      await signInWithEmail(email, redirectTo);
      setStatus("Check your email for a login link.");
    } catch (err) {
      console.error(err);
      setStatus(err.message || "Failed to send magic link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: 320,
          padding: 24,
          borderRadius: 16,
          border: "1px solid #e2e2e2",
          boxShadow: "0 8px 20px rgba(0,0,0,0.04)",
          background: "#fff",
        }}
      >
        <h1 style={{ fontSize: 20, marginBottom: 16 }}>Sign in</h1>
        <p style={{ fontSize: 14, marginBottom: 16 }}>
          Enter your email and we’ll send you a magic login link.
        </p>
        <input
          type="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: "8px 10px",
            marginBottom: 12,
            borderRadius: 8,
            border: "1px solid #d0d0d0",
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "8px 10px",
            borderRadius: 999,
            border: "none",
            background: "#111827",
            color: "white",
            cursor: loading ? "default" : "pointer",
            opacity: loading ? 0.8 : 1,
          }}
        >
          {loading ? "Sending…" : "Send magic link"}
        </button>
        {status && (
          <p style={{ marginTop: 12, fontSize: 13 }}>
            {status}
          </p>
        )}
      </form>
    </div>
  );
}
