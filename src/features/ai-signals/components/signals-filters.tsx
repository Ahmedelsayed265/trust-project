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
  return (
    <Card>
      <CardContent className="grid gap-3 pt-4 sm:grid-cols-2 lg:grid-cols-4">
        <Field>
          <FieldLabel htmlFor="signal-status">Status</FieldLabel>
          <FieldContent>
            <Select
              value={status}
              onValueChange={(value) => {
                if (value) onStatusChange(value as SignalStatus);
              }}
              items={[...STATUS_OPTIONS]}
            >
              <SelectTrigger id="signal-status" className={selectTriggerClass}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="start" alignItemWithTrigger={false}>
                {STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="signal-side">Side</FieldLabel>
          <FieldContent>
            <Select
              value={side}
              onValueChange={(value) => {
                if (value) onSideChange(value as 'all' | SignalSide);
              }}
              items={[...SIDE_OPTIONS]}
            >
              <SelectTrigger id="signal-side" className={selectTriggerClass}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="start" alignItemWithTrigger={false}>
                {SIDE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="signal-strength">Strength</FieldLabel>
          <FieldContent>
            <Select
              value={strength}
              onValueChange={(value) => {
                if (value) onStrengthChange(value as 'all' | SignalStrength);
              }}
              items={[...STRENGTH_OPTIONS]}
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
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FieldContent>
        </Field>

        <form onSubmit={onSymbolSubmit}>
          <Field>
            <FieldLabel htmlFor="signal-symbol">Symbol</FieldLabel>
            <FieldContent className="flex flex-row items-center gap-2">
              <Input
                id="signal-symbol"
                value={symbolDraft}
                onChange={(event) => onSymbolDraftChange(event.target.value)}
                placeholder="BTCUSDT"
                className="h-10 min-w-0 flex-1 rounded-md"
              />
              <Button
                type="submit"
                variant="outline"
                size="icon"
                className="size-10 shrink-0 rounded-md"
                aria-label="Filter by symbol"
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
