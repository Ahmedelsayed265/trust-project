'use client';

export function ChatSuggestionsBar({
  suggestions,
  pending,
  onSelect,
}: {
  suggestions: string[];
  pending: boolean;
  onSelect: (suggestion: string) => void;
}) {
  if (suggestions.length === 0) return null;

  return (
    <div className="border-border h-13.5 shrink-0 border-b px-4 py-3">
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            disabled={pending}
            onClick={() => onSelect(suggestion)}
            className="border-border bg-background text-muted-foreground hover:border-primary/30 hover:bg-primary/5 hover:text-foreground rounded-full border px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-50"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}
