import { describe, expect, it } from 'vitest';
import { chatMessageSuggestions } from '@/features/ai-chat/types';

describe('chatMessageSuggestions', () => {
  it('returns suggestions from object meta', () => {
    expect(
      chatMessageSuggestions({
        suggestions: ['Show portfolio', 'Explain BTC'],
      }),
    ).toEqual(['Show portfolio', 'Explain BTC']);
  });

  it('returns undefined for arrays, null, or missing suggestions', () => {
    expect(chatMessageSuggestions(null)).toBeUndefined();
    expect(chatMessageSuggestions([])).toBeUndefined();
    expect(chatMessageSuggestions({ intent: 'help' })).toBeUndefined();
    expect(
      chatMessageSuggestions({ suggestions: 'nope' as never }),
    ).toBeUndefined();
  });
});
