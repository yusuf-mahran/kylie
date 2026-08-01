import { getTranslations } from 'next-intl/server';
import AuthShell from '@/components/auth/utils/AuthShell';
import LoginForm from '@/components/auth/LoginForm';

export async function generateMetadata() {
  const t = await getTranslations('Auth');
  return {
    title: `${t('loginTitle')} | Kylie`,
  };
}

export default async function LoginPage() {
  const t = await getTranslations('Auth');

  return (
    <AuthShell title={t('loginTitle')} subtitle={t('loginSubtitle')}>
      <LoginForm />
    </AuthShell>
  );
}
