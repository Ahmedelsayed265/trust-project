# TrustAI

AI-assisted trading dashboard built with **Next.js 16**, **React 19**, **Tailwind 4**, and **Bun**.

Balances and orders are read from connected providers (e.g. Binance Spot / Alpaca). TrustAI does **not** hold an internal custodial wallet.

---

## Getting started

```bash
bun install
cp .env.example .env   # or create .env manually
bun run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment

Create a `.env` file (gitignored):

```bash
API_URL=https://admin.trust-ai.cloud/api
```

Use a **server-only** `API_URL` (not `NEXT_PUBLIC_*`) so the API base stays off the client bundle.

---

## Scripts

| Command                 | Description                                      |
| ----------------------- | ------------------------------------------------ |
| `bun run dev`           | Start Next.js dev server                         |
| `bun run build`         | Production build                                 |
| `bun run start`         | Start production server                          |
| `bun run lint`          | ESLint                                           |
| `bun run format`        | Prettier write                                   |
| `bun run format:check`  | Prettier check (CI / pre-push)                   |
| `bun run test`          | Vitest watch mode                                |
| `bun run test:run`      | Vitest single run                                |
| `bun run test:coverage` | Vitest coverage (requires `@vitest/coverage-v8`) |

### Pre-push hook (Husky)

Before every `git push`, `.husky/pre-push` runs:

```bash
echo "🔍 Running full lint check before push..."
bun run lint
bun run build
echo "✨ Running Prettier format check before push..."
bun run format:check

echo "✅ All checks passed! Pushing..."
```

---

## Project structure

```text
src/
  app/                 # Next.js App Router (auth, main, legal route groups)
  components/ui/       # shadcn/ui primitives
  features/            # Domain features (auth, portfolio, trades, …)
  shared/              # Cross-cutting UI, API, trading providers, layouts
  test/                # Vitest setup
