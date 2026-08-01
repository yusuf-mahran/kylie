'use client';

import { useState, FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import {
  EmailOutlined,
  LockOutlined,
  PersonOutlined,
  PhoneOutlined,
  VisibilityOffOutlined,
  VisibilityOutlined,
} from '@mui/icons-material';
import Input from '@/components/ui/Input';
import Anchor from '@/components/ui/Anchor';
import { useAuth } from '@/providers/auth/auth-provider';
import AuthForm from '@/components/auth/utils/AuthForm';
import { useAuthErrorMessage } from '@/hooks/useAuthErrorMessage';
import { useParams } from 'next/navigation';
import clsx from 'clsx';
import { useToast } from '@/providers/shared/toast-provider';

export default function SignupForm() {
  const t = useTranslations('Auth');
  const getErrorMessage = useAuthErrorMessage();
  const router = useRouter();
  const { signUp } = useAuth();
  const { locale } = useParams();
  const toast = useToast();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  function validate() {
    const nextErrors: Record<string, string> = {};
    if (!firstName.trim()) nextErrors.firstName = t('required');
    if (!lastName.trim()) nextErrors.lastName = t('required');
    if (!email.trim()) {
      nextErrors.email = t('required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = t('invalidEmail');
    }
    if (!mobile.trim()) {
      nextErrors.mobile = t('required');
    } else if (!/^(10|11|12|15)\d{8}$/.test(mobile)) {
      nextErrors.mobile = t('invalidMobile');
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
    const result = await signUp(email, password, {
      first_name: firstName,
      last_name: lastName,
      mobile: `+20${mobile}`,
    });

    setIsSubmitting(false);

    if (result.error) {
      if (result.error.code === 'user_already_exists') {
        toast.error(getErrorMessage('user_already_exists', 'signupError'));
        router.push(`/login?email=${encodeURIComponent(email)}`);
      } else {
        setFormError(getErrorMessage(result.error.code, 'signupError'));
      }

      return;
    }

    router.push(`/confirm-email?email=${encodeURIComponent(email)}`);
  }

  return (
    <AuthForm
      onSubmit={handleSubmit}
      submitLabel={t('signupSubmit')}
      isSubmitting={isSubmitting}
      formError={formError}
      footer={
        <div className="flex items-center justify-center gap-1 text-sm text-neutral-600">
          <span>{t('hasAccount')}</span>
          <Anchor href="/login" size="sm" className="font-semibold">
            {t('loginLink')}
          </Anchor>
        </div>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label={t('firstName')}
          type="text"
          placeholder={t('firstNamePlaceholder')}
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          startIcon={<PersonOutlined className="text-primary-600 opacity-60" />}
          error={errors.firstName}
          required
        />
        <Input
          label={t('lastName')}
          type="text"
          placeholder={t('lastNamePlaceholder')}
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          startIcon={<PersonOutlined className="text-primary-600 opacity-60" />}
          error={errors.lastName}
          required
        />
      </div>
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
          {t('mobile')}
          <span className="text-error ml-1">*</span>
        </label>
        <div className={clsx('w-full grid grid-cols-[auto_1fr] gap-2')}>
          <p className="flex justify-center items-center p-1 rounded-xl bg-surface text-sm font-bold font-heading pt-2">
            🇪🇬 EG (+20)
          </p>
          <Input
            type="tel"
            placeholder={t('mobilePlaceholder')}
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            startIcon={
              <PhoneOutlined className="text-primary-600 opacity-60" />
            }
            dir={locale === 'ar' ? 'rtl' : 'ltr'}
            error={errors.mobile}
            required
          />
        </div>
      </div>
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
    </AuthForm>
  );
}
