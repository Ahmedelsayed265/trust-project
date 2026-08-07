'use client';

import { MessageSquarePlus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ChatConversationSummary } from '@/features/ai-chat/types';
import { cn } from '@/lib/utils';

export function ChatConversationsList({
  items,
  activeId,
  pending,
  onSelect,
  onCreate,
  onDelete,
}: {
  items: ChatConversationSummary[];
  activeId: number | null;
  pending: boolean;
  onSelect: (id: number) => void;
  onCreate: () => void;
  onDelete: (id: number) => void;
}) {
  return (
    <div className="border-border flex h-full min-h-0 flex-col border-r">
      <div className="border-border flex h-13.5 items-center justify-between gap-2 border-b px-3 py-3">
        <p className="text-foreground text-sm font-semibold">Conversations</p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="rounded-xl"
          disabled={pending}
          onClick={onCreate}
        >
          <MessageSquarePlus className="size-4" />
          New
        </Button>
      </div>

      <div className="min-h-0 flex-1 space-y-1 overflow-y-auto p-2">
        {items.length === 0 ? (
          <p className="text-muted-foreground px-2 py-8 text-center text-xs">
            No conversations yet. Ask a question to start.
          </p>
        ) : (
          items.map((item) => {
            const active = item.id === activeId;
            return (
              <div
                key={item.id}
                className={cn(
                  'group flex items-start gap-1 rounded-xl',
                  active ? 'bg-primary/8' : 'hover:bg-muted/50',
                )}
              >
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => onSelect(item.id)}
                  className="min-w-0 flex-1 px-2.5 py-2.5 text-left"
                >
                  <p className="text-foreground truncate text-sm font-medium">
                    {item.title}
                  </p>
                  <p className="text-muted-foreground mt-0.5 text-xs">
                    {item.last_message_label ?? 'No messages'}
                    {` · ${item.messages_count}`}
                  </p>
                </button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive mt-1 mr-1 size-8 shrink-0 rounded-lg opacity-0 group-hover:opacity-100"
                  disabled={pending}
                  aria-label={`Delete ${item.title}`}
                  onClick={() => onDelete(item.id)}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
