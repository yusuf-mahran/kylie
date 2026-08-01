'use client';

import { FormEvent, ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import Btn from '@/components/ui/Btn';
import GoogleSignInButton from '@/components/shared/common/auth/GoogleSignInButton';

interface AuthFormProps {
  children: ReactNode;
  onSubmit: (e: FormEvent) => void | Promise<void>;
  submitLabel: string;
  isSubmitting: boolean;
  formError: string | null;
  footer: ReactNode;
}

export default function AuthForm({
  children,
  onSubmit,
  submitLabel,
  isSubmitting,
  formError,
  footer,
}: AuthFormProps) {
  const t = useTranslations('Auth');

  return (
    <form onSubmit={onSubmit} className="w-full flex flex-col gap-4">
      {children}
      {formError && (
        <p className="text-sm text-error text-center">{formError}</p>
      )}
      <Btn
        type="submit"
        variant="primary"
        className="w-full py-3 mt-2"
        disabled={isSubmitting}
      >
        {isSubmitting ? t('submitting') : submitLabel}
      </Btn>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-neutral-500 uppercase">{t('or')}</span>
        <div className="h-px flex-1 bg-border" />
      </div>
      <GoogleSignInButton />

      {footer}
    </form>
  );
}
