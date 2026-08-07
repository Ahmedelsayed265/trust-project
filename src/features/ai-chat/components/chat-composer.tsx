'use client';

import { ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ChatComposer({
  value,
  pending,
  onChange,
  onSend,
}: {
  value: string;
  pending: boolean;
  onChange: (value: string) => void;
  onSend: (value: string) => void;
}) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSend(value);
      }}
      className="border-border border-t p-3 sm:p-4"
    >
      <div className="border-border bg-background flex items-end gap-2 rounded-2xl border p-2">
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              onSend(value);
            }
          }}
          rows={1}
          placeholder="Ask TrustAI anything..."
          className="placeholder:text-muted-foreground max-h-32 min-h-11 flex-1 resize-none bg-transparent px-2 py-2.5 text-sm outline-none"
        />
        <Button
          type="submit"
          size="icon"
          className="size-10 shrink-0 rounded-xl"
          disabled={!value.trim() || pending}
          aria-label="Send message"
        >
          <ArrowUp className="size-4" />
        </Button>
      </div>
      <p className="text-muted-foreground mt-2 text-xs">
        AI responses are educational and not financial advice.
      </p>
    </form>
  );
}
