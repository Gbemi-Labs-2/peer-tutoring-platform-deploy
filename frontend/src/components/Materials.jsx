import { useState } from "react";
import { BookOpen01Icon } from "@hugeicons/core-free-icons";
import { api } from "../api.js";
import { displayName } from "../Auth.js";
import {
  CourseSelect,
  Dialog,
  Empty,
  Heading,
  Icon,
  LoadState,
  Notice,
  Tags,
  safeUrl,
  useResource,
} from "./ui.jsx";
const types = {
  LECTURE_NOTES: "Lecture notes",
  PAST_QUESTIONS: "Past questions",
  SLIDES: "Slides",
  LAB_REPORT: "Lab report",
  OTHER: "Other",
};
export default function Materials() {
  const resource = useResource(() => api.materials()),
    courses = useResource(() => api.courses());
  const [search, setSearch] = useState(""),
    [course, setCourse] = useState(""),
    [type, setType] = useState(""),
    [show, setShow] = useState(false),
    [busy, setBusy] = useState(null),
    [error, setError] = useState(""),
    [message, setMessage] = useState("");
  const [download, setDownload] = useState(null);
  const rows = (resource.data || []).filter(
    (m) =>
      (!course || m.courseId === course) &&
      (!type || m.materialType === type) &&
      `${m.title} ${m.description || ""} ${m.course?.code || ""}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  const access = async (m) => {
    setBusy(m.id);
    setError("");
    try {
      const result = await api.downloadMaterial(m.id);
      const url = safeUrl(result.fileUrl);
      if (!url)
        throw new Error("This material does not have a valid web link.");
      setDownload({ title: m.title, url });
      resource.reload();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(null);
    }
  };
  const share = async (e) => {
    e.preventDefault();
    const v = Object.fromEntries(new FormData(e.currentTarget));
    setBusy("share");
    setError("");
    try {
      if (!safeUrl(v.fileUrl))
        throw new Error("Provide a valid HTTP or HTTPS file link.");
      await api.uploadMaterial({
        ...v,
        title: v.title.trim(),
        description: v.description.trim(),
      });
      setShow(false);
      setMessage("Your material has been shared with the community.");
      resource.reload();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(null);
    }
  };
  return (
    <>
      <Heading
        eyebrow="THE SHARED LIBRARY"
        title="Good notes deserve good company."
        description="Discover resources shared by your campus community."
        action={
          <button
            className="button primary"
            onClick={() => {
              setError("");
              setShow(true);
            }}
          >
            Share a material
          </button>
        }
      />
      <Notice>{message}</Notice>
      {!show && <Notice error>{error}</Notice>}
      {download && (
        <Notice>
          Your resource is ready:{" "}
          <a href={download.url} target="_blank" rel="noopener noreferrer">
            Open {download.title} ↗
          </a>
        </Notice>
      )}
      <section className="filter-bar" aria-label="Material filters">
        <label className="search-field">
          Search materials
          <input
            type="search"
            placeholder="Title, course, or keyword"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
        <label>
          Course
          <select value={course} onChange={(e) => setCourse(e.target.value)}>
            <option value="">All courses</option>
            {courses.data?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.code}
              </option>
            ))}
          </select>
        </label>
        <label>
          Type
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">All materials</option>
            {Object.entries(types).map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </label>
      </section>
      <LoadState resource={resource}>
        <p className="results-count">{rows.length} materials found</p>
        <div className="card-grid">
          {rows.map((m) => (
            <article className="material-card" key={m.id}>
              <div className="material-cover">
                <Icon icon={BookOpen01Icon} size={38} />
                <span>{m.fileFormat || "Resource"}</span>
              </div>
              <div className="material-body">
                <Tags values={[m.course?.code, types[m.materialType]]} />
                <h2>{m.title}</h2>
                <p>
                  {m.description || "A resource from your campus community."}
                </p>
                <p className="subtle">
                  Shared by {displayName(m.uploader)} · {m.downloadsCount || 0}{" "}
                  accesses
                </p>
                <button
                  className="button secondary full-width"
                  disabled={busy === m.id}
                  onClick={() => access(m)}
                >
                  {busy === m.id ? "Preparing…" : "Access material ↗"}
                </button>
              </div>
            </article>
          ))}
        </div>
        {!rows.length && (
          <Empty
            title={
              search || course || type
                ? "No resources match your search"
                : "Help build your campus library"
            }
            action={
              <button
                className="button secondary"
                onClick={() => {
                  setSearch("");
                  setCourse("");
                  setType("");
                }}
              >
                Clear filters
              </button>
            }
          >
            Share a useful resource or check back as your community adds
            materials.
          </Empty>
        )}
      </LoadState>
      {show && (
        <Dialog
          title="Share an academic material"
          onClose={() => setShow(false)}
        >
          <p>
            The library accepts links to hosted files. This form does not upload
            a file from your device.
          </p>
          <LoadState resource={courses}>
            {courses.data?.length ? (
              <form onSubmit={share}>
                <Notice error>{error}</Notice>
                <fieldset disabled={busy === "share"} className="form-fields">
                  <label>
                    Title
                    <input name="title" required maxLength={255} />
                  </label>
                  <CourseSelect courses={courses.data} />
                  <label>
                    Material type
                    <select name="materialType">
                      {Object.entries(types).map(([v, l]) => (
                        <option value={v} key={v}>
                          {l}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Hosted file URL
                    <input
                      type="url"
                      name="fileUrl"
                      required
                      pattern="https?://.*"
                      placeholder="https://…"
                      maxLength={1000}
                    />
                  </label>
                  <label>
                    File format
                    <input
                      name="fileFormat"
                      defaultValue="pdf"
                      required
                      maxLength={50}
                    />
                  </label>
                  <label>
                    Description
                    <textarea name="description" maxLength={2000} />
                  </label>
                  <button className="button primary">
                    {busy === "share" ? "Sharing…" : "Share material"}
                  </button>
                </fieldset>
              </form>
            ) : (
              <Empty title="No courses available">
                A course must be in the catalog before you can share a material.
              </Empty>
            )}
          </LoadState>
        </Dialog>
      )}
    </>
  );
}
