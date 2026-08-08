import { getTranslations } from 'next-intl/server';
import { getVerificationAction } from '@/features/verification/actions/get-verification';
import { VerificationView } from '@/features/verification';

export default async function VerificationPage() {
  const t = await getTranslations('ErrorsPageLoad');
  const result = await getVerificationAction();

  if (!result.ok) {
    return (
      <div className="border-border bg-card rounded-lg border px-4 py-10 text-center">
        <p className="text-foreground text-sm font-medium">
          {t('verification')}
        </p>
        <p className="text-muted-foreground mt-1 text-sm">{result.message}</p>
      </div>
    );
  }

  return <VerificationView data={result.data} />;
}
