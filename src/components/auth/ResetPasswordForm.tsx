'use client';

import { useState, FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import {
  EmailOutlined,
  LockOutlined,
  VisibilityOffOutlined,
  VisibilityOutlined,
} from '@mui/icons-material';
import Input from '@/components/ui/Input';
import Anchor from '@/components/ui/Anchor';
import OtpInput from '@/components/ui/OtpInput';
import { useAuth } from '@/providers/auth/auth-provider';
import { useToast } from '@/providers/shared/toast-provider';
import AuthForm from '@/components/auth/utils/AuthForm';
import { useAuthErrorMessage } from '@/hooks/useAuthErrorMessage';

interface ResetPasswordFormProps {
  email?: string;
  token?: string;
}

export default function ResetPasswordForm({
  email: initialEmail = '',
  token: initialToken = '',
}: ResetPasswordFormProps) {
  const t = useTranslations('Auth');
  const getErrorMessage = useAuthErrorMessage();
  const router = useRouter();
  const toast = useToast();
  const { resetPasswordWithToken } = useAuth();

  const [email, setEmail] = useState(initialEmail);
  const [token, setToken] = useState(initialToken);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    if (!password) {
      nextErrors.password = t('required');
    } else if (password.length < 8) {
      nextErrors.password = t('passwordMin');
    }
    if (!confirmPassword) {
      nextErrors.confirmPassword = t('required');
    } else if (confirmPassword !== password) {
      nextErrors.confirmPassword = t('passwordMismatch');
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);
    if (!validate()) return;

    setIsSubmitting(true);
    const result = await resetPasswordWithToken(email, password, token);
    setIsSubmitting(false);

    if (result.error) {
      setFormError(getErrorMessage(result.error.code, 'resetPasswordError'));
      return;
    }

    toast.success(t('resetPasswordSuccess'));
    router.push(`/login`);
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
      <div className="w-full">
        <label className="block mb-1.5 text-sm font-medium text-neutral-800">
          {t('verificationCode')}
          <span className="text-error ml-1">*</span>
        </label>
        <OtpInput
          length={8}
          value={token}
          onChange={setToken}
          disabled={isSubmitting}
          error={errors.token}
        />
      </div>
      <Input
        label={t('newPassword')}
        name="new password"
        type={showPassword ? 'text' : 'password'}
        placeholder={t('passwordPlaceholder')}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        startIcon={<LockOutlined className="text-primary-600 opacity-60" />}
        endIcon={
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="p-0.5 rounded-full hover:bg-neutral-100 transition-colors"
            aria-label={showPassword ? t('hidePassword') : t('showPassword')}
          >
            {showPassword ? (
              <VisibilityOffOutlined className="text-primary-600 opacity-60" />
            ) : (
              <VisibilityOutlined className="text-primary-600 opacity-60" />
            )}
          </button>
        }
        error={errors.password}
        required
        autoComplete="new-password"
      />
      <Input
        label={t('confirmPassword')}
        type={showConfirmPassword ? 'text' : 'password'}
        placeholder={t('confirmPasswordPlaceholder')}
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        startIcon={<LockOutlined className="text-primary-600 opacity-60" />}
        endIcon={
          <button
            type="button"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            className="p-0.5 rounded-full hover:bg-neutral-100 transition-colors"
            aria-label={
              showConfirmPassword ? t('hidePassword') : t('showPassword')
            }
          >
            {showConfirmPassword ? (
              <VisibilityOffOutlined className="text-primary-600 opacity-60" />
            ) : (
              <VisibilityOutlined className="text-primary-600 opacity-60" />
            )}
          </button>
        }
        error={errors.confirmPassword}
        required
        autoComplete="new-password"
      />
    </AuthForm>
  );
}
