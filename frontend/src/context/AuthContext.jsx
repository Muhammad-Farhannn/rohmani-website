import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    // Check active sessions and sets the user
    async function checkSession() {
      try {
        if (supabase && supabase.auth) {
          const { data: { session } } = await supabase.auth.getSession();
          if (active) {
            setUser(session?.user ?? null);
          }
        }
      } catch (err) {
        console.error("Error fetching Supabase session:", err);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    checkSession();

    // Listen for changes on auth state
    let subscription = null;
    try {
      if (supabase && supabase.auth) {
        const { data } = supabase.auth.onAuthStateChange((_event, session) => {
          if (active) {
            setUser(session?.user ?? null);
          }
        });
        subscription = data?.subscription;
      }
    } catch (err) {
      console.error("Error setting up Supabase auth listener:", err);
    }

    return () => {
      active = false;
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  const value = {
    signUp: (data) => supabase.auth.signUp(data),
    signIn: (data) => supabase.auth.signInWithPassword(data),
    signInWithGoogle: () => supabase.auth.signInWithOAuth({ 
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    }),
    signOut: () => supabase.auth.signOut(),
    user,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

