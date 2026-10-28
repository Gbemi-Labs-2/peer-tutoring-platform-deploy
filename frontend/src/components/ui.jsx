import { useEffect, useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { BookOpen01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { initialsOf } from "../Auth.js";

export function Icon({ icon, size = 20 }) {
  return (
    <HugeiconsIcon
      icon={icon}
      size={size}
      strokeWidth={1.7}
      aria-hidden="true"
    />
  );
}
export function Avatar({ user, large = false }) {
  return (
    <span
      className={`avatar ${large ? "avatar-large" : ""}`}
      aria-hidden="true"
    >
      {initialsOf(user)}
    </span>
  );
}
export function Heading({ eyebrow, title, description, action }) {
  return (
    <div className="page-heading">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {action}
    </div>
  );
}
export function Notice({ children, error = false }) {
  return children ? (
    <div
      className={`notice ${error ? "notice-error" : ""}`}
      role={error ? "alert" : "status"}
    >
      {children}
    </div>
  ) : null;
}
export function Empty({ title, children, action }) {
  return (
    <div className="empty-state">
      <span className="empty-icon">
        <Icon icon={BookOpen01Icon} size={26} />
      </span>
      <h3>{title}</h3>
      <p>{children}</p>
      {action}
    </div>
  );
}
export function Status({ value }) {
  return (
    <span className={`status status-${String(value).toLowerCase()}`}>
      {String(value || "Pending").replaceAll("_", " ")}
    </span>
  );
}
export function Tags({ values = [] }) {
  return (
    <div className="tags">
      {(values || []).filter(Boolean).map((v, i) => (
        <span className="tag" key={`${v}-${i}`}>
          {v}
        </span>
      ))}
    </div>
  );
}
export function useResource(loader, key = "") {
  const [state, setState] = useState({ data: null, loading: true, error: "" });
  const [version, setVersion] = useState(0);
  const load = useRef(loader);
  load.current = loader;
  useEffect(() => {
    let alive = true;
    setState({ data: null, loading: true, error: "" });
    Promise.resolve()
      .then(() => load.current())
      .then((data) => {
        if (alive) setState({ data, loading: false, error: "" });
      })
      .catch((e) => {
        if (alive) setState({ data: null, loading: false, error: e.message });
      });
    return () => {
      alive = false;
    };
  }, [key, version]);
  return { ...state, reload: () => setVersion((v) => v + 1) };
}
export function LoadState({ resource, children }) {
  if (resource.loading)
    return (
      <div className="loading-state" role="status">
        <span className="spinner" /> Loading your workspace…
      </div>
    );
  if (resource.error)
    return (
      <div className="load-error">
        <Notice error>{resource.error}</Notice>
        <button className="button secondary" onClick={resource.reload}>
          Try again
        </button>
      </div>
    );
  return children;
}
export function Dialog({ title, onClose, children, className = "" }) {
  const ref = useRef(null);
  const close = useRef(onClose);
  close.current = onClose;
  useEffect(() => {
    const dialog = ref.current,
      previous = document.activeElement;
    dialog.showModal();
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = original;
      if (previous?.isConnected) previous.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className={`dialog ${className}`}
      aria-labelledby="dialog-title"
      onCancel={(e) => {
        e.preventDefault();
        close.current();
      }}
      onClick={(e) => {
        if (e.target === ref.current) close.current();
      }}
    >
      <div className="dialog-content">
        <div className="dialog-heading">
          <h2 id="dialog-title">{title}</h2>
          <button
            className="icon-button"
            aria-label="Close dialog"
            onClick={onClose}
          >
            <Icon icon={Cancel01Icon} />
          </button>
        </div>
        {children}
      </div>
    </dialog>
  );
}
export function CourseSelect({
  courses,
  name = "courseId",
  label = "Course",
  ...props
}) {
  return (
    <label>
      {label}
      <select name={name} required defaultValue="" {...props}>
        <option value="" disabled>
          Select a course
        </option>
        {(courses || []).map((c) => (
          <option key={c.id} value={c.id}>
            {c.code} · {c.title}
          </option>
        ))}
      </select>
    </label>
  );
}
export function safeUrl(url) {
  try {
    const u = new URL(url);
    return ["https:", "http:"].includes(u.protocol) ? u.href : null;
  } catch {
    return null;
  }
}
export function dateTime(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Time to be arranged"
    : date.toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
}
export function courseName(course) {
  return course
    ? [course.code, course.title].filter(Boolean).join(" · ")
    : "Study session";
}
