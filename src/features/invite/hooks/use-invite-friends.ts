'use client';

import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { inviteByEmailAction } from '@/features/invite/actions/referrals';
import type { ReferralInvite, ReferralStats } from '@/features/invite/types';

type UseInviteFriendsArgs = {
  initialInvites: ReferralInvite[];
  initialStats: ReferralStats;
};

export function useInviteFriends({
  initialInvites,
  initialStats,
}: UseInviteFriendsArgs) {
  const [copied, setCopied] = useState<'code' | 'link' | null>(null);
  const [invites, setInvites] = useState(initialInvites);
  const [stats, setStats] = useState(initialStats);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [pending, startTransition] = useTransition();

  async function copyValue(value: string, type: 'code' | 'link') {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(type);
      window.setTimeout(() => setCopied(null), 1600);
    } catch {
      toast.error('Could not copy to clipboard.');
    }
  }

  function submitInvite(e: React.FormEvent) {
    e.preventDefault();
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      toast.error('Enter an email address.');
      return;
    }

    startTransition(async () => {
      const result = await inviteByEmailAction({
        email: trimmedEmail,
        name: name.trim() || undefined,
      });

      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      setInvites((prev) => [
        result.data,
        ...prev.filter((i) => i.id !== result.data.id),
      ]);
      setStats((prev) => ({
        ...prev,
        invites_sent: prev.invites_sent + 1,
      }));
      setEmail('');
      setName('');
      toast.success('Invitation sent.');
    });
  }

  return {
    copied,
    invites,
    stats,
    email,
    name,
    pending,
    setEmail,
    setName,
    copyValue,
    submitInvite,
  };
}
