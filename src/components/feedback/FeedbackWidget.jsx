// src/components/feedback/FeedbackWidget.jsx
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { supabase } from "@/supabaseClient";
import { useAuth } from "@/lib/AuthContext";

export default function FeedbackWidget({
  buttonLabel = "Give Feedback",
  size = "md",
}) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [contactEmail, setContactEmail] = useState(""); // email they type
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const { user } = useAuth(); // current logged-in user (or null)

  // When modal opens, prefill contact email with account email if empty
  useEffect(() => {
    if (open && user?.email && !contactEmail) {
      setContactEmail(user.email);
    }
  }, [open, user, contactEmail]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitted(false);

    if (!message.trim()) {
      setError("Please add a bit of feedback before sending.");
      return;
    }

    setSubmitting(true);

    try {
      const { error: insertError } = await supabase.from("feedback").insert({
        message,
        // We intentionally do NOT use the legacy `email` column anymore.
        contact_email: contactEmail || null,
        account_email: user?.email || null,
        phone: phone || null,
        user_id: user?.id || null,
      });

      if (insertError) throw insertError;

      setSubmitted(true);
      setMessage("");
      setContactEmail("");
      setPhone("");
    } catch (err) {
      console.error("Feedback insert failed:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const close = () => {
    setOpen(false);
    setSubmitted(false);
    setError("");
    // optional: don’t clear text when closing so they can reopen and continue
    // setMessage("");
    // setContactEmail("");
    // setPhone("");
  };

  const baseButtonClasses =
    "inline-flex items-center justify-center rounded-full font-medium shadow-md transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black";
  const sizeClasses =
    size === "sm"
      ? "px-3 py-1.5 text-xs"
      : size === "lg"
      ? "px-5 py-3 text-sm"
      : "px-4 py-2 text-sm";

  const modal = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={close}
      />

      {/* Card */}
      <div className="relative z-[10000] w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-gray-200">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 mb-3">
              {user ? "Signed in" : "Anonymous"}
            </div>
            <h2 className="text-lg font-semibold text-gray-900">
              We’d love your feedback!
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              We are always looking to improve your simulations. Let us know
              what we can do better.
            </p>
          </div>
          <button
            type="button"
            onClick={close}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Your feedback
            </label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                if (error) setError("");
              }}
              className={`w-full rounded-xl border px-3 py-2 text-sm shadow-sm resize-none focus:outline-none focus:ring-1 ${
                error
                  ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:border-black focus:ring-black"
              }`}
              placeholder="Tell us what worked well and what could be improved..."
            />
          </div>

          <div className="space-y-2">
            <p className="text-xs text-gray-500">
              Feedback is anonymous by default. If you’d like us to follow up,
              leave your email or phone below (optional).
            </p>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Email (optional)
                </label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Phone (optional)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                  placeholder="+44 ..."
                />
              </div>
            </div>
          </div>

          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}

          {submitted && !error && (
            <p className="text-xs text-emerald-600 mt-1">
              Thank you! Your feedback has been submitted.
            </p>
          )}

          <div className="mt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={close}
              className="rounded-full border border-gray-300 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={`${baseButtonClasses} px-4 py-2 text-xs bg-black text-white hover:bg-black/90 disabled:opacity-60`}
            >
              {submitting ? "Sending..." : "Send Feedback"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`${baseButtonClasses} ${sizeClasses} bg-black text-white hover:bg-black/90`}
      >
        {buttonLabel}
      </button>

      {open && typeof document !== "undefined"
        ? createPortal(modal, document.body)
        : null}
    </>
  );
}
