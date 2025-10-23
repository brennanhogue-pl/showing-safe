"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { UserProfile, UserRole } from "@/types";

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
  signUp: (
    email: string,
    password: string,
    fullName: string,
    role: UserRole
  ) => Promise<{ error: Error | null }>;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user profile from database (non-blocking)
  const fetchUserProfile = useCallback(async (userId: string): Promise<UserProfile | null> => {
    try {
      console.log("🔍 Fetching profile for user:", userId);

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.warn("⚠️ Could not fetch profile from database:", error.message);
        // Return null but don't block the app - we can use metadata instead
        return null;
      }

      if (data) {
        console.log("✅ Profile fetched successfully:", data);
        return data as UserProfile;
      }

      console.warn("⚠️ No profile data found for user");
      return null;
    } catch (error) {
      console.error("❌ Exception fetching profile:", error);
      return null;
    }
  }, []);

  // Initialize auth state
  useEffect(() => {
    console.log("🚀 AuthContext initializing...");
    let mounted = true;

    // Get initial session
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      console.log("📍 Initial session:", session ? "exists" : "none");

      if (!mounted) return;

      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        const profileData = await fetchUserProfile(session.user.id);
        if (mounted) {
          setProfile(profileData);
        }
      }

      if (mounted) {
        setIsLoading(false);
      }
    };

    initAuth();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("🔔 Auth event:", event);

      if (!mounted) return;

      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        // Set loading to false immediately - don't wait for profile
        setIsLoading(false);

        // Handle profile loading asynchronously in the background (non-blocking)
        const loadProfile = async () => {
          const profileData = await fetchUserProfile(session.user.id);
          if (mounted) {
            setProfile(profileData);
          }
        };

        loadProfile();
      } else {
        setProfile(null);
        setIsLoading(false);
      }
    });

    return () => {
      console.log("🧹 Cleaning up auth subscription");
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchUserProfile]);

  // Sign up with email and password
  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    role: UserRole
  ) => {
    try {
      console.log("📝 Signing up user:", email, "with role:", role);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role,
          },
        },
      });

      if (error) {
        console.error("❌ Signup error:", error.message);
        return { error };
      }

      console.log("✅ Signup successful:", data);

      // Fetch profile in background (non-blocking)
      if (data.user) {
        fetchUserProfile(data.user.id).then(profileData => {
          setProfile(profileData);
        });
      }

      return { error: null };
    } catch (error) {
      console.error("❌ Signup exception:", error);
      return { error: error as Error };
    }
  };

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      console.log("🔐 Signing in user:", email);

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("❌ Login error:", error.message);
        return { error };
      }

      console.log("✅ Login successful");

      // Profile will be loaded by the onAuthStateChange listener
      return { error: null };
    } catch (error) {
      console.error("❌ Login exception:", error);
      return { error: error as Error };
    }
  };

  // Sign out
  const signOut = async () => {
    console.log("👋 Signing out");
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setSession(null);
  };

  const value = {
    user,
    profile,
    session,
    isLoading,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
