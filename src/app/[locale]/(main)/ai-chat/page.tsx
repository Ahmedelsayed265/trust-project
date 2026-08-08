import { getTranslations } from 'next-intl/server';
import {
  getChatListAction,
  getChatSuggestionsAction,
} from '@/features/ai-chat/actions/chat';
import { AiChatView } from '@/features/ai-chat';

export default async function AiChatPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const t = await getTranslations('AiChat');
  const params = await searchParams;
  const [listResult, suggestionsResult] = await Promise.all([
    getChatListAction({ per_page: 20 }),
    getChatSuggestionsAction(),
  ]);

  if (!listResult.ok) {
    return (
      <div className="border-border bg-card rounded-lg border px-4 py-10 text-center">
        <p className="text-foreground text-sm font-medium">{t('loadError')}</p>
        <p className="text-muted-foreground mt-1 text-sm">
          {listResult.message}
        </p>
      </div>
    );
  }

  const suggestions = suggestionsResult.ok
    ? suggestionsResult.data
    : {
        greeting: t('defaultGreeting'),
        suggestions: listResult.data.suggestions,
      };

  return (
    <AiChatView
      initialList={listResult.data}
      initialSuggestions={suggestions}
      initialQuery={params.q?.trim() || ''}
    />
  );
}
