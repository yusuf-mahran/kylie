/**
 * @file auth.ts
 * @description Repository layer for authentication.
 * Wraps the low-level Supabase auth helpers from @/lib/supabase and adds
 * higher-level operations (e.g. email confirmation) that are missing there.
 *
 * All functions return an `AuthResult<T>` — `{ data, error }` — so callers
 * never have to deal with thrown exceptions.
 */

import { supabase } from '@/lib/supabase/client';
import type { Provider, Session, User } from '@supabase/supabase-js';
import {
  signUpWithEmail,
  signInWithEmail,
  signInWithMagicLink as _signInWithMagicLink,
  signInWithOAuth as _signInWithOAuth,
  signOut as _signOut,
  getSession as _getSession,
  getCurrentUser as _getCurrentUser,
  sendPasswordResetEmail,
  updatePassword as _updatePassword,
  updatePasswordWithToken,
  onAuthStateChange as _onAuthStateChange,
  type AuthResult,
  type AuthErrorInfo,
  normalizeAuthError,
} from '@/lib/supabase/auth';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AuthUser {
  user: User | null;
  session: Session | null;
}

export type { AuthResult, AuthErrorInfo };

// ─── Sign up ─────────────────────────────────────────────────────────────────

/**
 * Register a new user with email + password.
 * Supabase sends a confirmation email automatically if email confirmations
 * are enabled — call `confirmEmail` once the user clicks the link.
 */
export async function signUp(
  email: string,
  password: string,
  metadata?: Record<string, unknown>,
): Promise<AuthResult<AuthUser>> {
  const result = await signUpWithEmail(email, password, metadata);
  return {
    data: { user: result.data?.user ?? null, session: result.data?.session ?? null },
    error: result.error,
  };
}

// ─── Sign in ─────────────────────────────────────────────────────────────────

/** Sign in with email + password. */
export async function login(
  email: string,
  password: string,
): Promise<AuthResult<AuthUser>> {
  const result = await signInWithEmail(email, password);
  return {
    data: { user: result.data?.user ?? null, session: result.data?.session ?? null },
    error: result.error,
  };
}

/** Passwordless / magic-link sign-in. */
export async function loginWithMagicLink(
  email: string,
  redirectTo?: string,
): Promise<AuthResult> {
  return _signInWithMagicLink(email, redirectTo);
}

/** OAuth sign-in (Google, GitHub, etc.). */
export async function loginWithOAuth(
  provider: Provider,
  redirectTo?: string,
): Promise<AuthResult> {
  return _signInWithOAuth(provider, redirectTo);
}

// ─── Confirm email ───────────────────────────────────────────────────────────

/**
 * Confirm a user's email address using the OTP token from the confirmation
 * email.  In Supabase this is done via `verifyOtp` with type `'signup'`.
 *
 * @param email  The email address the OTP was sent to.
 * @param token  The OTP token from the confirmation email link.
 */
export async function confirmEmail(
  email: string,
  token: string,
): Promise<AuthResult<AuthUser>> {
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'signup',
  });
  return {
    data: { user: data.user ?? null, session: data.session ?? null },
    error: error ? normalizeAuthError(error) : null,
  };
}

// ─── Sign out ─────────────────────────────────────────────────────────────────

/** Sign out the current user and clear the session. */
export async function logout(): Promise<AuthResult> {
  return _signOut();
}

// ─── Session & user ───────────────────────────────────────────────────────────

/** Get the current session (null if not logged in). */
export async function getSession(): Promise<Session | null> {
  return _getSession();
}

/** Get the current user (null if not logged in). */
export async function getCurrentUser(): Promise<User | null> {
  return _getCurrentUser();
}

// ─── Password management ──────────────────────────────────────────────────────

/** Send a password-reset email. */
export async function resetPassword(
  email: string,
  redirectTo?: string,
): Promise<AuthResult> {
  return sendPasswordResetEmail(email, redirectTo);
}

/** Update the password for the currently authenticated user. */
export async function updatePassword(
  newPassword: string,
): Promise<AuthResult> {
  return _updatePassword(newPassword);
}

/**
 * Complete a password reset using the OTP token from the reset email.
 * Verifies the token first, then updates the password.
 */
export async function resetPasswordWithToken(
  email: string,
  newPassword: string,
  token: string,
): Promise<AuthResult> {
  return updatePasswordWithToken(email, newPassword, token);
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
  return _onAuthStateChange(callback);
}
