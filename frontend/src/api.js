import { API_URL } from "./config.js";

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}
export async function request(path, options = {}) {
  const { public: isPublic = false, ...fetchOptions } = options;
  const token = localStorage.getItem("studyconnect-token");
  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...fetchOptions,
      headers: {
        "Content-Type": "application/json",
        ...(!isPublic && token ? { Authorization: `Bearer ${token}` } : {}),
        ...fetchOptions.headers,
      },
    });
  } catch (error) {
    if (error.name === "AbortError") throw error;
    throw new ApiError(
      "Unable to reach StudyConnect. Check your connection and try again.",
      0,
    );
  }
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload.success === false) {
    if (response.status === 401 && !isPublic && token)
      window.dispatchEvent(new Event("studyconnect:expired"));
    throw new ApiError(
      Array.isArray(payload.message)
        ? payload.message.join(" ")
        : payload.message || "This request could not be completed.",
      response.status,
    );
  }
  return payload.data ?? payload;
}
const post = (path, body, isPublic = false) =>
  request(path, {
    method: "POST",
    body: JSON.stringify(body),
    public: isPublic,
  });
const patch = (path, body = {}) =>
  request(path, { method: "PATCH", body: JSON.stringify(body) });
export const api = {
  register: (body) => post("/auth/register", body, true),
  verifyRegistration: (body) => post("/auth/verify-otp", body, true),
  resendRegistrationOtp: (body) => post("/auth/resend-otp", body, true),
  login: ({ email, password } = {}) =>
    post("/auth/login", { email, password }, true),
  forgotPassword: (body) => post("/auth/forgot-password", body, true),
  resendPasswordOtp: (body) => post("/auth/forgot-password/resend", body, true),
  verifyPasswordOtp: (body) => post("/auth/forgot-password/verify", body, true),
  resetPassword: (body) => post("/auth/reset-password", body, true),
  me: () => request("/auth/me"),
  updateProfile: (body) => patch("/users/profile/me", body),
  tutors: (course) =>
    request(
      `/users?role=TUTOR${course ? `&courseToTeach=${encodeURIComponent(course)}` : ""}`,
    ),
  learners: () => request("/users?role=LEARNER"),
  user: (id) => request(`/users/${encodeURIComponent(id)}`),
  sessions: () => request("/tutoring/my-sessions"),
  session: (id) => request(`/tutoring/${encodeURIComponent(id)}`),
  book: (body) => post("/tutoring/book", body),
  updateSession: (id, status) =>
    patch(`/tutoring/${encodeURIComponent(id)}/status`, { status }),
  openGroups: () => request("/tutoring/group/open"),
  joinGroup: (id) => post(`/tutoring/${encodeURIComponent(id)}/join`, {}),
  materials: () => request("/materials"),
  uploadMaterial: (body) => post("/materials", body),
  downloadMaterial: (id) =>
    post(`/materials/${encodeURIComponent(id)}/download`, {}),
  courses: () => request("/courses"),
  partners: () => request("/partners/my-partners"),
  match: (body) => post("/partners/match", body),
  reshuffle: (id, reason) =>
    post(`/partners/${encodeURIComponent(id)}/reshuffle`, { reason }),
  notifications: () => request("/notifications"),
  unread: () => request("/notifications/unread-count"),
  readNotification: (id) =>
    patch(`/notifications/${encodeURIComponent(id)}/read`),
  readAllNotifications: () => patch("/notifications/read-all"),
  reviews: (id) => request(`/reviews/tutor/${encodeURIComponent(id)}`),
  review: (body) => post("/reviews", body),
};
