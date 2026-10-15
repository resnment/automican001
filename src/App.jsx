import React, { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  Search,
  X,
  Plus,
  Menu,
  Network,
  Building2,
  Users,
  Landmark,
  UserRound,
  Check,
  ChevronDown,
  ExternalLink,
} from "lucide-react";
import { AGENTS, CATEGORIES, FRAMEWORKS, AUDIENCES } from "./data";
import { Button, Dialog, Inquiry, Status } from "./components";
import { Avatar, AvatarGreeting } from "./Avatar";

const AUDIENCE_ICONS = [Building2, Users, Landmark, UserRound];
const FRAMEWORK_TYPES = [
  "All",
  "SDKs & frameworks",
  "Agent platforms",
  "Workflow automation",
];
const FAQS = [
  [
    "Hire or Build?",
    "Hire starts with an existing employee role. Build customizes a role or workflow around your tools. Both begin with a scope and quote.",
  ],
  [
    "Can my agent work in Bangla and English?",
    "Yes. We agree on the language, tone, and terminology, then review examples with you before rollout.",
  ],
  [
    "Can different frameworks connect?",
    "We can design connections through supported APIs, A2A, and MCP. Compatibility, access, and approvals are checked for each integration.",
  ],
  [
    "How is pricing decided?",
    "Pricing depends on the role, tools, and workflow. Send a brief to discuss scope and pricing; no payment is taken here.",
  ],
];

