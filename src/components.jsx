import React, { useEffect, useId, useRef, useState } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  X,
  Check,
  Download,
  Mail,
  LoaderCircle,
  Network,
  Compass,
  Code2,
  TrendingUp,
  ChartNoAxesCombined,
  CheckCircle2,
} from "lucide-react";
import { AGENTS, DEPARTMENTS, DEPARTMENT_INFO } from "./data";

export const ICONS = {
  System: Network,
  Origin: Compass,
  Development: Code2,
  Growth: TrendingUp,
  Revenue: ChartNoAxesCombined,
};
export function Button({
  children,
  emphasis = "solid",
  intent = "primary",
  className = "",
  onClick,
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`button button-${emphasis} intent-${intent} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
export function DepartmentIcon({ department, size = 19 }) {
  const Icon = ICONS[department] || Network;
  return (
    <span className={`department-icon tone-${department.toLowerCase()}`}>
      <Icon size={size} aria-hidden="true" />
    </span>
  );
}
export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  className = "",
}) {
  const ref = useRef(null);
  const titleId = useId();
  const descriptionId = useId();
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    const dialog = ref.current;
    if (!open) return;
    const trigger = document.activeElement;
    const overflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    const cancel = (event) => {
      event.preventDefault();
      closeRef.current();
    };
    const trapFocus = (event) => {
      if (event.key !== "Tab") return;
      const focusable = [
        ...dialog.querySelectorAll(
          'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex="0"]',
        ),
      ].filter((el) => el.getClientRects().length);
      const first = focusable[0];
      const last = focusable.at(-1);
      if (
        event.shiftKey &&
        (document.activeElement === first ||
          !focusable.includes(document.activeElement))
      ) {
        event.preventDefault();
        last?.focus();
      } else if (
        !event.shiftKey &&
        (document.activeElement === last ||
          !focusable.includes(document.activeElement))
      ) {
        event.preventDefault();
        first?.focus();
      }
    };
    dialog.addEventListener("keydown", trapFocus);
    dialog.addEventListener("cancel", cancel);
    return () => {
      dialog.removeEventListener("cancel", cancel);
      dialog.removeEventListener("keydown", trapFocus);
      dialog.close();
      document.body.style.overflow = overflow;
      if (trigger?.isConnected) trigger.focus();
    };
  }, [open]);
  return (
    <dialog
      ref={ref}
      className={`dialog ${className}`}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
    >
      <div className="dialog-header">
        <div>
          <span className="eyebrow">AUTOMICAN / LET’S CONNECT</span>
          <h2 id={titleId}>{title}</h2>
        </div>
        <button
          type="button"
          className="icon-button"
          aria-label="Close dialog"
          onClick={onClose}
        >
          <X size={20} />
        </button>
      </div>
      <p id={descriptionId} className="dialog-description">
        {description}
      </p>
      {children}
    </dialog>
  );
}
export function Field({ id, label, hint, error, children }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {children}
      <div
        className={`field-help ${error ? "field-error" : ""}`}
        id={`${id}-help`}
      >
        {error || hint || "\u00a0"}
      </div>
    </div>
  );
}
export function Status({ message }) {
  return (
    <div
      className={`toast ${message ? "visible" : ""}`}
      role="status"
      aria-live="polite"
    >
      {message && (
        <>
          <CheckCircle2 size={18} aria-hidden="true" />
          {message}
        </>
      )}
    </div>
  );
}
export function TeamDetail({ team, onHire }) {
  const roles = AGENTS.filter((a) => a.department === team);
  return (
    <>
      <div className="team-detail-intro">
        <DepartmentIcon department={team} size={27} />
        <p>{DEPARTMENT_INFO[team].description}</p>
      </div>
      <h3 className="small-heading">Your team, role by role</h3>
      <div className="detail-roles">
        {roles.map((a) => (
          <div key={a.designation}>
            <Check size={16} aria-hidden="true" />
            <div>
              <strong>{a.designation}</strong>
              <p>{a.role}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="dialog-actions">
        <span>Final scope is agreed with you.</span>
        <Button onClick={() => onHire(team)}>
          Discuss this team <ArrowUpRight size={17} />
        </Button>
      </div>
    </>
  );
}
const EMPTY_FORM = {
  name: "",
  organization: "",
  email: "",
  objective: "",
  team: "Custom team",
};
export function Inquiry({ initialTeam, open, onClose, onStatus }) {
  const [values, setValues] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [review, setReview] = useState(false);
  const [downloadError, setDownloadError] = useState("");
  const [discarding, setDiscarding] = useState(false);
  const [working, setWorking] = useState(false);
  const locked = useRef(false);
  const reviewRef = useRef(null);
  const dirty = Object.keys(EMPTY_FORM).some((k) => k !== "team" && values[k]);
  useEffect(() => {
    if (open && initialTeam) {
      setValues((v) => ({ ...v, team: initialTeam }));
      setReview(false);
      setDiscarding(false);
    }
  }, [open, initialTeam]);
  useEffect(() => {
    if (!dirty) return;
    const warn = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
  useEffect(() => {
    if (review) reviewRef.current?.focus();
  }, [review]);
  const update = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    setErrors((v) => ({ ...v, [name]: "" }));
  };
  const submit = (e) => {
    e.preventDefault();
    if (e.nativeEvent.isComposing) return;
    const next = {};
    if (values.name.trim().length < 2)
      next.name = "Enter your name (at least 2 characters).";
    if (!values.organization.trim())
      next.organization = "Enter your organization’s name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()))
      next.email = "Enter a valid email, such as name@company.com.";
    if (values.objective.trim().length < 20)
      next.objective = "Add a little more detail (at least 20 characters).";
    setErrors(next);
    if (Object.keys(next).length) {
      document.getElementById(`inquiry-${Object.keys(next)[0]}`)?.focus();
      return;
    }
    setReview(true);
  };
  const download = () => {
    if (locked.current) return;
    locked.current = true;
    setWorking(true);
    setDownloadError("");
    let url;
    try {
      const brief = `AUTOMICAN — INQUIRY BRIEF\n\nInterest: ${values.team}\nName: ${values.name.trim()}\nOrganization: ${values.organization.trim()}\nEmail: ${values.email.trim()}\n\nWhat we want to achieve\n${values.objective.trim()}\n\nSend this inquiry to automicanhq@gmail.com. Downloading does not send your inquiry.\n`;
      url = URL.createObjectURL(
        new Blob([brief], { type: "text/plain;charset=utf-8" }),
      );
      const link = document.createElement("a");
      link.href = url;
      link.download = "automican-inquiry.txt";
      document.body.append(link);
      link.click();
      link.remove();
      onStatus("Brief downloaded. Email it to automicanhq@gmail.com.");
    } catch {
      setDownloadError(
        "The brief could not be downloaded. Your details are still here. Try again.",
      );
    } finally {
      if (url) setTimeout(() => URL.revokeObjectURL(url), 1000);
      locked.current = false;
      setWorking(false);
    }
  };
  const emailBody = `Hi Automican,\n\nI’m interested in: ${values.team}\n\nName: ${values.name.trim()}\nOrganization: ${values.organization.trim()}\nEmail: ${values.email.trim()}\n\nWhat we want to achieve:\n${values.objective.trim()}\n\nPlease get in touch to discuss scope and next steps.`;
  const mailto = `mailto:automicanhq@gmail.com?subject=${encodeURIComponent(`Agent inquiry — ${values.team}`)}&body=${encodeURIComponent(emailBody)}`;
  const controls = (name, extra = {}) => ({
    id: `inquiry-${name}`,
    name,
    value: values[name],
    onChange: update,
    "aria-invalid": !!errors[name],
    "aria-describedby": `inquiry-${name}-help`,
    ...extra,
  });
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={
        review
          ? "Your next chapter starts here."
          : "Let’s build your advantage."
      }
      description={
        review
          ? "Review your brief, then open a prefilled email to Automican."
          : "Tell us what you want to achieve. We’ll help shape the right agent team."
      }
      className="inquiry-dialog"
    >
      {review ? (
        <div className="inquiry-review">
          <h3 ref={reviewRef} tabIndex={-1}>
            Your inquiry brief
          </h3>
          <dl>
            <div>
              <dt>Interested in</dt>
              <dd>{values.team}</dd>
            </div>
            <div>
              <dt>Organization</dt>
              <dd>{values.organization}</dd>
            </div>
            <div>
              <dt>Your name</dt>
              <dd>{values.name}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>{values.email}</dd>
            </div>
          </dl>
          <h4>Your objective</h4>
          <p className="review-objective">{values.objective}</p>
          <div className="inquiry-notice">
            <Download size={18} aria-hidden="true" />
            <p>
              <strong>Ready for automicanhq@gmail.com.</strong> Open your email
              draft below, then send it from your email app. Prefer another app?
              Download the brief and email it to us.
            </p>
          </div>
          {downloadError && (
            <p role="alert" className="inline-error">
              {downloadError}
            </p>
          )}
          <div className="dialog-actions">
            <Button
              emphasis="ghost"
              intent="neutral"
              onClick={() => setReview(false)}
            >
              Edit details
            </Button>
            <Button
              emphasis="outline"
              intent="neutral"
              onClick={download}
              disabled={working}
              aria-busy={working}
            >
              {working ? (
                <LoaderCircle className="spin" size={17} />
              ) : (
                <Download size={17} />
              )}
              Download brief
            </Button>
            <a
              className="button button-solid intent-primary"
              href={mailto}
              onClick={() =>
                onStatus("Send the inquiry from your email app to finish.")
              }
            >
              <Mail size={17} aria-hidden="true" />
              Open email draft
            </a>
          </div>
          <p className="email-fallback">
            Email app didn’t open? Send your downloaded brief to{" "}
            <a href="mailto:automicanhq@gmail.com">automicanhq@gmail.com</a>.
          </p>
        </div>
      ) : (
        <form noValidate onSubmit={submit}>
          <div className="inquiry-notice compact">
            <span className="status-dot" />
            <p>
              Your details stay in this tab. You choose when to send your
              inquiry by email.
            </p>
          </div>
          <Field id="inquiry-team" label="I’m interested in">
            <select {...controls("team")}>
              <option>Custom team</option>
              {DEPARTMENTS.map((d) => (
                <option key={d}>{d} team</option>
              ))}
              <optgroup label="Individual specialist roles">
                {AGENTS.map((a) => (
                  <option key={a.designation}>{a.designation}</option>
                ))}
              </optgroup>
            </select>
          </Field>
          <div className="form-columns">
            <Field id="inquiry-name" label="Your name" error={errors.name}>
              <input
                {...controls("name", { autoComplete: "name", maxLength: 100 })}
                placeholder="Alex Morgan"
                required
              />
            </Field>
            <Field
              id="inquiry-organization"
              label="Organization"
              error={errors.organization}
            >
              <input
                {...controls("organization", {
                  autoComplete: "organization",
                  maxLength: 160,
                })}
                placeholder="Company or institution"
                required
              />
            </Field>
          </div>
          <Field id="inquiry-email" label="Work email" error={errors.email}>
            <input
              {...controls("email", {
                type: "email",
                autoComplete: "email",
                maxLength: 254,
              })}
              placeholder="you@organization.com"
              required
            />
          </Field>
          <Field
            id="inquiry-objective"
            label="What would you like your agents to do?"
            error={errors.objective}
            hint="Share your workflow, your goals, or the work you want to take off your team’s plate."
          >
            <textarea
              className="resize-none"
              {...controls("objective", { maxLength: 2000, rows: 4 })}
              style={{ resize: "none" }}
              placeholder="We’re looking for a team that can…"
              required
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height = `${Math.min(e.target.scrollHeight, 240)}px`;
              }}
            />
          </Field>
          <div className="dialog-actions">
            <span>No commitment. Start with your goal.</span>
            <Button type="submit">
              Review inquiry <ArrowRight size={17} />
            </Button>
          </div>
        </form>
      )}
      {dirty && (
        <div className="draft-note">
          {discarding ? (
            <>
              <span>Clear all the details in this draft?</span>
              <button
                className="text-button danger-text"
                onClick={() => {
                  setValues(EMPTY_FORM);
                  setErrors({});
                  setReview(false);
                  setDiscarding(false);
                }}
              >
                Clear draft
              </button>
              <button
                className="text-button"
                onClick={() => setDiscarding(false)}
              >
                Keep draft
              </button>
            </>
          ) : (
            <>
              <span>Your draft stays here when you close this window.</span>
              <button
                className="text-button"
                onClick={() => setDiscarding(true)}
              >
                Clear draft…
              </button>
            </>
          )}
        </div>
      )}
    </Dialog>
  );
}
