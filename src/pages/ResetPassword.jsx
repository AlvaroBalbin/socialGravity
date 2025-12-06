// src/pages/ResetPassword.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const redirectParam = params.get("redirect");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      // Supabase has already authenticated the user from the link.
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      setStatus("Password updated. You’re now signed in 🎉");

      const target = redirectParam
        ? decodeURIComponent(redirectParam)
        : "/profile";

      navigate(target, { replace: true });
    } catch (err) {
      console.error(err);
      setStatus(err.message || "Failed to update password.");
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
        background: "#f3f4f6",
        padding: 16,
      }}
    >
      <div
        style={{
          width: 380,
          maxWidth: "100%",
          padding: 24,
          borderRadius: 20,
          border: "1px solid #e5e7eb",
          boxShadow: "0 18px 40px rgba(15,23,42,0.07)",
          background: "#ffffff",
        }}
      >
        <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 8 }}>
          Set a new password
        </h1>
        <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 20 }}>
          You’ve opened a secure link to reset your password. Choose a new one
          below.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 14 }}>
            <label
              style={{
                display: "block",
                fontSize: 12,
                fontWeight: 500,
                marginBottom: 4,
              }}
            >
              New password
            </label>
            <input
              type="password"
              required
              minLength={6}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 10px",
                borderRadius: 8,
                border: "1px solid #d1d5db",
                fontSize: 14,
              }}
            />
          </div>

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
              fontSize: 14,
            }}
          >
            {loading ? "Updating password…" : "Save new password"}
          </button>
        </form>

        {status && (
          <p style={{ marginTop: 10, fontSize: 12, color: "#4b5563" }}>
            {status}
          </p>
        )}
      </div>
    </div>
  );
}
