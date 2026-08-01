import { getTranslations } from 'next-intl/server';
import AuthShell from '@/components/auth/utils/AuthShell';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';

export async function generateMetadata() {
  const t = await getTranslations('Auth');
  return {
    title: `${t('resetPasswordTitle')} | Kylie`,
  };
}

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; token?: string }>;
}) {
  const t = await getTranslations('Auth');
  const { email, token } = await searchParams;

  return (
    <AuthShell
      title={t('resetPasswordTitle')}
      subtitle={t('resetPasswordSubtitle')}
    >
      <ResetPasswordForm email={email} token={token} />
    </AuthShell>
  );
}
