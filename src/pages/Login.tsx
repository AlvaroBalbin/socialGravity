// src/pages/Login.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../lib/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Login() {
  const { signInWithEmail, isAuthenticated, user } = useAuth();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Read query params: ?redirect=...&claim_simulation=...
  const params = new URLSearchParams(location.search);
  const redirectParam = params.get("redirect"); // encoded string or null
  const claimSimulationId = params.get("claim_simulation"); // simulation UUID or null

  // After auth: claim the simulation (if any) and redirect
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const claimAndRedirect = async () => {
      try {
        if (claimSimulationId) {
          const { error } = await supabase
            .from("simulations")
            .update({ user_id: user.id })
            .eq("id", claimSimulationId)
            .is("user_id", null); // only claim if not owned yet

          if (error) {
            console.error("Failed to claim simulation:", error);
          } else {
            console.log(
              "✅ Claimed simulation",
              claimSimulationId,
              "for user",
              user.id
            );
          }
        }
      } catch (err) {
        console.error("Error while claiming simulation:", err);
      }

      const target = redirectParam
        ? decodeURIComponent(redirectParam)
        : "/profile";

      navigate(target, { replace: true });
    };

    claimAndRedirect();
  }, [isAuthenticated, user, claimSimulationId, redirectParam, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      // Build the redirect URL *inside* the handler so it's safe on Vercel
      let redirectUrl;

      if (typeof window !== "undefined") {
        // keep current path + query (?redirect=...&claim_simulation=...)
        redirectUrl =
          window.location.origin +
          location.pathname +
          location.search;
      }

      // Send magic link that returns to THIS /login URL (with params)
      await signInWithEmail(email, redirectUrl);
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
          <p style={{ marginTop: 12, fontSize: 13 }}>{status}</p>
        )}
      </form>
    </div>
  );
}
