// src/pages/Login.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../lib/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Login() {
  const { isAuthenticated, user } = useAuth();

  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [forgotMode, setForgotMode] = useState(false); // forgot-password UI

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // ----- Query params: ?redirect=...&claim_simulation=... -------------------
  const params = new URLSearchParams(location.search);
  const redirectParam = params.get("redirect"); // encoded string or null
  const claimSimulationId = params.get("claim_simulation"); // simulation UUID or null

  // Helper so we always redirect back to THIS /login URL (with params)
  const getRedirectUrl = () => {
    if (typeof window === "undefined") return undefined;
    return window.location.origin + location.pathname + location.search;
  };

  // ----- After auth: claim simulation (if any) and redirect -----------------
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

  // ----- OAuth handlers (Google / Outlook) ---------------------------------
  const handleOAuthLogin = async (provider) => {
    setLoading(true);
    setStatus(null);

    try {
      const redirectTo = getRedirectUrl();
      const { error } = await supabase.auth.signInWithOAuth({
        provider, // "google" or "azure"
        options: { redirectTo },
      });

      if (error) throw error;
    } catch (err) {
      console.error(err);
      setStatus(err.message || "Failed to sign in with provider.");
      setLoading(false);
    }
  };

  // ----- Email + password login / signup -----------------------------------
  const handleEmailPasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      if (mode === "signup") {
        // With email confirmations OFF, this returns a session immediately
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;

        if (data?.session) {
          setStatus("Account created. You’re now signed in 🎉");
          // AuthContext + useEffect will redirect.
        } else {
          setStatus("Account created. You can now log in.");
        }
      } else {
        // Login
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        // redirect handled by useEffect
      }
    } catch (err) {
      console.error(err);
      setStatus(err.message || "Failed to sign in.");
    } finally {
      setLoading(false);
    }
  };

  // ----- Forgot password: send reset link ----------------------------------
// ----- Forgot password: send reset link ----------------------------------
const handleResetPassword = async (e) => {
  e.preventDefault();
  setLoading(true);
  setStatus(null);

  try {
    if (typeof window === "undefined") return;

    const origin = window.location.origin;

    // User will FIRST come here after clicking the email
    // We also pass ?redirect=/profile so YOUR page can send them on afterwards
    const redirectTo = `${origin}/reset-password?redirect=${encodeURIComponent(
      "/profile"
    )}`;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });
    if (error) throw error;

    setStatus(
      "If that email exists, we’ve sent a reset link. Check your inbox and spam."
    );
  } catch (err) {
    console.error(err);
    setStatus(err.message || "Failed to send reset link.");
  } finally {
    setLoading(false);
  }
};


  // -------------------------------------------------------------------------
  // UI
  // -------------------------------------------------------------------------
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
          Sign in to Social Gravity
        </h1>
        <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 20 }}>
          Use your Google / Outlook account or email &amp; password.
        </p>

        {/* OAuth buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <button
            type="button"
            onClick={() => handleOAuthLogin("google")}
            disabled={loading}
            style={{
              width: "100%",
              padding: "8px 10px",
              borderRadius: 999,
              border: "1px solid #d1d5db",
              background: "#ffffff",
              cursor: loading ? "default" : "pointer",
              fontSize: 14,
            }}
          >
            Continue with Google
          </button>

          <button
            type="button"
            onClick={() => handleOAuthLogin("azure")} // Outlook / Microsoft
            disabled={loading}
            style={{
              width: "100%",
              padding: "8px 10px",
              borderRadius: 999,
              border: "1px solid #d1d5db",
              background: "#ffffff",
              cursor: loading ? "default" : "pointer",
              fontSize: 14,
            }}
          >
            Continue with Outlook / Microsoft
          </button>
        </div>

        {/* Divider */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            margin: "16px 0",
            gap: 8,
          }}
        >
          <div style={{ flex: 1, height: 1, background: "#e5e7eb" }} />
          <span style={{ fontSize: 11, color: "#9ca3af" }}>OR</span>
          <div style={{ flex: 1, height: 1, background: "#e5e7eb" }} />
        </div>

        {/* Mode toggle */}
        <div
          style={{
            display: "flex",
            gap: 6,
            marginBottom: 12,
            fontSize: 13,
            background: "#f9fafb",
            padding: 4,
            borderRadius: 999,
          }}
        >
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setForgotMode(false);
              setStatus(null);
            }}
            style={{
              flex: 1,
              padding: "6px 0",
              borderRadius: 999,
              border: "none",
              background:
                mode === "login" && !forgotMode ? "#111827" : "transparent",
              color:
                mode === "login" && !forgotMode ? "#ffffff" : "#4b5563",
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            Log in
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("signup");
              setForgotMode(false);
              setStatus(null);
            }}
            style={{
              flex: 1,
              padding: "6px 0",
              borderRadius: 999,
              border: "none",
              background: mode === "signup" ? "#111827" : "transparent",
              color: mode === "signup" ? "#ffffff" : "#4b5563",
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            Sign up
          </button>
        </div>

        {/* "Forgot password?" link (login mode only) */}
        {mode === "login" && !forgotMode && (
          <div
            style={{
              textAlign: "right",
              marginBottom: 8,
              fontSize: 12,
            }}
          >
            <button
              type="button"
              onClick={() => {
                setForgotMode(true);
                setStatus(null);
              }}
              style={{
                border: "none",
                background: "transparent",
                color: "#2563eb",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Forgot password?
            </button>
          </div>
        )}

        {/* Forms: either reset-password or normal login/signup */}
        {forgotMode ? (
          <form onSubmit={handleResetPassword}>
            <div style={{ marginBottom: 10 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 12,
                  fontWeight: 500,
                  marginBottom: 4,
                }}
              >
                Email
              </label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              {loading ? "Sending reset link…" : "Send reset link"}
            </button>

            <button
              type="button"
              onClick={() => {
                setForgotMode(false);
                setStatus(null);
              }}
              style={{
                marginTop: 8,
                width: "100%",
                padding: "6px 10px",
                borderRadius: 999,
                border: "none",
                background: "transparent",
                color: "#4b5563",
                fontSize: 12,
                cursor: "pointer",
              }}
            >
              ← Back to login
            </button>
          </form>
        ) : (
          <form onSubmit={handleEmailPasswordSubmit}>
            <div style={{ marginBottom: 10 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 12,
                  fontWeight: 500,
                  marginBottom: 4,
                }}
              >
                Email
              </label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  borderRadius: 8,
                  border: "1px solid #d1d5db",
                  fontSize: 14,
                }}
              />
            </div>

            <div style={{ marginBottom: 14 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 12,
                  fontWeight: 500,
                  marginBottom: 4,
                }}
              >
                Password
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
                marginBottom: 4,
              }}
            >
              {loading
                ? mode === "signup"
                  ? "Creating account…"
                  : "Signing in…"
                : mode === "signup"
                ? "Create account"
                : "Log in"}
            </button>
          </form>
        )}

        {status && (
          <p style={{ marginTop: 10, fontSize: 12, color: "#4b5563" }}>
            {status}
          </p>
        )}
      </div>
    </div>
  );
}
