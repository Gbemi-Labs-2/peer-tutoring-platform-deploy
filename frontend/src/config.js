// Accept either an origin or the documented versioned API URL, without duplicating the prefix.
export function normalizeApiUrl(value = "http://localhost:3000/api/v1") {
  const configured = value.replace(/\/+$/, "");
  return /\/api\/v1$/.test(configured) ? configured : `${configured}/api/v1`;
}
export const API_URL = normalizeApiUrl(
  import.meta.env?.VITE_API_URL || undefined,
);
