export type ChatPagination = {
  current_page: number;
  first_page_url: string | null;
  from: number | null;
  last_page: number;
  last_page_url: string | null;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number | null;
  total: number;
};

export type ChatConversationSummary = {
  id: number;
  title: string;
  messages_count: number;
  last_message_at: string | null;
  last_message_label: string | null;
  created_at: string;
};

export type ChatMessageMeta =
  | {
      suggestions?: string[];
      intent?: string;
      equity?: number;
      [key: string]: unknown;
    }
  | unknown[]
  | null;

export type ChatMessage = {
  id: number;
  role: 'user' | 'assistant' | string;
  content: string;
  meta: ChatMessageMeta;
  created_at: string;
};

export type ChatConversation = ChatConversationSummary & {
  messages: ChatMessage[];
};

export type ChatListData = {
  items: ChatConversationSummary[];
  suggestions: string[];
  pagination: ChatPagination;
};

export type ChatSuggestionsData = {
  greeting: string;
  suggestions: string[];
};

export type SendChatMessageInput = {
  message: string;
  conversation_id?: number;
};

export type SendChatMessageData = {
  conversation_id: number;
  user_message: ChatMessage;
  reply: ChatMessage;
};

export function chatMessageSuggestions(
  meta: ChatMessageMeta,
): string[] | undefined {
  if (!meta || Array.isArray(meta)) return undefined;
  return Array.isArray(meta.suggestions) ? meta.suggestions : undefined;
}
