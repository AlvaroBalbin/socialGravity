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
          // don’t block isLoading on this
          ensureProfile(currentUser);
        }
      } catch (err) {
        console.error("init auth error:", err);
      } finally {
        if (!ignore) {
          // 🔥 guarantees the spinner goes away
          setIsLoading(false);
        }
      }
    }

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const newSession = session ?? null;
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

  // 🔑 now accepts a custom redirectTo URL
  const signInWithEmail = useCallback(async (email, redirectTo) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // when not provided, fallback to origin (old behaviour)
        emailRedirectTo: redirectTo || window.location.origin,
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
