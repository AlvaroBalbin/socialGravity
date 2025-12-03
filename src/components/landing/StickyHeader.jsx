// src/components/landing/StickyHeader.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useAuth } from "@/lib/AuthContext";

export default function StickyHeader({ logoSrc }) {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAccountClick = () => {
    if (isAuthenticated) {
      navigate(createPageUrl("Profile"));
    } else {
      navigate("/login");
    }
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out"
      style={{
        padding: scrolled ? "10px 24px" : "14px 24px", // ⬅️ slimmer navbar
        backgroundColor: scrolled
          ? "rgba(255, 255, 255, 0.92)"
          : "rgba(255, 255, 255, 0)",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        boxShadow: scrolled
          ? "0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.03)"
          : "none",
      }}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link
          to={createPageUrl("Landing")}
          className="flex items-center gap-2 cursor-pointer"
        >
          {logoSrc ? (
            <img
              src={logoSrc}
              alt="Social Gravity"
              className="transition-all duration-300 object-contain"
              style={{
                height: scrolled ? 40 : 48, // ⬅️ smaller but still readable
                width: "auto",
              }}
            />
          ) : (
            <span
              className="text-lg font-medium text-gray-900 tracking-tight transition-all duration-300"
              style={{ fontSize: scrolled ? "16px" : "18px" }}
            >
              Social Gravity
            </span>
          )}
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <a
            href="#resonance"
            onClick={(e) => {
              e.preventDefault();
              document
                .getElementById("resonance")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors font-light cursor-pointer"
          >
            About
          </a>
          <a
            href="#what-it-does"
            onClick={(e) => {
              e.preventDefault();
              document
                .getElementById("what-it-does")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors font-light cursor-pointer"
          >
            How It Works
          </a>
          <a
            href="#intelligence"
            onClick={(e) => {
              e.preventDefault();
              document
                .getElementById("intelligence")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors font-light cursor-pointer"
          >
            Intelligence
          </a>
          <a
            href="#use-cases"
            onClick={(e) => {
              e.preventDefault();
              document
                .getElementById("use-cases")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors font-light cursor-pointer"
          >
            Use Cases
          </a>
          <a
            href="#faq"
            onClick={(e) => {
              e.preventDefault();
              document
                .getElementById("faq")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors font-light cursor-pointer"
          >
            FAQ
          </a>
        </nav>

        {/* CTA: My Account */}
        <button
          onClick={handleAccountClick}
          className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-all duration-300"
          style={{
            padding: scrolled ? "8px 16px" : "10px 20px",
            fontSize: scrolled ? "13px" : "14px",
          }}
        >
          My Account
        </button>
      </div>
    </header>
  );
}
