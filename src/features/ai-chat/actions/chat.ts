'use server';

import type { ApiSuccessResponse } from '@/features/auth/types';
import { requireAuth } from '@/features/auth/session';
import type {
  ChatConversation,
  ChatListData,
  ChatSuggestionsData,
  SendChatMessageData,
  SendChatMessageInput,
} from '@/features/ai-chat/types';
import { api, mapActionError, type ActionResult } from '@/shared/lib/api';

export async function getChatListAction(input?: {
  per_page?: number;
  page?: number;
}): Promise<ActionResult<ChatListData>> {
  try {
    const token = await requireAuth();
    const response = await api.get<ApiSuccessResponse<ChatListData>>(
      '/user/chat',
      {
        token,
        query: {
          per_page: input?.per_page ?? 20,
          page: input?.page,
        },
      },
    );
    return { ok: true, data: response.data };
  } catch (error) {
    return mapActionError(error, 'Failed to load conversations.');
  }
}

export async function getChatSuggestionsAction(): Promise<
  ActionResult<ChatSuggestionsData>
> {
  try {
    const token = await requireAuth();
    const response = await api.get<ApiSuccessResponse<ChatSuggestionsData>>(
      '/user/chat/suggestions',
      { token },
    );
    return { ok: true, data: response.data };
  } catch (error) {
    return mapActionError(error, 'Failed to load chat suggestions.');
  }
}

export async function getChatConversationAction(
  id: number,
): Promise<ActionResult<ChatConversation>> {
  try {
    const token = await requireAuth();
    const response = await api.get<ApiSuccessResponse<ChatConversation>>(
      `/user/chat/${id}`,
      { token },
    );
    return { ok: true, data: response.data };
  } catch (error) {
    return mapActionError(error, 'Failed to load conversation.');
  }
}

export async function createChatConversationAction(): Promise<
  ActionResult<ChatConversation>
> {
  try {
    const token = await requireAuth();
    const response = await api.post<ApiSuccessResponse<ChatConversation>>(
      '/user/chat',
      undefined,
      { token },
    );
    return { ok: true, data: response.data };
  } catch (error) {
    return mapActionError(error, 'Failed to start conversation.');
  }
}

export async function sendChatMessageAction(
  input: SendChatMessageInput,
): Promise<ActionResult<SendChatMessageData>> {
  const message = input.message.trim();
  if (!message) {
    return { ok: false, message: 'Enter a message.' };
  }
  if (message.length > 2000) {
    return { ok: false, message: 'Message must be 2000 characters or fewer.' };
  }

  try {
    const token = await requireAuth();
    const response = await api.post<ApiSuccessResponse<SendChatMessageData>>(
      '/user/chat/send',
      {
        message,
        conversation_id: input.conversation_id,
      },
      { token },
    );
    return { ok: true, data: response.data };
  } catch (error) {
    return mapActionError(error, 'Failed to send message.');
  }
}

export async function deleteChatConversationAction(
  id: number,
): Promise<ActionResult<null>> {
  try {
    const token = await requireAuth();
    await api.delete<ApiSuccessResponse<null>>(`/user/chat/${id}`, undefined, {
      token,
    });
    return { ok: true, data: null };
  } catch (error) {
    return mapActionError(error, 'Failed to delete conversation.');
  }
}
