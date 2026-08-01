import { getTranslations } from 'next-intl/server';
import AuthShell from '@/components/auth/utils/AuthShell';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';

export async function generateMetadata() {
  const t = await getTranslations('Auth');
  return {
    title: `${t('forgotPasswordTitle')} | Kylie`,
  };
}

export default async function ForgotPasswordPage() {
  const t = await getTranslations('Auth');

  return (
    <AuthShell
      title={t('forgotPasswordTitle')}
      subtitle={t('forgotPasswordSubtitle')}
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
