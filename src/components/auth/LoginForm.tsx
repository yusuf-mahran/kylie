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
import { useAuth } from '@/providers/auth/auth-provider';
import AuthForm from '@/components/auth/utils/AuthForm';
import { useAuthErrorMessage } from '@/hooks/useAuthErrorMessage';
import { useToast } from '@/providers/shared/toast-provider';

export default function LoginForm() {
  const t = useTranslations('Auth');
  const getErrorMessage = useAuthErrorMessage();
  const router = useRouter();
  const { login } = useAuth();
  const toast = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
    if (!password) {
      nextErrors.password = t('required');
    } else if (password.length < 8) {
      nextErrors.password = t('passwordMin');
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);
    if (!validate()) return;

    setIsSubmitting(true);
    const result = await login(email, password);
    setIsSubmitting(false);

    if (result.error) {
      setFormError(getErrorMessage(result.error.code, 'loginError'));
      return;
    }

    toast.success(t('loginSuccess'));
    router.push('/shop');
  }

  return (
    <AuthForm
      onSubmit={handleSubmit}
      submitLabel={t('loginSubmit')}
      isSubmitting={isSubmitting}
      formError={formError}
      footer={
        <div className="flex items-center justify-center gap-1 text-sm text-neutral-600">
          <span>{t('noAccount')}</span>
          <Anchor href="/signup" size="sm" className="font-semibold">
            {t('signupLink')}
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
      <Input
        label={t('password')}
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
      />
      <div className="w-full flex justify-end -mt-2">
        <Anchor href="/forgot-password" size="sm">
          {t('forgotPassword')}
        </Anchor>
      </div>
    </AuthForm>
  );
}
