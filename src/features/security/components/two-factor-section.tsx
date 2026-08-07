'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { AuthenticatorAppCard } from '@/features/security/components/authenticator-app-card';
import { DisableTwoFactorSheet } from '@/features/security/components/disable-two-factor-sheet';
import { EnableTwoFactorSheet } from '@/features/security/components/enable-two-factor-sheet';
import { RecoveryCodesSheet } from '@/features/security/components/recovery-codes-sheet';
import { TwoFactorStatusCard } from '@/features/security/components/two-factor-status-card';
import { enableTwoFactorAction } from '@/features/security/actions/two-factor';
import type {
  SecurityOverview,
  TwoFactorEnableData,
} from '@/features/security/types';

export function TwoFactorSection({ data }: { data: SecurityOverview }) {
  const router = useRouter();
  const [enableOpen, setEnableOpen] = useState(false);
  const [disableOpen, setDisableOpen] = useState(false);
  const [setup, setSetup] = useState<TwoFactorEnableData | null>(null);
  const [recoveryCodes, setRecoveryCodes] = useState<string[] | null>(null);
  const [pending, startTransition] = useTransition();

  function startEnable() {
    startTransition(async () => {
      const result = await enableTwoFactorAction();
      if (!result.ok) {
        toast.error(result.message);
        return;
      }
      setSetup(result.data);
      setEnableOpen(true);
    });
  }

  function onToggle(checked: boolean) {
    if (checked) {
      startEnable();
      return;
    }
    setDisableOpen(true);
  }

  return (
    <>
      <TwoFactorStatusCard data={data} pending={pending} onToggle={onToggle} />
      <AuthenticatorAppCard
        data={data}
        pending={pending}
        onEnable={startEnable}
        onDisable={() => setDisableOpen(true)}
      />

      <EnableTwoFactorSheet
        open={enableOpen}
        setup={setup}
        onOpenChange={(open) => {
          setEnableOpen(open);
          if (!open) setSetup(null);
        }}
        onConfirmed={(codes) => {
          setEnableOpen(false);
          setSetup(null);
          setRecoveryCodes(codes);
          router.refresh();
        }}
      />

      <DisableTwoFactorSheet
        open={disableOpen}
        onOpenChange={setDisableOpen}
        onDisabled={() => {
          setDisableOpen(false);
          router.refresh();
        }}
      />

      <RecoveryCodesSheet
        codes={recoveryCodes}
        open={recoveryCodes != null}
        onOpenChange={(open) => {
          if (!open) setRecoveryCodes(null);
        }}
      />
    </>
  );
}
