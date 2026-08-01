'use client';

import { useState, FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { EmailOutlined } from '@mui/icons-material';
import Input from '@/components/ui/Input';
import Anchor from '@/components/ui/Anchor';
import OtpInput from '@/components/ui/OtpInput';
import { useAuth } from '@/providers/auth/auth-provider';
import AuthForm from '@/components/auth/utils/AuthForm';
import { useAuthErrorMessage } from '@/hooks/useAuthErrorMessage';
import { useToast } from '@/providers/shared/toast-provider';

interface ConfirmEmailFormProps {
  email?: string;
  token?: string;
}

export default function ConfirmEmailForm({
  email: initialEmail = '',
  token: initialToken = '',
}: ConfirmEmailFormProps) {
  const t = useTranslations('Auth');
  const getErrorMessage = useAuthErrorMessage();
  const router = useRouter();
  const { confirmEmail } = useAuth();
  const toast = useToast();

  const [email, setEmail] = useState(initialEmail);
  const [token, setToken] = useState(initialToken);
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
    if (!token || token.length !== 8) {
      nextErrors.token = t('invalidToken');
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);
    if (!validate()) return;

    setIsSubmitting(true);
    const result = await confirmEmail(email, token);
    setIsSubmitting(false);

    if (result.error) {
      setFormError(getErrorMessage(result.error.code, 'confirmEmailError'));
      return;
    }

    toast.success(t('signupSuccess'));
    router.push('/');
  }

  return (
    <AuthForm
      onSubmit={handleSubmit}
      submitLabel={t('confirmEmailSubmit')}
      isSubmitting={isSubmitting}
      formError={formError}
      footer={
        <div className="flex items-center justify-center gap-1 text-sm text-neutral-600">
          <span>{t('noCode')}</span>
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
      <div className="w-full">
        <label className="block mb-1.5 text-sm font-medium text-neutral-800">
          {t('verificationCode')}
          <span className="text-error ml-1">*</span>
        </label>
        <OtpInput
          value={token}
          onChange={setToken}
          disabled={isSubmitting}
          error={errors.token}
        />
      </div>
    </AuthForm>
  );
}
