"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";

export function OAuthButtons() {
  return (
    <div className="grid grid-cols-2 gap-3 mt-2">
      <Button
        type="button"
        variant="outline"
        className="h-12 gap-2.5 rounded-xl cursor-pointer border-border bg-card px-3 text-sm font-semibold shadow-none hover:bg-muted/60"
      >
        <Image src="/google.svg" alt="Google" width={20} height={20} />
        Google
      </Button>

      <Button
        type="button"
        variant="outline"
        className="h-12 gap-2.5 rounded-xl cursor-pointer border-border bg-card px-3 text-sm font-semibold shadow-none hover:bg-muted/60"
      >
        <Image src="/apple.svg" alt="Apple" width={20} height={20} />
        Apple
      </Button>
    </div>
  );
}
