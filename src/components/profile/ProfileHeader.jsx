// src/components/profile/ProfileHeader.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useAuth } from "@/lib/AuthContext";

export default function ProfileHeader({ logoSrc }) {
  const { user, isAuthenticated, signOut } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await signOut();           // clears Supabase session
    window.location.href = "/"; // send them back to landing
  };

  return (
    <header
      className="sticky top-0 z-50 bg-white border-b border-gray-100 transition-all duration-300 ease-out"
      style={{ animation: "fadeIn 0.4s ease-out" }}
    >
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link
          to={createPageUrl("Landing")}
          className="flex items-center gap-2 cursor-pointer"
        >
          {logoSrc ? (
            <img
              src={logoSrc}
              alt="Social Gravity"
              className="object-contain transition-all duration-300"
              style={{
                height: scrolled ? 32 : 40, // ⬅️ same as StickyHeader
                width: "auto",
              }}
            />
          ) : (
            <span className="text-lg font-medium text-gray-900 tracking-tight hover:text-gray-600 transition-colors">
              Social Gravity
            </span>
          )}
        </Link>

        <div className="flex items-center gap-4">
          {isAuthenticated && (
            <span className="text-xs text-gray-400">{user?.email}</span>
          )}

          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-xs font-medium text-gray-600 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors"
            >
              Log Out
            </button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </header>
  );
}
