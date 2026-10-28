import {
  BookOpen01Icon,
  Calendar03Icon,
  Search01Icon,
  UserGroupIcon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import { api } from "../api.js";
import { firstName, greeting } from "../Auth.js";
import SafetyGuidance from "../SafetyGuidance.jsx";
import {
  Empty,
  Heading,
  Icon,
  LoadState,
  dateTime,
  useResource,
} from "./ui.jsx";
import { SessionCard } from "./Learning.jsx";
export default function Dashboard({ user, navigate, onSession }) {
  const sessions = useResource(() => api.sessions()),
    notifications = useResource(() => api.notifications());
  const upcoming = (sessions.data || [])
    .filter(
      (s) =>
        !["COMPLETED", "CANCELLED"].includes(s.status) &&
        new Date(s.scheduledAt) >= new Date(),
    )
    .sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt));
  return (
    <>
      <Heading
        eyebrow="YOUR LEARNING, CONNECTED"
        title={`${greeting()}, ${firstName(user)}.`}
        description="Every small step brings you closer. What will you learn today?"
      />
      <section className="welcome-banner">
        <div>
          <span className="banner-label">BETTER TOGETHER</span>
          <h2>
            Your next breakthrough
            <br />
            starts with a connection.
          </h2>
          <p>
            Find a peer who gets it. Turn a tricky topic into a little more
            confidence.
          </p>
          <button
            className="button white"
            onClick={() => navigate("Find Tutor")}
          >
            Find your peer tutor <Icon icon={ArrowRight01Icon} size={18} />
          </button>
        </div>
        <div className="banner-art" aria-hidden="true">
          <span className="orbit orbit-one" />
          <span className="orbit orbit-two" />
          <div className="art-book">
            <Icon icon={BookOpen01Icon} size={66} />
          </div>
          <div className="art-star">✦</div>
          <div className="art-note">Learn. Share. Grow.</div>
        </div>
      </section>
      <section className="quick-grid" aria-label="Quick actions">
        {[
          ["Find Tutor", Search01Icon, "Find a tutor", "Get unstuck, together"],
          [
            "Find Study Partner",
            UserGroupIcon,
            "Study partners",
            "Find your study rhythm",
          ],
          [
            "My Sessions",
            Calendar03Icon,
            "Your sessions",
            "Make time for progress",
          ],
          [
            "Course Materials",
            BookOpen01Icon,
            "Explore resources",
            "Knowledge worth sharing",
          ],
        ].map(([view, icon, title, text]) => (
          <button
            className="quick-card"
            key={view}
            onClick={() => navigate(view)}
          >
            <span className="quick-icon">
              <Icon icon={icon} size={23} />
            </span>
            <strong>{title}</strong>
            <span>{text}</span>
            <span className="quick-arrow">
              <Icon icon={ArrowRight01Icon} size={18} />
            </span>
          </button>
        ))}
      </section>
      <div className="dashboard-columns">
        <section>
          <div className="section-heading">
            <h2>Coming up next</h2>
            <button
              className="text-button"
              onClick={() => navigate("My Sessions")}
            >
              All sessions →
            </button>
          </div>
          <LoadState resource={sessions}>
            <div className="stack">
              {upcoming.slice(0, 3).map((s) => (
                <SessionCard key={s.id} session={s} onOpen={onSession} />
              ))}
            </div>
            {!upcoming.length && (
              <div className="panel">
                <Empty
                  title="Your next chapter is unwritten"
                  action={
                    <button
                      className="button secondary"
                      onClick={() => navigate("Find Tutor")}
                    >
                      Find a tutor
                    </button>
                  }
                >
                  Book a session with a peer tutor. Your upcoming plans will be
                  right here.
                </Empty>
              </div>
            )}
          </LoadState>
        </section>
        <section>
          <div className="section-heading">
            <h2>Your activity</h2>
            <button
              className="text-button"
              onClick={() => navigate("Notifications")}
            >
              View all →
            </button>
          </div>
          <div className="panel activity-panel">
            <LoadState resource={notifications}>
              {notifications.data?.length ? (
                notifications.data.slice(0, 4).map((n) => (
                  <article className="activity-item" key={n.id}>
                    <span
                      className={`activity-dot ${n.isRead ? "read" : ""}`}
                    />
                    <div>
                      <strong>{n.title}</strong>
                      <p>{n.message}</p>
                      <small>{dateTime(n.createdAt)}</small>
                    </div>
                  </article>
                ))
              ) : (
                <Empty title="A fresh page">
                  Your real notifications and learning updates will appear here
                  as they arrive.
                </Empty>
              )}
            </LoadState>
          </div>
        </section>
      </div>
      <SafetyGuidance />
    </>
  );
}
