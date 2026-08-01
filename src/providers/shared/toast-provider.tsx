'use client';

import { createContext, useContext, useCallback, ReactNode } from 'react';
import { showToast, type ToastOptions } from 'nextjs-toast-notify';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastContextValue {
  /** Show a success toast. */
  success: (message: string, options?: ToastOptions) => void;
  /** Show an error toast. */
  error: (message: string, options?: ToastOptions) => void;
  /** Show a warning toast. */
  warning: (message: string, options?: ToastOptions) => void;
  /** Show an info toast. */
  info: (message: string, options?: ToastOptions) => void;
  /** Show a toast with any type. */
  show: (type: ToastType, message: string, options?: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const defaultOptions: ToastOptions = {
  position: 'bottom-center',
  duration: 5000,
  transition: 'slideInUp',
  progress: true,
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const show = useCallback(
    (type: ToastType, message: string, options?: ToastOptions) => {
      const mergedOptions = { ...defaultOptions, ...options };
      showToast[type](message, mergedOptions);
    },
    [],
  );

  const success = useCallback(
    (message: string, options?: ToastOptions) =>
      show('success', message, options),
    [show],
  );
  const error = useCallback(
    (message: string, options?: ToastOptions) =>
      show('error', message, options),
    [show],
  );
  const warning = useCallback(
    (message: string, options?: ToastOptions) =>
      show('warning', message, options),
    [show],
  );
  const info = useCallback(
    (message: string, options?: ToastOptions) => show('info', message, options),
    [show],
  );

  const value: ToastContextValue = {
    success,
    error,
    warning,
    info,
    show,
  };

  return (
    <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
