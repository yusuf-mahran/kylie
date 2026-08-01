'use client';

import { useTranslations } from 'next-intl';

const AUTH_ERROR_CODE_TO_MESSAGE_KEY: Record<string, string> = {
  user_already_exists: 'userAlreadyExists',
  invalid_credentials: 'invalidCredentials',
  email_not_confirmed: 'emailNotConfirmed',
  weak_password: 'weakPassword',
  otp_expired: 'otpExpired',
  otp_disabled: 'otpDisabled',
  same_password: 'samePassword',
  user_not_found: 'userNotFound',
  unexpected_failure: 'unexpectedFailure',
  unknown: 'unexpectedFailure',
};

export function useAuthErrorMessage() {
  const t = useTranslations('Auth');
  const translate = t as unknown as (key: string) => string;

  return (code: string, defaultKey: string) => {
    const key = AUTH_ERROR_CODE_TO_MESSAGE_KEY[code] ?? defaultKey;
    return translate(key);
  };
}
