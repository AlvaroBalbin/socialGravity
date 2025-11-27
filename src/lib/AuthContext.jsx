// src/lib/AuthContext.jsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import { supabase } from "../supabaseClient";

const AuthContext = createContext(null);

// Small helper so we never touch window during SSR / build
function getDefaultRedirectTo() {
  if (typeof window === "undefined") return undefined;
  // Always send magic link back to /login on the current origin
  return `${window.location.origin}/login`;
}

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Make sure a profile row exists for this user
  const ensureProfile = useCallback(async (user) => {
    if (!user) return;

    try {
      const fullName =
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        user.email;

      const avatarUrl =
        user.user_metadata?.avatar_url ||
        user.user_metadata?.picture ||
        null;

      const { error } = await supabase.from("profiles").upsert(
        {
          id: user.id, // FK → auth.users.id
          full_name: fullName,
          avatar_url: avatarUrl,
        },
        { onConflict: "id" }
      );

      if (error) {
        console.error("ensureProfile error:", error);
      }
    } catch (err) {
      console.error("ensureProfile exception:", err);
    }
  }, []);

  useEffect(() => {
    let ignore = false;

    async function init() {
      try {
        setIsLoading(true);

        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error("getSession error:", error);
        }

        if (ignore) return;

        const currentSession = data?.session ?? null;
        const currentUser = currentSession?.user ?? null;

        setSession(currentSession);
        setUser(currentUser);

        if (currentUser) {
          // fire and forget – don’t block loading
          ensureProfile(currentUser);
        }
      } catch (err) {
        console.error("init auth error:", err);
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      const newSession = nextSession ?? null;
      const newUser = newSession?.user ?? null;

      setSession(newSession);
      setUser(newUser);

      if (newUser) {
        ensureProfile(newUser);
      }
    });

    return () => {
      ignore = true;
      subscription.unsubscribe();
    };
  }, [ensureProfile]);

  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error("signOut error:", err);
    }
  }, []);

  /**
   * Magic-link sign in.
   *
   * redirectTo: optional full URL – if omitted we send the user back to
   * `${origin}/login`, which works for both localhost and Vercel.
   */
  const signInWithEmail = useCallback(async (email, redirectTo) => {
    const emailRedirectTo = redirectTo || getDefaultRedirectTo();

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // If emailRedirectTo is undefined, Supabase will fall back to Site URL.
        emailRedirectTo,
      },
    });

    if (error) {
      console.error("signInWithEmail error", error);
      throw error;
    }
  }, []);

  const value = useMemo(
    () => ({
      session,
      user,
      isLoading,
      isAuthenticated: !!user,
      signOut,
      signInWithEmail,
    }),
    [session, user, isLoading, signOut, signInWithEmail]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};
