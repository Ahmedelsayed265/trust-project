import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type SubmitButtonProps = {
  loading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
};

export function SubmitButton({
  loading = false,
  loadingText,
  children,
  className,
  disabled,
}: SubmitButtonProps) {
  return (
    <Button
      type="submit"
      disabled={disabled || loading}
      className={cn(
        'h-12 w-full cursor-pointer gap-2 rounded-xl text-sm font-semibold',
        className,
      )}
    >
      {loading && <Loader2 className="size-4 animate-spin" aria-hidden />}
      <span>{loading ? (loadingText ?? children) : children}</span>
    </Button>
  );
}
