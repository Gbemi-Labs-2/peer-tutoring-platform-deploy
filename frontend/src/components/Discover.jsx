import { useState } from "react";
import { api, request } from "../api.js";
import { displayName } from "../Auth.js";
import { Avatar, Empty, Heading, LoadState, Tags, useResource } from "./ui.jsx";

export function Directory({ user, learners = false, onProfile, onBook }) {
  const resource = useResource(
    async () =>
      learners
        ? api.learners()
        : [...(await api.tutors()), ...(await request("/users?role=BOTH"))],
    learners,
  );
  const [search, setSearch] = useState(""),
    [department, setDepartment] = useState(""),
    [course, setCourse] = useState("");
  const people = (resource.data || []).filter((p) => p.id !== user.id);
  const rows = people.filter(
    (p) =>
      (!department || p.department === department) &&
      (!course ||
        (learners ? p.coursesNeedingHelp : p.coursesToTeach)?.includes(
          course,
        )) &&
      `${displayName(p)} ${p.department || ""} ${(p.coursesToTeach || []).join(" ")} ${(p.coursesNeedingHelp || []).join(" ")}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  return (
    <>
      <Heading
        eyebrow="DISCOVER YOUR COMMUNITY"
        title={
          learners
            ? "Make a difference. Share what you know."
            : "A little support. A big step forward."
        }
        description={
          learners
            ? "Find students looking for support in courses you know."
            : "Connect with peer tutors who understand your courses."
        }
      />
      <section className="filter-bar" aria-label="Directory filters">
        <label className="search-field">
          Search {learners ? "learners" : "tutors"}
          <input
            type="search"
            placeholder="Name, course, or department"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
        <label>
          Department
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          >
            <option value="">All departments</option>
            {[...new Set(people.map((p) => p.department).filter(Boolean))]
              .sort()
              .map((d) => (
                <option key={d}>{d}</option>
              ))}
          </select>
        </label>
        <label>
          Course
          <select value={course} onChange={(e) => setCourse(e.target.value)}>
            <option value="">All courses</option>
            {[
              ...new Set(
                people.flatMap(
                  (p) =>
                    (learners ? p.coursesNeedingHelp : p.coursesToTeach) || [],
                ),
              ),
            ]
              .sort()
              .map((c) => (
                <option key={c}>{c}</option>
              ))}
          </select>
        </label>
      </section>
      <LoadState resource={resource}>
        <p className="results-count">
          {rows.length} {learners ? "learner" : "tutor"}
          {rows.length === 1 ? "" : "s"} found
        </p>
        <div className="card-grid">
          {rows.map((p) => (
            <article key={p.id} className="person-card">
              <div className="person-card-top">
                <Avatar user={p} large />
                {p.isVerified && (
                  <span className="verified">Email verified</span>
                )}
              </div>
              <h2>{displayName(p)}</h2>
              <p>
                {p.department || "Department not provided"}
                {p.level ? ` · ${p.level.replace(/ Level$/i, "")} Level` : ""}
              </p>
              <p className="bio">
                {p.bio ||
                  (learners
                    ? "Looking to learn with the campus community."
                    : "Explore their profile to learn more about their teaching.")}
              </p>
              <Tags
                values={
                  (learners ? p.coursesNeedingHelp : p.coursesToTeach) || []
                }
              />
              {!learners && (
                <p className="rating">
                  {p.reviewCount
                    ? `★ ${Number(p.rating).toFixed(1)} · ${p.reviewCount} reviews`
                    : "No reviews yet"}
                  <span>Availability not listed</span>
                </p>
              )}
              <div className="button-row">
                <button
                  className="button secondary"
                  onClick={() => onProfile(p.id)}
                >
                  View profile
                </button>
                {!learners && (
                  <button className="button primary" onClick={() => onBook(p)}>
                    Request session
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
        {!rows.length && (
          <Empty
            title={
              search || department || course
                ? "No matches for these filters"
                : "Your community is growing"
            }
            action={
              (search || department || course) && (
                <button
                  className="button secondary"
                  onClick={() => {
                    setSearch("");
                    setDepartment("");
                    setCourse("");
                  }}
                >
                  Clear filters
                </button>
              )
            }
          >
            {search || department || course
              ? "Try another course or a broader search."
              : "Profiles will appear here when students join. You can update your own courses in your profile."}
          </Empty>
        )}
      </LoadState>
    </>
  );
}
export function TutorProfile({ id, user, onBack, onBook }) {
  const resource = useResource(
    async () => ({
      person: await api.user(id),
      reviews: await api.reviews(id),
    }),
    id,
  );
  const p = resource.data?.person;
  return (
    <>
      <button className="back-button" onClick={onBack}>
        ← Back to discovery
      </button>
      <LoadState resource={resource}>
        {p && (
          <>
            <section className="profile-hero">
              <Avatar user={p} large />
              <div>
                <p className="eyebrow">YOUR CAMPUS COMMUNITY</p>
                <h1>{displayName(p)}</h1>
                <p>
                  {p.department || "Student"} ·{" "}
                  {p.level || "Level not provided"}
                </p>
                {p.isVerified && (
                  <span className="verified">Email verified</span>
                )}
              </div>
              {p.id !== user.id && ["TUTOR", "BOTH"].includes(p.role) && (
                <button className="button primary" onClick={() => onBook(p)}>
                  Request a session
                </button>
              )}
            </section>
            <div className="detail-grid">
              <section className="panel">
                <h2>Meet {p.firstName || "your peer"}</h2>
                <p>{p.bio || "This student hasn’t added a bio yet."}</p>
                <h3>Courses they teach</h3>
                <Tags values={p.coursesToTeach} />
                {!p.coursesToTeach?.length && (
                  <p>No teaching courses listed.</p>
                )}
                <h3>Learning interests</h3>
                <Tags values={p.coursesNeedingHelp} />
                <p className="subtle">
                  Availability is not published. Agree on a time before meeting.
                </p>
              </section>
              <section className="panel">
                <h2>Student reviews</h2>
                <p className="rating">
                  {p.reviewCount
                    ? `★ ${Number(p.rating).toFixed(1)} from ${p.reviewCount} reviews`
                    : "No ratings yet"}
                </p>
                {resource.data.reviews.length ? (
                  resource.data.reviews.map((r) => (
                    <article className="review" key={r.id}>
                      <strong>{r.rating} / 5</strong>
                      <p>{r.comment || "No written feedback."}</p>
                    </article>
                  ))
                ) : (
                  <Empty title="A fresh start">
                    Reviews from completed sessions will appear here.
                  </Empty>
                )}
              </section>
            </div>
          </>
        )}
      </LoadState>
    </>
  );
}
