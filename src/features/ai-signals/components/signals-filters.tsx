'use client';

import { useTranslations } from 'next-intl';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Field, FieldContent, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  SIDE_OPTIONS,
  STATUS_OPTIONS,
  STRENGTH_OPTIONS,
} from '@/features/ai-signals/lib/signal-display';
import type {
  SignalSide,
  SignalStatus,
  SignalStrength,
} from '@/features/ai-signals/types';

const selectTriggerClass =
  'h-10 w-full min-w-0 rounded-md data-[size=default]:h-10';

type SignalsFiltersProps = {
  status: SignalStatus;
  side: 'all' | SignalSide;
  strength: 'all' | SignalStrength;
  symbolDraft: string;
  onStatusChange: (value: SignalStatus) => void;
  onSideChange: (value: 'all' | SignalSide) => void;
  onStrengthChange: (value: 'all' | SignalStrength) => void;
  onSymbolDraftChange: (value: string) => void;
  onSymbolSubmit: (event: React.FormEvent) => void;
};

export function SignalsFilters({
  status,
  side,
  strength,
  symbolDraft,
  onStatusChange,
  onSideChange,
  onStrengthChange,
  onSymbolDraftChange,
  onSymbolSubmit,
}: SignalsFiltersProps) {
  const t = useTranslations('AiSignals');
  const tCommon = useTranslations('Common');

  const statusLabels: Record<(typeof STATUS_OPTIONS)[number]['value'], string> =
    {
      active: t('statusActive'),
      closed: t('statusClosed'),
      expired: t('statusExpired'),
      all: t('statusAll'),
    };

  const sideLabels: Record<(typeof SIDE_OPTIONS)[number]['value'], string> = {
    all: t('sideAll'),
    buy: t('sideBuy'),
    sell: t('sideSell'),
  };

  const strengthLabels: Record<
    (typeof STRENGTH_OPTIONS)[number]['value'],
    string
  > = {
    all: t('strengthAll'),
    strong: t('strengthStrong'),
    moderate: t('strengthModerate'),
    watch: t('strengthWatch'),
  };

  const statusItems = STATUS_OPTIONS.map((option) => ({
    value: option.value,
    label: statusLabels[option.value],
  }));
  const sideItems = SIDE_OPTIONS.map((option) => ({
    value: option.value,
    label: sideLabels[option.value],
  }));
  const strengthItems = STRENGTH_OPTIONS.map((option) => ({
    value: option.value,
    label: strengthLabels[option.value],
  }));

  return (
    <Card>
      <CardContent className="grid gap-3 pt-4 sm:grid-cols-2 lg:grid-cols-4">
        <Field>
          <FieldLabel htmlFor="signal-status">{t('status')}</FieldLabel>
          <FieldContent>
            <Select
              value={status}
              onValueChange={(value) => {
                if (value) onStatusChange(value as SignalStatus);
              }}
              items={statusItems}
            >
              <SelectTrigger id="signal-status" className={selectTriggerClass}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="start" alignItemWithTrigger={false}>
                {STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {statusLabels[option.value]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="signal-side">{tCommon('side')}</FieldLabel>
          <FieldContent>
            <Select
              value={side}
              onValueChange={(value) => {
                if (value) onSideChange(value as 'all' | SignalSide);
              }}
              items={sideItems}
            >
              <SelectTrigger id="signal-side" className={selectTriggerClass}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="start" alignItemWithTrigger={false}>
                {SIDE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {sideLabels[option.value]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="signal-strength">{t('strength')}</FieldLabel>
          <FieldContent>
            <Select
              value={strength}
              onValueChange={(value) => {
                if (value) onStrengthChange(value as 'all' | SignalStrength);
              }}
              items={strengthItems}
            >
              <SelectTrigger
                id="signal-strength"
                className={selectTriggerClass}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="start" alignItemWithTrigger={false}>
                {STRENGTH_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {strengthLabels[option.value]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FieldContent>
        </Field>

        <form onSubmit={onSymbolSubmit}>
          <Field>
            <FieldLabel htmlFor="signal-symbol">{t('symbol')}</FieldLabel>
            <FieldContent className="flex flex-row items-center gap-2">
              <Input
                id="signal-symbol"
                value={symbolDraft}
                onChange={(event) => onSymbolDraftChange(event.target.value)}
                placeholder={t('symbolPlaceholder')}
                className="h-10 min-w-0 flex-1 rounded-md"
              />
              <Button
                type="submit"
                variant="outline"
                size="icon"
                className="size-10 shrink-0 rounded-md"
                aria-label={t('filterBySymbol')}
              >
                <Search className="size-4" />
              </Button>
            </FieldContent>
          </Field>
        </form>
      </CardContent>
    </Card>
  );
}
