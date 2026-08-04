"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
export function OAuthButtons() {
  const router = useRouter();

  function continueWithProvider() {
    router.push("/");
  }

  return (
    <div className="grid grid-cols-2 gap-3 mt-2">
      <Button
        type="button"
        variant="outline"
        className="h-12 gap-2.5 rounded-xl cursor-pointer border-border bg-card px-3 text-sm font-semibold shadow-none hover:bg-muted/60"
        onClick={continueWithProvider}
      >
        <Image src="/google.svg" alt="Google" width={20} height={20} />
        Google
      </Button>

      <Button
        type="button"
        variant="outline"
        className="h-12 gap-2.5 rounded-xl cursor-pointer border-border bg-card px-3 text-sm font-semibold shadow-none hover:bg-muted/60"
        onClick={continueWithProvider}
      >
        <Image src="/apple.svg" alt="Apple" width={20} height={20} />
        Apple
      </Button>
    </div>
  );
}
