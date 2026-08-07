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
  const params = await searchParams;
  const [listResult, suggestionsResult] = await Promise.all([
    getChatListAction({ per_page: 20 }),
    getChatSuggestionsAction(),
  ]);

  if (!listResult.ok) {
    return (
      <div className="border-border bg-card rounded-lg border px-4 py-10 text-center">
        <p className="text-foreground text-sm font-medium">
          Couldn&apos;t load chat
        </p>
        <p className="text-muted-foreground mt-1 text-sm">
          {listResult.message}
        </p>
      </div>
    );
  }

  const suggestions = suggestionsResult.ok
    ? suggestionsResult.data
    : {
        greeting:
          "Hi — I'm your TrustAI assistant. Ask about markets, signals, portfolio risk, or how to use the platform.",
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
