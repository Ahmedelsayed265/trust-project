import { cache } from 'react';
import { api } from '@/shared/lib/api';
import { requireAuth } from '@/features/auth/session';
import type { ProfileApiResponse, UserProfile } from '@/features/auth/types';

export const getCurrentUser = cache(async (): Promise<UserProfile> => {
  const token = await requireAuth();
  const response = await api.get<ProfileApiResponse>('/user/profile', {
    token,
  });
  return response.data;
});
