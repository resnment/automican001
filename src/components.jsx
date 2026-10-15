import { createPortal } from "react-dom";
import React, { useEffect, useId, useRef, useState } from "react";
import {
  ArrowRight,
  X,
  Download,
  Mail,
  LoaderCircle,
  Network,
  Calculator,
  Headset,
  MessageCircle,
  Megaphone,
  Handshake,
  Users,
  ShoppingBag,
  Package,
  GraduationCap,
  BookOpen,
  CalendarDays,
  PenTool,
  CheckCircle2,
} from "lucide-react";
import { AGENTS, FRAMEWORKS, AUDIENCES } from "./data";

export const ROLE_ICONS = {
  social: MessageCircle,
  accounts: Calculator,
  support: Headset,
  marketing: Megaphone,
  sales: Handshake,
  hr: Users,
  commerce: ShoppingBag,
  inventory: Package,
  admissions: GraduationCap,
  academic: BookOpen,
  personal: CalendarDays,
  content: PenTool,
};
export function RoleIcon({ icon, size = 20, ...props }) {
  const Icon = ROLE_ICONS[icon] || Network;
  return <Icon size={size} aria-hidden="true" {...props} />;
}
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
      {React.cloneElement(children, {
        "aria-describedby": error || hint ? `${id}-help` : undefined,
      })}
      {(error || hint) && (
        <div
          className={`field-help ${error ? "field-error" : ""}`}
          id={`${id}-help`}
        >
          {error || hint}
        </div>
      )}
    </div>
  );
}
export function Status({ message, modalOpen = false }) {
  const [target, setTarget] = useState(document.body);
  useEffect(() => {
    setTarget(
      modalOpen
        ? document.querySelector("dialog[open]") || document.body
        : document.body,
    );
  }, [modalOpen]);
  const content = (
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
  return createPortal(content, target);
}
const EMPTY_FORM = {
  name: "",
  organization: "",
  email: "",
  objective: "",
  team: "Custom AI employee",
  intent: "Hire",
  audience: "Companies",
  framework: "Recommend a framework",
};
export function Inquiry({ initialContext, open, onClose, onStatus }) {
  const [values, setValues] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [review, setReview] = useState(false);
  const [downloadError, setDownloadError] = useState("");
  const [discarding, setDiscarding] = useState(false);
  const [working, setWorking] = useState(false);
  const locked = useRef(false);
  const reviewRef = useRef(null);
  const dirty = ["name", "organization", "email", "objective"].some(
    (k) => values[k],
  );
  useEffect(() => {
    if (open && initialContext) {
      setValues((v) => ({
        ...v,
        team: initialContext.role || "Custom AI employee",
        intent: initialContext.intent || "Build",
        audience: initialContext.audience || v.audience,
        framework: initialContext.framework || "Recommend a framework",
      }));
      setReview(false);
      setDiscarding(false);
    }
  }, [open, initialContext]);
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
    if (values.audience !== "Personal" && !values.organization.trim())
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
      const brief = `AUTOMICAN — INQUIRY BRIEF\n\nRequest: ${values.intent}\nRole: ${values.team}\nFor: ${values.audience}\nFramework: ${values.framework}\nName: ${values.name.trim()}\nOrganization: ${values.organization.trim() || "Personal use"}\nEmail: ${values.email.trim()}\n\nWhat we want to achieve\n${values.objective.trim()}\n\nSend this inquiry to automicanhq@gmail.com. Downloading does not send your inquiry.\n`;
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
  const emailBody = `Hi Automican,\n\nI would like to: ${values.intent}\nRole: ${values.team}\nFor: ${values.audience}\nPreferred framework: ${values.framework}\n\nName: ${values.name.trim()}\nOrganization: ${values.organization.trim() || "Personal use"}\nEmail: ${values.email.trim()}\n\nWhat we want to achieve:\n${values.objective.trim()}\n\nPlease get in touch to discuss scope and next steps.`;
  const mailto = `mailto:automicanhq@gmail.com?subject=${encodeURIComponent(`${values.intent} inquiry — ${values.team}`)}&body=${encodeURIComponent(emailBody)}`;
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
          ? "Review your inquiry"
          : values.intent === "Hire"
            ? "Hire an AI employee"
            : "Build an AI agent"
      }
      description={
        review
          ? "Send the brief from your email app, or download a copy."
          : "Tell us the role and work you need help with."
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
              <dt>Request</dt>
              <dd>
                {values.intent} · {values.audience}
              </dd>
            </div>
            <div>
              <dt>Framework</dt>
              <dd>{values.framework}</dd>
            </div>
            <div>
              <dt>Organization</dt>
              <dd>{values.organization || "Personal use"}</dd>
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
              Send to{" "}
              <a href="mailto:automicanhq@gmail.com">automicanhq@gmail.com</a>{" "}
              from your email app.
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
            No email app? Send your downloaded brief to{" "}
            <a href="mailto:automicanhq@gmail.com">automicanhq@gmail.com</a>.
          </p>
        </div>
      ) : (
        <form noValidate onSubmit={submit}>
          <div className="inquiry-notice compact">
            <span className="status-dot" />
            <p>Review first. Send from your own email app.</p>
          </div>
          <div className="form-columns">
            <Field id="inquiry-intent" label="I want to">
              <select {...controls("intent")}>
                <option value="Hire">Hire an AI employee</option>
                <option value="Build">Build a custom agent</option>
              </select>
            </Field>
            <Field id="inquiry-audience" label="This is for">
              <select {...controls("audience")}>
                {AUDIENCES.map((a) => (
                  <option key={a}>{a}</option>
                ))}
              </select>
            </Field>
          </div>
          <Field id="inquiry-team" label="Employee role">
            <select {...controls("team")}>
              <option>Custom AI employee</option>
              {AGENTS.map((a) => (
                <option key={a.id}>{a.designation}</option>
              ))}
            </select>
          </Field>
          <Field id="inquiry-framework" label="Preferred framework or platform">
            <select {...controls("framework")}>
              <option>Recommend a framework</option>
              {FRAMEWORKS.map((f) => (
                <option key={f.name}>{f.name}</option>
              ))}
              <option>Other / my existing setup</option>
            </select>
          </Field>
          <div className="form-columns">
            <Field id="inquiry-name" label="Your name" error={errors.name}>
              <input
                {...controls("name", { autoComplete: "name", maxLength: 100 })}
                placeholder="Your full name"
                required
              />
            </Field>
            <Field
              id="inquiry-organization"
              label={
                values.audience === "Personal"
                  ? "Organization (optional)"
                  : "Organization"
              }
              error={errors.organization}
            >
              <input
                {...controls("organization", {
                  autoComplete: "organization",
                  maxLength: 160,
                })}
                placeholder={
                  values.audience === "Personal"
                    ? "Optional for personal use"
                    : "Company, organization, or institution"
                }
                required={values.audience !== "Personal"}
              />
            </Field>
          </div>
          <Field id="inquiry-email" label="Email address" error={errors.email}>
            <input
              {...controls("email", {
                type: "email",
                autoComplete: "email",
                maxLength: 254,
              })}
              placeholder="you@example.com"
              required
            />
          </Field>
          <Field
            id="inquiry-objective"
            label="What work would you like help with?"
            error={errors.objective}
            hint="Tell us about your workflow, tools, and the outcome you have in mind."
          >
            <textarea
              className="resize-none"
              {...controls("objective", { maxLength: 2000, rows: 4 })}
              style={{ resize: "none" }}
              placeholder="I’d like an AI employee who can…"
              required
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height = `${Math.min(e.target.scrollHeight, 240)}px`;
              }}
            />
          </Field>
          <div className="dialog-actions">
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
              <span>Your draft stays in this tab.</span>
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