function Brand() {
  return (
    <a className="brand" href="#top" aria-label="Automican home">
      <span className="brand-mark">
        <Network size={25} aria-hidden="true" />
      </span>
      automican<span>.</span>
    </a>
  );
}
function EmployeeCard({ agent, onDetails, onInquiry }) {
  return (
    <article
      id={`employee-${agent.id}`}
      className={`employee-card accent-${agent.accent}`}
    >
      <div className="employee-card-main">
        <AvatarGreeting agent={agent} />
        <h3>
          <button
            className="role-title-button"
            aria-label={`View ${agent.short} details`}
            onClick={() => onDetails(agent)}
          >
            {agent.short}
          </button>
        </h3>
      </div>
      <p className="employee-summary">{agent.summary}</p>
      <div className="employee-card-actions">
        <Button
          onClick={() =>
            onInquiry({
              intent: "Hire",
              role: agent.designation,
              audience: agent.category === "Personal" ? "Personal" : undefined,
            })
          }
          aria-label={`Hire ${agent.short}`}
        >
          Hire <ArrowUpRight size={16} />
        </Button>
        <Button
          emphasis="outline"
          intent="neutral"
          onClick={() =>
            onInquiry({
              intent: "Build",
              role: agent.designation,
              audience: agent.category === "Personal" ? "Personal" : undefined,
            })
          }
          aria-label={`Build ${agent.short}`}
        >
          Build <Plus size={16} />
        </Button>
      </div>
    </article>
  );
}
function EmployeeExplorer({ onDetails, onInquiry }) {
  const read = () => {
    const p = new URLSearchParams(location.search);
    return {
      query: p.get("q") || "",
      category: CATEGORIES.includes(p.get("category"))
        ? p.get("category")
        : "All",
      shown: Math.min(12, Math.max(6, Number.parseInt(p.get("shown")) || 6)),
    };
  };
  const [state, setState] = useState(read);
  const [query, setQuery] = useState(state.query);
  const composing = useRef(false);
  const nextEmployeeFocus = useRef(null);
  const inputRef = useRef(null);
  const update = (patch, replace = false) => {
    const next = { ...state, ...patch };
    const url = new URL(location.href);
    for (const [key, param, fallback] of [
      ["query", "q", ""],
      ["category", "category", "All"],
      ["shown", "shown", 6],
    ]) {
      if (next[key] === fallback) url.searchParams.delete(param);
      else url.searchParams.set(param, next[key]);
    }
    history[replace ? "replaceState" : "pushState"]({}, "", url);
    setState(next);
  };
  useEffect(() => {
    const pop = () => {
      const next = read();
      setState(next);
      setQuery(next.query);
    };
    window.addEventListener("popstate", pop);
    return () => window.removeEventListener("popstate", pop);
  }, []);
  const matched = AGENTS.filter(
    (a) =>
      (state.category === "All" || a.category === state.category) &&
      `${a.designation} ${a.summary} ${a.tools.join(" ")} ${a.tasks.join(" ")}`
        .toLocaleLowerCase("en-US")
        .includes(state.query.toLocaleLowerCase("en-US")),
  );
  useEffect(() => {
    if (!nextEmployeeFocus.current) return;
    document
      .querySelector(`#employee-${nextEmployeeFocus.current} .avatar-trigger`)
      ?.focus();
    nextEmployeeFocus.current = null;
  }, [state.shown]);
  const clear = () => {
    setQuery("");
    update({ query: "", category: "All", shown: 6 });
    inputRef.current?.focus();
  };
  return (
    <section
      className="employees-section container section-space"
      id="employees"
    >
      <div className="section-heading">
        <h2>AI employees for everyday work.</h2>
      </div>
      <div className="employee-toolbar">
        <div className="search-field">
          <Search size={19} aria-hidden="true" />
          <input
            ref={inputRef}
            type="search"
            aria-label="Search AI employees"
            placeholder="Find your next AI employee…"
            value={query}
            onCompositionStart={() => {
              composing.current = true;
            }}
            onCompositionEnd={(e) => {
              composing.current = false;
              update({ query: e.currentTarget.value, shown: 6 }, true);
            }}
            onChange={(e) => {
              setQuery(e.target.value);
              if (!composing.current)
                update({ query: e.target.value, shown: 6 }, true);
            }}
          />
          {query && (
            <button
              className="icon-button"
              aria-label="Clear employee search"
              onClick={() => {
                setQuery("");
                update({ query: "", shown: 6 }, true);
                inputRef.current?.focus();
              }}
            >
              <X size={18} />
            </button>
          )}
        </div>
        <span className="result-count" role="status">
          {matched.length} {matched.length === 1 ? "employee" : "employees"} to
          meet
        </span>
      </div>
      <div
        className="filter-list"
        role="group"
        aria-label="Employee categories"
      >
        {["All", ...CATEGORIES].map((c) => (
          <button
            key={c}
            className={state.category === c ? "active" : ""}
            aria-pressed={state.category === c}
            onClick={() => update({ category: c, shown: 6 })}
          >
            {c === "All" ? "All employees" : c}
          </button>
        ))}
      </div>
      <div className="employee-grid">
        {matched.slice(0, state.shown).map((a) => (
          <EmployeeCard
            key={a.id}
            agent={a}
            onDetails={onDetails}
            onInquiry={onInquiry}
          />
        ))}
      </div>
      {!matched.length && (
        <div className="no-results">
          <Search size={30} aria-hidden="true" />
          <h3>No employees found</h3>
          <p>
            Try a role like accountant, customer care, or personal assistant.
          </p>
          <Button emphasis="outline" intent="neutral" onClick={clear}>
            Clear filters
          </Button>
        </div>
      )}
      <div className="employee-gallery-footer">
        {matched.length > state.shown && (
          <Button
            emphasis="outline"
            intent="neutral"
            onClick={() => {
              nextEmployeeFocus.current = matched[state.shown]?.id;
              update({ shown: 12 });
            }}
          >
            Meet all {matched.length} employees <ChevronDown size={17} />
          </Button>
        )}
      </div>
    </section>
  );
}
function FrameworkSection({ onInquiry }) {
  const [expanded, setExpanded] = useState(false);
  const [type, setType] = useState("All");
  const frameworks = FRAMEWORKS.filter(
    (f) => type === "All" || f.type === type,
  );
  return (
    <section
      className="framework-section container section-space"
      id="frameworks"
    >
      <div className="section-heading">
        <div>
          <h2>Build with your preferred framework.</h2>
          <p>Choose a stack, or let us help you pick one.</p>
        </div>
      </div>
      <div className="framework-heading">
        <div
          className="framework-filters"
          role="group"
          aria-label="Framework types"
        >
          {FRAMEWORK_TYPES.map((t) => (
            <button
              key={t}
              aria-pressed={type === t}
              className={type === t ? "active" : ""}
              onClick={() => {
                setType(t);
                setExpanded(false);
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
      <div className="framework-grid">
        {frameworks.slice(0, expanded ? frameworks.length : 8).map((f) => (
          <article className="framework-card" key={f.name}>
            <span className="framework-logo" aria-hidden="true">
              <img src={`/logos/${f.logo}.svg`} alt="" width="36" height="36" />
            </span>
            <div className="framework-copy">
              <h3>{f.name}</h3>
              <p>{f.detail}</p>
            </div>
            <div className="framework-actions">
              <a
                className="button button-ghost intent-neutral"
                href={f.url}
                target="_blank"
                rel="noreferrer"
                aria-label={`${f.name} official documentation (opens in new tab)`}
              >
                Docs <ExternalLink size={13} aria-hidden="true" />
              </a>
              <Button
                emphasis="ghost"
                intent="neutral"
                onClick={() =>
                  onInquiry({
                    intent: "Build",
                    role: "Custom AI employee",
                    framework: f.name,
                  })
                }
                aria-label={`Build with ${f.name}`}
              >
                Build <ArrowUpRight size={18} aria-hidden="true" />
              </Button>
            </div>
          </article>
        ))}
      </div>
      {frameworks.length > 8 && (
        <button
          className="framework-expand text-button"
          aria-expanded={expanded}
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded
            ? "Show fewer options"
            : `Explore all ${frameworks.length} options`}
          <ChevronDown
            className={expanded ? "rotated" : ""}
            size={17}
            aria-hidden="true"
          />
        </button>
      )}
      <div className="interoperability">
        <div className="connection-copy">
          <h3>
            Independent agents.
            <br />
            <span>Connected possibilities.</span>
          </h3>
          <p>
            Agents don’t have to share a framework to share a goal. We design
            the connections and verify each integration before rollout.
          </p>
        </div>
        <div className="protocols">
          <a
            href="https://a2a-protocol.org/latest/"
            target="_blank"
            rel="noreferrer"
            aria-label="A2A protocol documentation (opens in new tab)"
          >
            <span className="protocol-icon">
              <img src="/logos/a2a.svg" width="36" height="36" alt="" />
            </span>
            <span>
              <strong>
                A2A <span>Agent ↔ Agent</span>
              </strong>
              <span>
                Discover, delegate, and exchange results across compatible
                agents.
              </span>
            </span>
            <ArrowUpRight size={18} aria-hidden="true" />
          </a>
          <a
            href="https://modelcontextprotocol.io/docs/getting-started/intro"
            target="_blank"
            rel="noreferrer"
            aria-label="MCP protocol documentation (opens in new tab)"
          >
            <span className="protocol-icon">
              <img src="/logos/mcp.svg" width="36" height="36" alt="" />
            </span>
            <span>
              <strong>
                MCP <span>Agent ↔ Tools & data</span>
              </strong>
              <span>
                Connect agents to your systems through supported tools and
                resources.
              </span>
            </span>
            <ArrowUpRight size={18} aria-hidden="true" />
          </a>
        </div>
      </div>
      <p className="framework-footnote">
        Compatibility depends on supported APIs, permissions, and testing.
        Framework and protocol names identify build options, not partnerships.
      </p>
    </section>
  );
}
export default function App() {
  const [detail, setDetail] = useState(null);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [context, setContext] = useState({ intent: "Build" });
  const [status, setStatus] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef(null),
    detailTrigger = useRef(null),
    inquiryTrigger = useRef(null);
  const openDetails = (agent) => {
    detailTrigger.current = document.activeElement;
    setDetail(agent);
  };
  const openInquiry = (next = { intent: "Build" }) => {
    inquiryTrigger.current = document.activeElement.closest("dialog")
      ? detailTrigger.current
      : document.activeElement;
    setContext(next);
    setDetail(null);
    setInquiryOpen(true);
    setMobileOpen(false);
  };
  useEffect(() => {
    document.title = "Automican — AI employees. Human ambition.";
  }, []);
  useEffect(() => {
    if (!status) return;
    const timer = setTimeout(() => setStatus(""), 6000);
    return () => clearTimeout(timer);
  }, [status]);
  useEffect(() => {
    if (!mobileOpen) return;
    const close = (e) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        menuRef.current?.focus();
      }
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [mobileOpen]);
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div id="top" />
      <header className="site-header">
        <div className="container header-inner">
          <Brand />
          <nav
            className={`main-nav ${mobileOpen ? "is-open" : ""}`}
            aria-label="Main navigation"
          >
            {[
              ["AI employees", "#employees"],
              ["Custom builds", "#custom"],
              ["Frameworks", "#frameworks"],
            ].map(([label, url]) => (
              <a key={url} href={url} onClick={() => setMobileOpen(false)}>
                {label}
              </a>
            ))}
          </nav>
          <div className="header-actions">
            <Button
              emphasis="outline"
              intent="neutral"
              onClick={() => openInquiry()}
            >
              Let’s build <ArrowUpRight size={17} />
            </Button>
            <button
              ref={menuRef}
              className="icon-button mobile-menu"
              aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>
      <main id="main">
        <section className="hero container">
          <div className="hero-copy">
            <h1>
              Your next AI hire.
              <br />
              <span>Beyond ordinary.</span>
            </h1>
            <p>Hire an AI specialist or build one around your work.</p>
            <div className="hero-actions">
              <a
                href="#employees"
                className="button button-solid intent-primary"
              >
                Explore employees <ArrowUpRight size={19} />
              </a>
              <button
                className="button button-outline intent-neutral"
                onClick={() => openInquiry()}
              >
                Build an agent <ArrowRight size={19} />
              </button>
            </div>
          </div>
        </section>
        <section
          className="audience-section container"
          aria-label="Companies, Organizations, Institutions, Personal"
        >
          <div className="audience-list">
            {AUDIENCES.map((a, i) => {
              const Icon = AUDIENCE_ICONS[i];
              return (
                <React.Fragment key={a}>
                  <span>
                    <Icon size={22} aria-hidden="true" />
                    {a}
                  </span>
                </React.Fragment>
              );
            })}
          </div>
        </section>
        <EmployeeExplorer onDetails={openDetails} onInquiry={openInquiry} />
        <section className="custom-section container section-space" id="custom">
          <div>
            <h2>Your workflow. Your AI.</h2>
            <p>Build around your tools, language, and approvals.</p>
          </div>
          <Button onClick={() => openInquiry()}>
            Build a custom agent <ArrowUpRight size={18} />
          </Button>
        </section>
        <FrameworkSection onInquiry={openInquiry} />
        <section className="faq-section container section-space" id="questions">
          <div className="faq-intro">
            <h2>
              The human
              <br />
              <span>questions.</span>
            </h2>
            <p>Clear answers before we build.</p>
            <a href="mailto:automicanhq@gmail.com" className="text-button">
              Talk to the humans <ArrowUpRight size={18} aria-hidden="true" />
            </a>
          </div>
          <div className="faq-list">
            {FAQS.map(([q, a]) => (
              <details key={q}>
                <summary>
                  {q}
                  <Plus size={20} aria-hidden="true" />
                </summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>
      <footer className="site-footer" id="contact">
        <div className="container">
          <div className="footer-invitation">
            <h2>
              Your next chapter.
              <br />
              <span>Built around you.</span>
            </h2>
            <div>
              <p>
                Tell us what takes up your day.
                <br />
                Let’s find what AI can take off your plate.
              </p>
              <Button onClick={() => openInquiry()}>
                Discuss your project{" "}
                <ArrowUpRight size={18} aria-hidden="true" />
              </Button>
            </div>
          </div>
          <div className="footer-main">
            <div className="footer-about">
              <Brand />
              <p>
                AI employees and custom agent systems for companies,
                organizations, institutions, and personal work.
              </p>
              <span className="footer-language">
                Bangla & English workflows
              </span>
            </div>
            <nav aria-label="Footer navigation">
              <h3>Explore</h3>
              <a href="#employees">AI employees</a>
              <a href="#custom">Custom builds</a>
              <a href="#frameworks">Frameworks & platforms</a>
              <a href="#questions">Questions & answers</a>
            </nav>
            <div className="footer-contact">
              <h3>Start a conversation</h3>
              <a href="mailto:automicanhq@gmail.com">
                automicanhq@gmail.com{" "}
                <ArrowUpRight size={18} aria-hidden="true" />
              </a>
              <p>
                Share your role, tools, and goals. We’ll agree on scope and
                pricing before work begins.
              </p>
            </div>
          </div>
          <div className="footer-bottom">
            <span>
              © {new Date().getFullYear()} Automican. All rights reserved.
            </span>
            <a href="#top">
              Back to top <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </div>
        </div>
      </footer>
      <Dialog
        open={!!detail}
        onClose={() => setDetail(null)}
        title={detail?.designation || "AI employee"}
        description={detail?.scene || ""}
      >
        {detail && (
          <div className={`employee-detail accent-${detail.accent}`}>
            <div className="detail-avatar-row">
              <Avatar agent={detail} />
              <div>
                <p>{detail.summary}</p>
              </div>
            </div>
            <h3>How I can help</h3>
            <ul>
              {detail.tasks.map((t) => (
                <li key={t}>
                  <Check size={18} aria-hidden="true" />
                  {t}
                </li>
              ))}
            </ul>
            <p className="detail-note">
              We agree on tools, permissions, and review checkpoints before
              rollout.
            </p>
            <div className="dialog-actions">
              <Button
                emphasis="outline"
                intent="neutral"
                onClick={() =>
                  openInquiry({
                    intent: "Build",
                    role: detail.designation,
                    audience:
                      detail.category === "Personal" ? "Personal" : undefined,
                  })
                }
              >
                Build this role <Plus size={17} />
              </Button>
              <Button
                onClick={() =>
                  openInquiry({
                    intent: "Hire",
                    role: detail.designation,
                    audience:
                      detail.category === "Personal" ? "Personal" : undefined,
                  })
                }
              >
                Hire this employee <ArrowUpRight size={17} />
              </Button>
            </div>
          </div>
        )}
      </Dialog>
      <Inquiry
        open={inquiryOpen}
        initialContext={context}
        onClose={() => {
          setInquiryOpen(false);
          requestAnimationFrame(
            () =>
              inquiryTrigger.current?.isConnected &&
              inquiryTrigger.current.focus(),
          );
        }}
        onStatus={setStatus}
      />
      <Status message={status} modalOpen={inquiryOpen || !!detail} />
    </>
  );
}
