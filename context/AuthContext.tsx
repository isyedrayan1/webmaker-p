"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  onAuthStateChanged,
  onIdTokenChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  type User,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  signInWithEmail: (email: string, pass: string) => Promise<User>;
  signUpWithEmail: (email: string, pass: string, name?: string) => Promise<User>;
  signInWithGoogle: () => Promise<User>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  getIdToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function setAuthCookie(token: string) {
  // Set persistent session cookie valid for 7 days
  const maxAge = 7 * 24 * 60 * 60;
  document.cookie = `wm_auth_token=${token}; path=/; max-age=${maxAge}; SameSite=Lax;`;
}

function clearAuthCookie() {
  document.cookie = "wm_auth_token=; path=/; max-age=0; SameSite=Lax;";
}

async function syncProfileToDatabase(currentUser?: User | null) {
  try {
    const token = currentUser ? await currentUser.getIdToken() : undefined;
    await fetch("/api/user/profile", {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  } catch {
    // Non-blocking background profile sync
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Listen to Firebase auth state
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const freshToken = await currentUser.getIdToken();
          setToken(freshToken);
          setAuthCookie(freshToken);
          syncProfileToDatabase(currentUser);
        } catch (e) {
          console.error("Failed to retrieve auth token:", e);
        }
      } else {
        setToken(null);
        clearAuthCookie();
      }
      setLoading(false);
    });

    // 2. Keep token fresh in cookies whenever Firebase refreshes the token (every hour)
    const unsubscribeToken = onIdTokenChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const freshToken = await currentUser.getIdToken();
          setToken(freshToken);
          setAuthCookie(freshToken);
        } catch {
          // Token refresh fallback
        }
      }
    });

    return () => {
      unsubscribeAuth();
      unsubscribeToken();
    };
  }, []);

  const getIdToken = async () => {
    if (!auth.currentUser) return null;
    return await auth.currentUser.getIdToken();
  };

  const signInWithEmail = async (email: string, pass: string) => {
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    const idToken = await cred.user.getIdToken();
    setAuthCookie(idToken);
    setToken(idToken);
    setUser(cred.user);
    syncProfileToDatabase(cred.user);
    return cred.user;
  };

  const signUpWithEmail = async (email: string, pass: string, name?: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    if (name) {
      await updateProfile(cred.user, { displayName: name });
    }
    const idToken = await cred.user.getIdToken();
    setAuthCookie(idToken);
    setToken(idToken);
    setUser(cred.user);
    syncProfileToDatabase(cred.user);
    return cred.user;
  };

  const signInWithGoogle = async () => {
    const cred = await signInWithPopup(auth, googleProvider);
    const idToken = await cred.user.getIdToken();
    setAuthCookie(idToken);
    setToken(idToken);
    setUser(cred.user);
    syncProfileToDatabase(cred.user);
    return cred.user;
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const logout = async () => {
    await signOut(auth);
    clearAuthCookie();
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        resetPassword,
        logout,
        getIdToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
