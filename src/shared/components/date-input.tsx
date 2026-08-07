'use client';

import { useState } from 'react';
import { format, isValid, parse, subYears } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

type DateInputProps = {
  id?: string;
  value?: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
  className?: string;
  /** Restrict to adults (18+). Useful for date of birth. */
  adultOnly?: boolean;
};

function parseValue(value?: string) {
  if (!value) return undefined;
  const date = parse(value, 'yyyy-MM-dd', new Date());
  return isValid(date) ? date : undefined;
}

export function DateInput({
  id,
  value,
  onChange,
  onBlur,
  placeholder = 'Pick a date',
  disabled,
  invalid,
  className,
  adultOnly = false,
}: DateInputProps) {
  const [open, setOpen] = useState(false);
  const selected = parseValue(value);
  const maxDate = adultOnly ? subYears(new Date(), 18) : new Date();
  const minDate = new Date(1900, 0, 1);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            id={id}
            type="button"
            variant="outline"
            disabled={disabled}
            aria-invalid={invalid || undefined}
            data-empty={!selected}
            onBlur={onBlur}
            className={cn(
              'bg-background h-12 w-full min-w-0 justify-between rounded-xl px-2.5 font-normal',
              'data-[empty=true]:text-muted-foreground',
              className,
            )}
          />
        }
      >
        <span className="truncate">
          {selected ? format(selected, 'PPP') : placeholder}
        </span>
        <CalendarIcon className="text-muted-foreground size-4 shrink-0" />
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto overflow-hidden p-0">
        <Calendar
          mode="single"
          captionLayout="dropdown"
          selected={selected}
          defaultMonth={selected ?? maxDate}
          startMonth={minDate}
          endMonth={maxDate}
          disabled={[{ before: minDate }, { after: maxDate }]}
          onSelect={(date) => {
            onChange(date ? format(date, 'yyyy-MM-dd') : '');
            setOpen(false);
          }}
        />
        <div className="border-border flex items-center justify-between border-t px-3 py-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-primary h-7 px-2"
            onClick={() => {
              onChange('');
              setOpen(false);
            }}
          >
            Clear
          </Button>
          {!adultOnly ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-primary h-7 px-2"
              onClick={() => {
                onChange(format(new Date(), 'yyyy-MM-dd'));
                setOpen(false);
              }}
            >
              Today
            </Button>
          ) : null}
        </div>
      </PopoverContent>
    </Popover>
  );
}
