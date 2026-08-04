export function getApiBaseUrl() {
  const base =
    process.env.API_URL ??
    process.env.NEXT_API_URL ??
    process.env.NEXT_PUBLIC_API_URL;

  if (!base) {
    throw new Error(
      "Missing API_URL. Set API_URL=https://admin.trust-ai.cloud/api in .env"
    );
  }

  return base.replace(/\/$/, "");
}
