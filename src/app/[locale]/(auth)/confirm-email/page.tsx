import { getTranslations } from 'next-intl/server';
import AuthShell from '@/components/auth/utils/AuthShell';
import ConfirmEmailForm from '@/components/auth/ConfirmEmailForm';

export async function generateMetadata() {
  const t = await getTranslations('Auth');
  return {
    title: `${t('confirmEmailTitle')} | Kylie`,
  };
}

export default async function ConfirmEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; token?: string }>;
}) {
  const t = await getTranslations('Auth');
  const { email, token } = await searchParams;

  return (
    <AuthShell
      title={t('confirmEmailTitle')}
      subtitle={t('confirmEmailSubtitle')}
    >
      <ConfirmEmailForm email={email} token={token} />
    </AuthShell>
  );
}
