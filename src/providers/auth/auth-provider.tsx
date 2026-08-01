'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import type { User, Session, Provider } from '@supabase/supabase-js';
import {
  signUp,
  login,
  loginWithMagicLink,
  loginWithOAuth,
  confirmEmail,
  logout,
  resetPassword,
  updatePassword,
  resetPasswordWithToken,
  getSession,
  getCurrentUser,
  onAuthStateChange,
  type AuthResult,
  type AuthUser,
} from '@/repositories/auth';
import { Loader } from '@/components/shared/common/Loader';

export interface AuthContextValue {
  /** Current authenticated user, or null when signed out. */
  user: User | null;
  /** Current Supabase session, or null when signed out. */
  session: Session | null;
  /** True while the initial session/user lookup is in progress. */
  isLoading: boolean;
  /** Register a new user with email + password. */
  signUp: (
    email: string,
    password: string,
    metadata?: Record<string, unknown>,
  ) => Promise<AuthResult<AuthUser>>;
  /** Sign in with email + password. */
  login: (email: string, password: string) => Promise<AuthResult<AuthUser>>;
  /** Passwordless / magic-link sign-in. */
  loginWithMagicLink: (
    email: string,
    redirectTo?: string,
  ) => Promise<AuthResult>;
  /** OAuth sign-in (Google, GitHub, etc.). */
  loginWithOAuth: (
    provider: Provider,
    redirectTo?: string,
  ) => Promise<AuthResult>;
  /** Confirm a user's email using the OTP from the confirmation email. */
  confirmEmail: (email: string, token: string) => Promise<AuthResult<AuthUser>>;
  /** Sign out the current user. */
  logout: () => Promise<AuthResult>;
  /** Send a password-reset email. */
  resetPassword: (email: string, redirectTo?: string) => Promise<AuthResult>;
  /** Update the password for the currently authenticated user. */
  updatePassword: (newPassword: string) => Promise<AuthResult>;
  /** Complete a password reset using the OTP token from the reset email. */
  resetPasswordWithToken: (
    email: string,
    newPassword: string,
    token: string,
  ) => Promise<AuthResult>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function initialize() {
      const currentSession = await getSession();
      const currentUser = await getCurrentUser();

      if (!isMounted) return;

      setSession(currentSession);
      setUser(currentUser ?? currentSession?.user ?? null);
      setIsLoading(false);
    }

    initialize();

    const unsubscribe = onAuthStateChange((event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const value: AuthContextValue = {
    user,
    session,
    isLoading,
    signUp,
    login,
    loginWithMagicLink,
    loginWithOAuth,
    confirmEmail,
    logout,
    resetPassword,
    updatePassword,
    resetPasswordWithToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {isLoading ? <Loader /> : children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
