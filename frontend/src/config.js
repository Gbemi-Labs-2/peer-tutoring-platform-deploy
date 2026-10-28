// Accept either an origin or the documented versioned API URL, without duplicating the prefix.
export function normalizeApiUrl(value = "/api/v1") {
  const configured = value.trim().replace(/\/+$/, "");
  if (!configured || configured.startsWith("/")) {
    return /\/api\/v1$/.test(configured)
      ? configured
      : `${configured || ""}/api/v1`;
  }
  return /\/api\/v1$/.test(configured) ? configured : `${configured}/api/v1`;
}
export const API_URL = normalizeApiUrl(
  import.meta.env?.VITE_API_URL || undefined,
);
