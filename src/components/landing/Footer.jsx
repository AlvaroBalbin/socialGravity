import React, { useState } from "react";
import FeedbackWidget from "@/components/feedback/FeedbackWidget.jsx";

// Reusable info modal for Privacy / Terms
function InfoModal({ open, onClose, title, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full mx-4 p-6 relative">
        {/* Close (X) */}
        <button
          onClick={onClose}
          className="absolute right-4 top-3 text-xs text-gray-400 hover:text-gray-700"
        >
          ✕
        </button>

        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          {title}
        </h2>

        <div className="text-xs text-gray-600 space-y-3 leading-relaxed max-h-80 overflow-y-auto">
          {children}
        </div>

        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="text-xs px-3 py-2 rounded-full border border-gray-300 hover:border-gray-500 hover:text-gray-900 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();
  const [open, setOpen] = useState(null); // "privacy" | "terms" | null

  return (
    <>
      <footer
        id="footer"
        className="py-12 px-6 border-t border-gray-200 bg-white"
      >
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <span className="text-sm font-medium tracking-tight text-gray-800">
            SocialGravity
          </span>

          {/* Links */}
          <div className="flex items-center gap-8">
            {/* About – can later become /about route or scroll */}
            <button
              type="button"
              className="text-xs text-gray-500 hover:text-black transition-colors"
              onClick={() => {
                const el = document.getElementById("resonance"); // ← your Showcase Orbit section
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
            >
              About
            </button>


            {/* Contact – mailto */}
            <a
              href="mailto:founders@socialgravity.ai"
              className="text-xs text-gray-500 hover:text-black transition-colors"
            >
              Contact
            </a>

            {/* Privacy – opens modal */}
            <button
              type="button"
              className="text-xs text-gray-500 hover:text-black transition-colors"
              onClick={() => setOpen("privacy")}
            >
              Privacy
            </button>

            {/* Terms – opens modal */}
            <button
              type="button"
              className="text-xs text-gray-500 hover:text-black transition-colors"
              onClick={() => setOpen("terms")}
            >
              Terms
            </button>
          </div>

          {/* Email + Copyright + Feedback button */}
          <div className="flex flex-col items-center md:items-end gap-2 leading-tight">
            <a
              href="mailto:founders@socialgravity.ai"
              className="text-xs font-medium text-gray-700 hover:text-black transition-colors"
            >
              founders@socialgravity.ai
            </a>
            <span className="text-[11px] text-gray-400">© {year}</span>

            <div className="mt-2">
              <FeedbackWidget buttonLabel="We’d love your feedback" size="sm" />
            </div>
          </div>
        </div>
      </footer>

      {/* PRIVACY MODAL */}
      <InfoModal
        open={open === "privacy"}
        onClose={() => setOpen(null)}
        title="Privacy Policy"
      >
        <p>
          We use your data to help you understand how your content resonates
          with different personas, and to improve SocialGravity.
        </p>
        <p>
          We don&apos;t sell your personal data. Limited usage data may be used
          to improve our models, analytics, and product experience. You can
          request deletion of your account data at any time by emailing{" "}
          <a
            href="mailto:founders@socialgravity.ai"
            className="underline"
          >
            founders@socialgravity.ai
          </a>
          .
        </p>
        <p>
          For creators uploading content, please make sure you own the rights to
          what you upload or have permission to use it.
        </p>
      </InfoModal>

      {/* TERMS MODAL */}
      <InfoModal
        open={open === "terms"}
        onClose={() => setOpen(null)}
        title="Terms of Service"
      >
        <p>
          SocialGravity is an experimental tool that simulates audience
          personas, retention and reactions to help you improve your content.
        </p>
        <p>
          Insights are probabilistic, not guarantees. You&apos;re responsible
          for how you use them and for complying with local laws and platform
          policies.
        </p>
        <p>
          By using SocialGravity, you agree not to upload illegal content,
          harassment, or anything that violates other people&apos;s rights. We
          may suspend access if we detect abuse.
        </p>
      </InfoModal>
    </>
  );
}
