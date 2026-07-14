import { Logo } from "@/shared/components/logo";

export function AuthBrandPanel() {
  return (
    <div className="relative hidden h-full min-h-0 overflow-hidden lg:flex lg:w-[48%] lg:shrink-0 lg:flex-col">
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_20%,#3b82f6_0%,transparent_45%),radial-gradient(ellipse_at_80%_70%,#1d4ed8_0%,transparent_40%),linear-gradient(160deg,#0b1f4a_0%,#123a8c_45%,#1e40af_100%)]"
        aria-hidden
      />
      <div
        className="absolute inset-0 opacity-[0.1]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.4) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
        aria-hidden
      />

      <div className="relative z-10 flex flex-1 flex-col justify-between p-10 xl:p-14">
        <Logo size="lg" variant="onDark" href={null} />

        <div className="max-w-lg space-y-5">
          <h1 className="text-3xl font-bold tracking-tight text-white xl:text-[2.75rem] xl:leading-tight">
            Trade smarter with AI signals
          </h1>
          <p className="max-w-md text-base leading-relaxed text-white/75 xl:text-lg">
            Monitor markets, act on confidence-scored signals, and manage your
            portfolio in one focused workspace.
          </p>

          <svg
            viewBox="0 0 420 140"
            className="mt-8 w-full max-w-md text-white/90"
            aria-hidden
          >
            <defs>
              <linearGradient id="authChartFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#34d399" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M0 100 L35 92 L70 98 L105 78 L140 84 L175 60 L210 68 L245 42 L280 50 L315 28 L350 36 L385 18 L420 24 L420 140 L0 140 Z"
              fill="url(#authChartFill)"
            />
            <path
              d="M0 100 L35 92 L70 98 L105 78 L140 84 L175 60 L210 68 L245 42 L280 50 L315 28 L350 36 L385 18 L420 24"
              fill="none"
              stroke="#34d399"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <p className="text-sm text-white/50">
          Trusted by traders who want clarity before every move.
        </p>
      </div>
    </div>
  );
}
