// src/auth.js
// Talks to the StudyConnect backend and keeps the login token.
// If your backend paths or field names differ, change ONLY the ENDPOINTS
// and the payload fields below. Check them in Swagger at http://localhost:3000/docs

const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:3000").replace(/\/$/, "");
const BASE = `${API_URL}/api/v1`;
const TOKEN_KEY = "studyconnect-token";

const ENDPOINTS = {
  register: "/auth/register",
  verifyOtp: "/auth/verify-otp",
  resendOtp: "/auth/resend-otp",
  login: "/auth/login",
  me: "/auth/me",
};

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const saveToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

async function request(path, { method = "GET", body, auth = false } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth) headers.Authorization = `Bearer ${getToken()}`;

  let response;
  try {
    response = await fetch(`${BASE}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error("Cannot reach the server. Check your connection and try again.");
  }

  const json = await response.json().catch(() => ({}));
  if (!response.ok || json.success === false) {
    const message = Array.isArray(json.message) ? json.message.join(", ") : json.message;
    throw new Error(message || "Something went wrong. Please try again.");
  }
  return json.data ?? json;
}

const pickToken = (data) => data?.accessToken || data?.access_token || data?.token;

// Creates the account and makes the backend email a 6-digit code. Does NOT log the user in.
export function registerUser(form) {
  return request(ENDPOINTS.register, {
    method: "POST",
    body: {
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      password: form.password,
      department: form.department.trim(),
      level: form.level,
      matricNumber: form.studentId.trim(),
      role: form.role, // LEARNER or TUTOR
    },
  });
}

// Checks the emailed code. The backend verifies the account and returns the first token.
export async function verifyOtp(email, code) {
  const data = await request(ENDPOINTS.verifyOtp, {
    method: "POST",
    body: { email: email.trim().toLowerCase(), otp: code.trim(), code: code.trim() },
  });
  const token = pickToken(data);
  if (!token) throw new Error("Verification succeeded but no login token was returned.");
  saveToken(token);
  return fetchMe();
}

export function resendOtp(email) {
  return request(ENDPOINTS.resendOtp, { method: "POST", body: { email: email.trim().toLowerCase() } });
}

// Only an existing, verified account gets a token back.
export async function loginUser(email, password) {
  const data = await request(ENDPOINTS.login, {
    method: "POST",
    body: { email: email.trim().toLowerCase(), password },
  });
  const token = pickToken(data);
  if (!token) throw new Error("Login failed. Please check your details.");
  saveToken(token);
  return fetchMe();
}

// Loads the logged-in student's real profile.
export async function fetchMe() {
  const data = await request(ENDPOINTS.me, { auth: true });
  return data.user ?? data;
}

// ---------- helpers used by the screens ----------
export const displayName = (user) =>
  user?.fullName || user?.name || [user?.firstName, user?.lastName].filter(Boolean).join(" ") || user?.email || "Student";

export const firstName = (user) => displayName(user).split(" ")[0];

export const initialsOf = (user) =>
  displayName(user).split(" ").filter(Boolean).slice(0, 2).map((part) => part[0].toUpperCase()).join("");

export const roleLabel = (role) =>
  ({ LEARNER: "Learner", TUTOR: "Tutor", BOTH: "Learner and Tutor", ADMIN: "Admin" })[String(role).toUpperCase()] || "Student";

export const levelLabel = (level) => {
  const match = String(level || "").match(/^(\d+)/);
  return match ? `${match[1]} Level` : level || "";
};

export const greeting = () => {
  const hour = new Date().getHours();
  return hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
};
