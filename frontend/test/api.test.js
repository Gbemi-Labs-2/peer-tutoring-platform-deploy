import { afterEach, test } from "node:test";
import assert from "node:assert/strict";
import { api } from "../src/api.js";
import { loginUser, registerUser, verifyOtp } from "../src/Auth.js";
import { normalizeApiUrl } from "../src/config.js";

const original = {
  fetch: globalThis.fetch,
  window: globalThis.window,
  localStorage: globalThis.localStorage,
};
afterEach(() => {
  Object.assign(globalThis, original);
});
function setup(handler) {
  const storage = new Map();
  globalThis.localStorage = {
    getItem: (k) => storage.get(k) ?? null,
    setItem: (k, v) => storage.set(k, v),
    removeItem: (k) => storage.delete(k),
  };
  globalThis.window = new EventTarget();
  globalThis.fetch = handler;
  return storage;
}
const reply = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });

test("API origins and versioned URLs produce a single version prefix", () => {
  assert.equal(
    normalizeApiUrl("https://api.example.test/"),
    "https://api.example.test/api/v1",
  );
  assert.equal(
    normalizeApiUrl("https://api.example.test/api/v1///"),
    "https://api.example.test/api/v1",
  );
});
test("public login omits stale auth and returns the real user", async () => {
  const storage = setup(async (url, options) => {
    assert.equal(url, "http://localhost:3000/api/v1/auth/login");
    assert.equal(options.headers.Authorization, undefined);
    assert.deepEqual(JSON.parse(options.body), {
      email: "ada@example.test",
      password: "password",
    });
    return reply({
      data: { accessToken: "test-token", user: { id: "test-user" } },
    });
  });
  storage.set("studyconnect-token", "stale");
  assert.equal(
    (await api.login({ email: "ada@example.test", password: "password" })).user
      .id,
    "test-user",
  );
});
test("protected requests send the current token and unwrap response data", async () => {
  const storage = setup(async (url, options) => {
    assert.equal(options.headers.Authorization, "Bearer current");
    return reply({ data: [] });
  });
  storage.set("studyconnect-token", "current");
  assert.deepEqual(await api.sessions(), []);
});
test("array validation errors are readable", async () => {
  setup(async () =>
    reply({ message: ["Choose a course.", "Choose a future time."] }, 400),
  );
  await assert.rejects(api.book({}), {
    message: "Choose a course. Choose a future time.",
    status: 400,
  });
});
test("invalid login does not expire an existing session", async () => {
  const storage = setup(async () =>
    reply({ message: "Invalid email or password" }, 401),
  );
  storage.set("studyconnect-token", "current");
  let expired = false;
  window.addEventListener("studyconnect:expired", () => {
    expired = true;
  });
  await assert.rejects(api.login({}));
  assert.equal(expired, false);
});
test("protected 401 emits session expiry; service outages do not", async () => {
  const storage = setup(async () => reply({ message: "Expired" }, 401));
  storage.set("studyconnect-token", "current");
  let count = 0;
  window.addEventListener("studyconnect:expired", () => count++);
  await assert.rejects(api.me());
  assert.equal(count, 1);
  globalThis.fetch = async () => {
    throw new TypeError("Failed to fetch");
  };
  await assert.rejects(api.me(), { status: 0 });
  assert.equal(count, 1);
  assert.equal(storage.get("studyconnect-token"), "current");
});
test("legacy registration helper uses accepted backend name fields", async () => {
  setup(async (url, options) => {
    const body = JSON.parse(options.body);
    assert.equal(body.firstName, "Ada");
    assert.equal(body.lastName, "Lovelace");
    assert.equal(body.name, undefined);
    return reply({ data: { email: body.email } });
  });
  await registerUser({
    name: "Ada Lovelace",
    email: "ada@example.test",
    password: "password",
    role: "LEARNER",
  });
});
test("legacy OTP helper sends code without the forbidden otp field", async () => {
  setup(async (url, options) => {
    if (url.endsWith("/auth/me")) return reply({ data: { id: "learner" } });
    assert.deepEqual(JSON.parse(options.body), {
      email: "ada@example.test",
      code: "123456",
    });
    return reply({ data: { accessToken: "verified-token" } });
  });
  assert.equal((await verifyOtp("ada@example.test", "123456")).id, "learner");
});
test("legacy login helper saves the returned token and loads the profile", async () => {
  const storage = setup(async (url) =>
    reply({
      data: url.endsWith("/auth/me")
        ? { id: "learner" }
        : { accessToken: "login-token" },
    }),
  );
  assert.equal((await loginUser("ada@example.test", "password")).id, "learner");
  assert.equal(storage.get("studyconnect-token"), "login-token");
});
