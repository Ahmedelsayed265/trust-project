'use client';

import { Button } from '@/components/ui/button';
import Image from 'next/image';

export function OAuthButtons() {
  return (
    <div className="mt-2 grid grid-cols-2 gap-3">
      <Button
        type="button"
        variant="outline"
        className="border-border bg-card hover:bg-muted/60 h-12 cursor-pointer gap-2.5 rounded-xl px-3 text-sm font-semibold shadow-none"
      >
        <Image src="/google.svg" alt="Google" width={20} height={20} />
        Google
      </Button>

      <Button
        type="button"
        variant="outline"
        className="border-border bg-card hover:bg-muted/60 h-12 cursor-pointer gap-2.5 rounded-xl px-3 text-sm font-semibold shadow-none"
      >
        <Image src="/apple.svg" alt="Apple" width={20} height={20} />
        Apple
      </Button>
    </div>
  );
}
