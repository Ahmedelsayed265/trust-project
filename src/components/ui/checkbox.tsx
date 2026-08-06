'use client';

import { Checkbox as CheckboxPrimitive } from '@base-ui/react/checkbox';

import { cn } from '@/lib/utils';
import { CheckIcon } from 'lucide-react';

function Checkbox({ className, ...props }: CheckboxPrimitive.Root.Props) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        'peer bg-background focus-visible:border-ring aria-invalid:border-destructive aria-invalid:aria-checked:border-primary dark:border-input dark:bg-input/30 dark:aria-invalid:border-destructive data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground dark:data-checked:bg-primary relative flex size-4 shrink-0 cursor-pointer items-center justify-center rounded-[4px] border border-neutral-300 transition-colors outline-none group-has-disabled/field:opacity-50 after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-0',
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current transition-none [&>svg]:size-3.5"
      >
        <CheckIcon />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
