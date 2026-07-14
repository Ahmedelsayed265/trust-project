export const routes = {
  home: "/",
  markets: "/markets",
  trades: "/trades",
  orders: "/orders",
  profile: "/profile",
  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",
} as const;

export type AppRoute = (typeof routes)[keyof typeof routes];
