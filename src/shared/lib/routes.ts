export const routes = {
  home: "/",
  markets: "/markets",
  trades: "/trades",
  orders: "/orders",
  portfolio: "/portfolio",
  wallet: "/wallet",
  aiSignals: "/ai-signals",
  watchlist: "/watchlist",
  news: "/news",
  calendar: "/calendar",
  profile: "/profile",
  plans: "/profile/plans",
  settings: "/settings",
  help: "/help",
  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",
} as const;

export type AppRoute = (typeof routes)[keyof typeof routes];
