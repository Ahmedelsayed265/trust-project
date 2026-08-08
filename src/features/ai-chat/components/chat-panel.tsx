'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { ChatComposer } from '@/features/ai-chat/components/chat-composer';
import { ChatMessageList } from '@/features/ai-chat/components/chat-message-list';
import { ChatSuggestionsBar } from '@/features/ai-chat/components/chat-suggestions-bar';
import type {
  ChatConversationSummary,
  ChatMessage,
} from '@/features/ai-chat/types';

export function ChatPanel({
  conversations,
  suggestions,
  displayMessages,
  input,
  pending,
  bottomRef,
  onInputChange,
  onSend,
  onCreate,
  onSelectRecent,
}: {
  conversations: ChatConversationSummary[];
  suggestions: string[];
  displayMessages: ChatMessage[];
  input: string;
  pending: boolean;
  bottomRef: React.RefObject<HTMLDivElement | null>;
  onInputChange: (value: string) => void;
  onSend: (value: string) => void;
  onCreate: () => void;
  onSelectRecent: (id: number) => void;
}) {
  const t = useTranslations('AiChat');

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
      <div className="border-border flex shrink-0 items-center justify-between gap-2 border-b px-4 py-3 lg:hidden">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="rounded-xl"
          disabled={pending}
          onClick={onCreate}
        >
          {t('newChat')}
        </Button>
        {conversations[0] ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="rounded-xl"
            disabled={pending}
            onClick={() => onSelectRecent(conversations[0]!.id)}
          >
            {t('recent')}
          </Button>
        ) : null}
      </div>

      <ChatSuggestionsBar
        suggestions={suggestions}
        pending={pending}
        onSelect={onSend}
      />

      <ChatMessageList
        messages={displayMessages}
        pending={pending}
        bottomRef={bottomRef}
      />

      <div className="shrink-0">
        <ChatComposer
          value={input}
          pending={pending}
          onChange={onInputChange}
          onSend={onSend}
        />
      </div>
    </div>
  );
}
