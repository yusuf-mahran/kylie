import { getTranslations } from 'next-intl/server';
import AuthShell from '@/components/auth/utils/AuthShell';
import SignupForm from '@/components/auth/SignupForm';

export async function generateMetadata() {
  const t = await getTranslations('Auth');
  return {
    title: `${t('signupTitle')} | Kylie`,
  };
}

export default async function SignupPage() {
  const t = await getTranslations('Auth');

  return (
    <AuthShell title={t('signupTitle')} subtitle={t('signupSubtitle')}>
      <SignupForm />
    </AuthShell>
  );
}
