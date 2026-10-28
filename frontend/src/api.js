const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

async function request(path, options = {}) {
  const token = localStorage.getItem("studyconnect-token");
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.message || "The request could not be completed.");
  }
  return payload.data ?? payload;
}

export const api = {
  register: (body) => request("/auth/register", { method: "POST", body: JSON.stringify(body) }),
  verifyRegistration: (body) => request("/auth/verify-otp", { method: "POST", body: JSON.stringify(body) }),
  resendRegistrationOtp: (body) => request("/auth/resend-otp", { method: "POST", body: JSON.stringify(body) }),
  login: (body) => request("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  forgotPassword: (body) => request("/auth/forgot-password", { method: "POST", body: JSON.stringify(body) }),
  resendPasswordOtp: (body) => request("/auth/forgot-password/resend", { method: "POST", body: JSON.stringify(body) }),
  verifyPasswordOtp: (body) => request("/auth/forgot-password/verify", { method: "POST", body: JSON.stringify(body) }),
  resetPassword: (body) => request("/auth/reset-password", { method: "POST", body: JSON.stringify(body) }),
  me: () => request("/auth/me"),
  updateProfile: (body) => request("/users/profile/me", { method: "PATCH", body: JSON.stringify(body) }),
  tutors: (course) => request(`/users?role=TUTOR${course ? `&courseToTeach=${encodeURIComponent(course)}` : ""}`),
  sessions: () => request("/tutoring/my-sessions"),
  materials: () => request("/materials"),
  uploadMaterial: (body) => request("/materials", { method: "POST", body: JSON.stringify(body) }),
  courses: () => request("/courses"),
};