```

**Conventions**

- Feature folders own their components, actions, schemas, and types
- API calls go through **server actions** + `src/shared/lib/api`
- Auth session cookies live in `src/features/auth/session.ts` and `pending-session.ts`
- Trading provider adapters live under `src/shared/trading/`

---

## Security, vulnerabilities, structure & scalability

Snapshot of the project as of the latest internal review. Scores are for **current demo / early integration** state — not a production finance certification.

### Scores

| Area                             | Score        | Verdict                                                   |
| -------------------------------- | ------------ | --------------------------------------------------------- |
| **Security (app design)**        | **5.5 / 10** | Decent early auth patterns, not finance-ready             |
| **Vulnerability posture (deps)** | **4 / 10**   | Known Next CVEs + noisy CLI deps                          |
| **Structure / readability**      | **8 / 10**   | Clear feature folders, easy to navigate                   |
| **Scalability**                  | **6.5 / 10** | Good bones; trading/data layer still demo                 |
| **Safe-side readiness**          | **~45–55%**  | Fine for private/demo; not for real money / public launch |

### How safe are we right now?

**Safe for:** internal demos, UI development, early backend integration.

**Not safe for:** production users, real broker keys, regulated finance, public release.

**Already in good shape**

- HttpOnly auth cookies, `sameSite: 'lax'`, `secure` in production
- API calls mostly via **server actions** (token stays server-side)
- `.env` gitignored
- Feature-based folders (`auth`, `portfolio`, `shared`)

For a **financial** product the bar is higher — several gaps below are real, not theoretical.

---

### Security & vulnerabilities — problems + fixes

#### Critical / high

1. **Next.js `16.2.10` has published CVEs** (SSRF, DoS, middleware/proxy issues, etc.)  
   **Fix:** bump Next (+ `eslint-config-next`) to **≥ 16.2.11**, then re-run `bun audit`.

2. **OTP / auth debug leakage**
   - `console.log` on forgot-password / verify / send-code
   - `forgotPasswordAction` returns `otp` to the client  
     **Fix:** never return OTP to the browser; remove debug logs (or gate behind a server-only debug flag that is off in prod).

3. **Reset code stored in cookie** (`trustai_pending_reset_code`)  
   HttpOnly helps, but a stolen cookie jar still has the code.  
   **Fix:** prefer a short-lived server-side session / encrypted cookie, or re-ask the code on reset submit (API already accepts `email + code`).

4. **Trading is demo-shaped**  
   Auto-connect with `demo` keys; broker secrets in browser state.  
   **Fix:** never store broker secrets in the client; connect via your backend; encrypt at rest; paper vs live hard gates; no auto-demo in production builds.

#### Medium

5. **No `middleware.ts`** — auth is only in `(main)/layout`.  
   **Fix:** add middleware to protect all authenticated routes centrally; keep layout checks as defense-in-depth.

6. **`shadcn` as a runtime dependency**  
   Pulls CLI/MCP stack and most audit noise.  
   **Fix:** move to `devDependencies` or uninstall from app runtime; keep UI components only.

7. **Pending auth token cookie** before email verify  
   A valid token exists before verification completes.  
   **Fix:** ensure backend rejects unverified users for trading endpoints; frontend already blocks dashboard, backend must enforce too.

8. **Tests not in pre-push; coverage script incomplete** (`test:coverage` without coverage package).  
   **Fix:** add `bun run test:run` to Husky; install `@vitest/coverage-v8` or remove the script.

#### Lower (still worth cleaning)

9. `@types/node` jumped to 26 unintentionally — pin back to `^20` if you want stability.
10. `NODE_ENV` in `.env` is unnecessary (Next sets this).
11. Almost no security-focused tests (auth redirects, cookie behavior, action error paths).

---

### Structure / readability — 8/10

**Strengths**

- Clear split: `src/app` (routes) vs `src/features` (domain) vs `src/shared` (cross-cutting)
- Auth actions / schemas / session are separated cleanly
- Portfolio is split into composable components + helpers
- Path alias `@/` is consistent

**Weak spots**

- Some features still mix mock data + live API (markets, notifications, trading)
- Shared trading providers are demo adapters living next to “real” architecture — fine for now, confusing later
- Little shared testing conventions beyond a few sample files

**Fixes**

- Tag demo modules clearly (`providers/demo/` or `DEMO_MODE` flag)
- One pattern per feature: `components/`, `actions/`, `schemas/`, `types/`, `lib/`
- Document “server actions only for API” as a team rule

---

### Scalability — 6.5/10

**Will scale well**

- Feature folders
- Provider capability model for brokers
- Server-side API fetcher

**Will hurt later**

- Client-held trading state without a real BFF
- No middleware / no centralized authz
- Thin test coverage for money paths
- Mock charts/history pretending to be real performance data (portfolio equity curve)

**Fixes**

- Introduce a backend-for-frontend for broker ops
- Real portfolio history endpoint (stop seeded curves in prod)
- Error monitoring (e.g. Sentry), audit logging for auth + trade actions
- CI: lint + test + build + audit on every PR

---

### Safe-side roadmap (priority order)

| Priority | Action                                                         | Impact                           |
| -------- | -------------------------------------------------------------- | -------------------------------- |
| 1        | Upgrade Next to patched version                                | Closes known framework CVEs      |
| 2        | Strip OTP from client + remove auth `console.log`              | Stops secret leakage             |
| 3        | Move `shadcn` out of runtime deps + `bun audit` clean          | Smaller attack surface           |
| 4        | Add auth middleware                                            | Harder to ship unprotected pages |
| 5        | Wire `test:run` into pre-push / CI                             | Catches regressions              |
| 6        | Production trading path (no demo keys in prod)                 | Required before real money       |
| 7        | Expand tests around auth + money formatting + order validation | Confidence for finance           |

---

### Bottom line

- **Readability / structure:** strong for this stage (**8/10**).
- **Security for a critical finance app:** mid (**~5/10**) — good foundations, not launch-safe.
- **We’re ~halfway on the safe side** for demo; for real users/funds, complete the high-priority fixes above first.

---

## Stack

- Next.js App Router + React 19
- Tailwind CSS 4 + shadcn/ui
- Zod + React Hook Form
- Vitest + React Testing Library + happy-dom
- Husky + Prettier + ESLint
- Bun as package manager
