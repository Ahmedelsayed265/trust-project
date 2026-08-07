'use client';

import { Bot, UserRound } from 'lucide-react';
import type { ChatMessage } from '@/features/ai-chat/types';
import { cn } from '@/lib/utils';

export function ChatMessageList({
  messages,
  pending,
  bottomRef,
}: {
  messages: ChatMessage[];
  pending: boolean;
  bottomRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain px-4 py-4">
      {messages.map((message) => {
        const isUser = message.role === 'user';
        return (
          <div
            key={message.id}
            className={cn(
              'flex gap-3',
              isUser ? 'justify-end' : 'justify-start',
            )}
          >
            {!isUser ? (
              <div className="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-xl">
                <Bot className="size-4" />
              </div>
            ) : null}
            <div
              className={cn(
                'max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed sm:max-w-[75%]',
                isUser
                  ? 'bg-primary text-primary-foreground'
                  : 'border-border bg-muted/40 text-foreground border',
              )}
            >
              {message.content}
            </div>
            {isUser ? (
              <div className="bg-muted text-foreground flex size-9 shrink-0 items-center justify-center rounded-xl">
                <UserRound className="size-4" />
              </div>
            ) : null}
          </div>
        );
      })}

      {pending ? (
        <div className="flex gap-3">
          <div className="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-xl">
            <Bot className="size-4" />
          </div>
          <div className="border-border bg-muted/40 text-muted-foreground rounded-2xl border px-3.5 py-2.5 text-sm">
            Thinking…
          </div>
        </div>
      ) : null}
      <div ref={bottomRef} />
    </div>
  );
}
