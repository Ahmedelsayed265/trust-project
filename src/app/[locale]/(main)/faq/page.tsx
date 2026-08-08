import { getFaqsAction } from '@/features/faq/actions/get-faqs';
import { FaqView } from '@/features/faq/components/faq-view';

export default async function FaqPage() {
  const result = await getFaqsAction();

  if (!result.ok) {
    return (
      <div className="border-border bg-card rounded-lg border px-4 py-10 text-center">
        <p className="text-foreground text-sm font-medium">
          Couldn&apos;t load FAQs
        </p>
        <p className="text-muted-foreground mt-1 text-sm">{result.message}</p>
      </div>
    );
  }

  return <FaqView initialData={result.data} />;
}
