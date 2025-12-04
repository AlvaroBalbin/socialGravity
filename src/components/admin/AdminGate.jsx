// src/components/admin/AdminGate.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import { useAuth } from "@/lib/AuthContext";

export default function AdminGate({ children }) {
  const { user } = useAuth();
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const check = async () => {
      if (!user) {
        setChecking(false);
        setIsAdmin(false);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("role, full_name")
        .eq("id", user.id) // auth uid === profiles.id
        .single();

      if (error) {
        console.error("Admin check failed", error);
        setError("Could not verify admin status.");
        setIsAdmin(false);
      } else {
        setIsAdmin(data?.role === "admin");
      }

      setChecking(false);
    };

    check();
  }, [user]);

  // --- UI states ---------------------------------------------------------

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f6f6f8]">
        <div className="text-xs text-slate-500">Checking admin access…</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f6f6f8]">
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm max-w-sm text-center">
          <h1 className="text-sm font-semibold text-slate-900 mb-1">
            Sign in to continue
          </h1>
          <p className="text-[11px] text-slate-500">
            The admin dashboard is only available for signed-in team members.
          </p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f6f6f8]">
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm max-w-sm text-center">
          <h1 className="text-sm font-semibold text-slate-900 mb-1">
            Access denied
          </h1>
          <p className="text-[11px] text-slate-500">
            This area is reserved for SocialGravity admins.
          </p>
          {error && (
            <p className="mt-2 text-[11px] text-red-500">
              ({error})
            </p>
          )}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
