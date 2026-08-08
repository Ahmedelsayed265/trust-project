'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChatConversationsList } from '@/features/ai-chat/components/chat-conversations-list';
import { ChatPanel } from '@/features/ai-chat/components/chat-panel';
import { useAiChat } from '@/features/ai-chat/hooks/use-ai-chat';
import type {
  ChatListData,
  ChatSuggestionsData,
} from '@/features/ai-chat/types';
import { PageHeader } from '@/shared/components/page-header';

type AiChatViewProps = {
  initialList: ChatListData;
  initialSuggestions: ChatSuggestionsData;
  initialQuery?: string;
};

export function AiChatView({
  initialList,
  initialSuggestions,
  initialQuery = '',
}: AiChatViewProps) {
  const t = useTranslations('AiChat');
  const chat = useAiChat({
    initialList,
    initialSuggestions,
    initialQuery,
  });

  return (
    <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col gap-4">
      <div className="shrink-0">
        <PageHeader
          title={t('title')}
          description={t('description')}
          actions={
            <Button
              variant="outline"
              className="rounded-xl"
              nativeButton={false}
              render={<Link href="/ai-signals" />}
            >
              <Sparkles />
              {t('viewAiSignals')}
            </Button>
          }
        />
      </div>

      <Card className="flex min-h-0 flex-1 flex-col gap-0 overflow-hidden py-0">
        <CardContent className="grid h-full max-h-129.25 min-h-0 flex-1 grid-cols-1 p-0 lg:grid-cols-[260px_minmax(0,1fr)]">
          <div className="hidden h-full overflow-hidden lg:block">
            <ChatConversationsList
              items={chat.conversations}
              activeId={chat.activeId}
              pending={chat.pending}
              onSelect={chat.selectConversation}
              onCreate={chat.createConversation}
              onDelete={chat.deleteConversation}
            />
          </div>

          <div className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden">
            <ChatPanel
              conversations={chat.conversations}
              suggestions={chat.suggestions}
              displayMessages={chat.displayMessages}
              input={chat.input}
              pending={chat.pending}
              bottomRef={chat.bottomRef}
              onInputChange={chat.setInput}
              onSend={chat.sendMessage}
              onCreate={chat.createConversation}
              onSelectRecent={chat.selectConversation}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
