'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { toast } from 'sonner';
import { chatMessageSuggestions } from '@/features/ai-chat/types';
import {
  createChatConversationAction,
  deleteChatConversationAction,
  getChatConversationAction,
  sendChatMessageAction,
} from '@/features/ai-chat/actions/chat';
import type {
  ChatListData,
  ChatMessage,
  ChatSuggestionsData,
} from '@/features/ai-chat/types';

export function useAiChat({
  initialList,
  initialSuggestions,
  initialQuery = '',
}: {
  initialList: ChatListData;
  initialSuggestions: ChatSuggestionsData;
  initialQuery?: string;
}) {
  const defaultSuggestions = initialList.suggestions.length
    ? initialList.suggestions
    : initialSuggestions.suggestions;

  const [conversations, setConversations] = useState(initialList.items);
  const [suggestions, setSuggestions] = useState(defaultSuggestions);
  const [greeting] = useState(initialSuggestions.greeting);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState(initialQuery);
  const [pending, startTransition] = useTransition();
  const bottomRef = useRef<HTMLDivElement>(null);
  const showEmpty = activeId == null && messages.length === 0;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, pending]);

  function selectConversation(id: number) {
    startTransition(async () => {
      const result = await getChatConversationAction(id);
      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      setActiveId(result.data.id);
      setMessages(result.data.messages);
      const lastAssistant = [...result.data.messages]
        .reverse()
        .find((message) => message.role === 'assistant');
      const nextSuggestions = chatMessageSuggestions(
        lastAssistant?.meta ?? null,
      );
      if (nextSuggestions?.length) setSuggestions(nextSuggestions);
    });
  }

  function createConversation() {
    startTransition(async () => {
      const result = await createChatConversationAction();
      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      const { messages: nextMessages, ...summary } = result.data;
      setConversations((prev) => [
        summary,
        ...prev.filter((item) => item.id !== summary.id),
      ]);
      setActiveId(summary.id);
      setMessages(nextMessages);
      const nextSuggestions = chatMessageSuggestions(
        nextMessages[0]?.meta ?? null,
      );
      setSuggestions(
        nextSuggestions?.length ? nextSuggestions : defaultSuggestions,
      );
    });
  }

  function resetToEmpty() {
    setActiveId(null);
    setMessages([]);
    setSuggestions(defaultSuggestions);
  }

  function deleteConversation(id: number) {
    startTransition(async () => {
      const result = await deleteChatConversationAction(id);
      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      setConversations((prev) => prev.filter((item) => item.id !== id));
      if (activeId === id) resetToEmpty();
      toast.success('Conversation deleted.');
    });
  }

  function sendMessage(content: string) {
    const trimmed = content.trim();
    if (!trimmed || pending) return;

    const conversationId = activeId;
    setInput('');
    startTransition(async () => {
      const result = await sendChatMessageAction({
        message: trimmed,
        conversation_id: conversationId ?? undefined,
      });

      if (!result.ok) {
        toast.error(result.message);
        setInput(trimmed);
        return;
      }

      const { conversation_id, user_message, reply } = result.data;
      setActiveId(conversation_id);
      setMessages((prev) => {
        if (conversationId == null && prev.length === 0) {
          return [user_message, reply];
        }
        return [...prev, user_message, reply];
      });

      setConversations((prev) => {
        const existing = prev.find((item) => item.id === conversation_id);
        const summary = {
          id: conversation_id,
          title:
            existing?.title ??
            (trimmed.length > 40 ? `${trimmed.slice(0, 40)}…` : trimmed),
          messages_count: (existing?.messages_count ?? 0) + 2,
          last_message_at: reply.created_at,
          last_message_label: 'Just now',
          created_at: existing?.created_at ?? reply.created_at,
        };
        return [summary, ...prev.filter((item) => item.id !== conversation_id)];
      });

      const nextSuggestions = chatMessageSuggestions(reply.meta);
      if (nextSuggestions?.length) setSuggestions(nextSuggestions);
    });
  }

  const displayMessages =
    showEmpty && greeting
      ? [
          {
            id: 0,
            role: 'assistant' as const,
            content: greeting,
            meta: { suggestions },
            created_at: new Date().toISOString(),
          },
        ]
      : messages;

  return {
    conversations,
    suggestions,
    activeId,
    displayMessages,
    input,
    setInput,
    pending,
    bottomRef,
    selectConversation,
    createConversation,
    deleteConversation,
    sendMessage,
  };
}
