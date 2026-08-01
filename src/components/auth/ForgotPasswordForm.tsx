'use client';

import { useState, FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { EmailOutlined } from '@mui/icons-material';
import Input from '@/components/ui/Input';
import Anchor from '@/components/ui/Anchor';
import { useRouter } from '@/i18n/navigation';
import { useAuth } from '@/providers/auth/auth-provider';
import AuthForm from '@/components/auth/utils/AuthForm';
import { useAuthErrorMessage } from '@/hooks/useAuthErrorMessage';

export default function ForgotPasswordForm() {
  const t = useTranslations('Auth');
  const getErrorMessage = useAuthErrorMessage();
  const router = useRouter();
  const { resetPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  function validate() {
    const nextErrors: Record<string, string> = {};
    if (!email.trim()) {
      nextErrors.email = t('required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = t('invalidEmail');
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);
    if (!validate()) return;

    const locale = window.location.pathname.split('/')[1] || 'ar';
    const redirectTo = `${window.location.origin}/${locale}/reset-password`;

    setIsSubmitting(true);
    const result = await resetPassword(email, redirectTo);
    setIsSubmitting(false);

    if (result.error) {
      setFormError(getErrorMessage(result.error.code, 'resetPasswordError'));
      return;
    }

    router.push(`/reset-password?email=${encodeURIComponent(email)}`);
  }

  return (
    <AuthForm
      onSubmit={handleSubmit}
      submitLabel={t('resetPasswordSubmit')}
      isSubmitting={isSubmitting}
      formError={formError}
      footer={
        <div className="flex items-center justify-center gap-1 text-sm text-neutral-600">
          <span>{t('rememberPassword')}</span>
          <Anchor href="/login" size="sm" className="font-semibold">
            {t('loginLink')}
          </Anchor>
        </div>
      }
    >
      <Input
        label={t('email')}
        type="email"
        placeholder={t('emailPlaceholder')}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        startIcon={<EmailOutlined className="text-primary-600 opacity-60" />}
        error={errors.email}
        required
      />
    </AuthForm>
  );
}
