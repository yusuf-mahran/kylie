/**
 * @file auth.ts
 * @description All Supabase Auth operations in one place.
 * Covers email/password, magic link, OAuth, session management, and helpers.
 */

import { supabase } from './client';
import { isAuthError } from '@supabase/supabase-js';
import type { Provider, Session, User } from '@supabase/supabase-js';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AuthErrorInfo {
  code: string;
  message: string;
}

export interface AuthResult<T = null> {
  data: T;
  error: AuthErrorInfo | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function normalizeAuthError(error: unknown): AuthErrorInfo {
  if (isAuthError(error)) {
    return {
      code: error.code ?? 'unexpected_failure',
      message: error.message,
    };
  }

  if (error instanceof Error) {
    return { code: 'unexpected_failure', message: error.message };
  }

  return { code: 'unexpected_failure', message: 'Unknown error' };
}

// ─── Sign up ─────────────────────────────────────────────────────────────────

/**
 * Register with email + password.
 * Supabase sends a confirmation email automatically if email confirmations are on.
 */
export async function signUpWithEmail(
  email: string,
  password: string,
  metadata?: Record<string, unknown>,
): Promise<AuthResult<{ user: User | null; session: Session | null } | null>> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: metadata },
  });
  return {
    data: {
      user: data.user,
      session: data.session,
    },
    error: error ? normalizeAuthError(error) : null,
  };
}

export async function resendEmailConfirmation(email: string): Promise<void> {
  await supabase.auth.resend({
    type: 'signup',
    email,
  });
}

// ─── Sign in ─────────────────────────────────────────────────────────────────

export async function signInWithEmail(
  email: string,
  password: string,
): Promise<AuthResult<{ session: Session | null; user: User | null } | null>> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return {
    data: { session: data.session, user: data.user },
    error: error ? normalizeAuthError(error) : null,
  };
}

/**
 * Passwordless / magic-link sign-in.
 * @param redirectTo  Full URL Supabase should redirect to after the user clicks the link.
 */
export async function signInWithMagicLink(
  email: string,
  redirectTo?: string,
): Promise<AuthResult> {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: redirectTo },
  });
  return { data: null, error: error ? normalizeAuthError(error) : null };
}

/**
 * OAuth sign-in (Google, GitHub, etc.)
 * @param provider  Supabase provider string e.g. "google" | "github"
 */
export async function signInWithOAuth(
  provider: Provider,
  redirectTo?: string,
): Promise<AuthResult> {
  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo },
  });
  return { data: null, error: error ? normalizeAuthError(error) : null };
}

// ─── Sign out ─────────────────────────────────────────────────────────────────

export async function signOut(): Promise<AuthResult> {
  const { error } = await supabase.auth.signOut();
  return { data: null, error: error ? normalizeAuthError(error) : null };
}

// ─── Session & user ───────────────────────────────────────────────────────────

/** Get the current session (null if not logged in). */
export async function getSession(): Promise<Session | null> {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

/** Get the current user (null if not logged in). */
export async function getCurrentUser(): Promise<User | null> {
  const { data } = await supabase.auth.getUser();
  return data.user;
}

// ─── Password management ──────────────────────────────────────────────────────

export async function sendPasswordResetEmail(
  email: string,
  redirectTo?: string,
): Promise<AuthResult> {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  });
  return { data: null, error: error ? normalizeAuthError(error) : null };
}

export async function updatePassword(newPassword: string): Promise<AuthResult> {
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  return { data: null, error: error ? normalizeAuthError(error) : null };
}

export async function updatePasswordWithToken(
  email: string,
  newPassword: string,
  token: string,
): Promise<AuthResult> {
  const { error: otpError } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'recovery',
  });
  if (otpError) return { data: null, error: normalizeAuthError(otpError) };

  const { error } = await supabase.auth.updateUser({ password: newPassword });
  return { data: null, error: error ? normalizeAuthError(error) : null };
}

// ─── Auth state listener ──────────────────────────────────────────────────────

/**
 * Subscribe to auth state changes.
 * Returns an unsubscribe function — call it on component unmount.
 *
 * @example
 * const unsub = onAuthStateChange((event, session) => { ... });
 * return () => unsub();
 */
export function onAuthStateChange(
  callback: (event: string, session: Session | null) => void,
) {
  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });
  return () => data.subscription.unsubscribe();
}
