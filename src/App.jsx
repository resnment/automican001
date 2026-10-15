import React, { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  Search,
  X,
  Plus,
  Menu,
  Network,
  ShieldCheck,
  Sparkles,
  Building2,
  Users,
  Landmark,
  UserRound,
  Check,
  Orbit,
  Workflow,
  Radio,
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
    "What is an AI employee?",
    "An AI employee is an agent configured for a specific role, such as accounting support, customer care, or social media. You define the job, provide approved knowledge, and agree on tools and review checkpoints. It supports your people; it does not independently become an authorized member of your company.",
  ],
  [
    "What is the difference between Hire and Build?",
    "Hire starts a conversation about one of the roles in our employee catalog. Build starts with your own workflow, tools, preferred framework, or a custom combination of roles. Both begin with scoping; clicking either button does not start a paid engagement.",
  ],
  [
    "Can my AI employee work in Bangla and English?",
    "Bangla and English can be part of your brief, including terminology, tone, and mixed-language workflows. We agree on the language requirements and validate representative examples before rollout. Model choice and source information affect the final result.",
  ],
  [
    "Can agents built with different frameworks work together?",
    "Yes, cross-framework collaboration can be designed around supported APIs, Agent2Agent (A2A) for agent communication, and Model Context Protocol (MCP) for tools and data. Each connection still needs compatible capabilities, access permissions, and integration testing. A listed framework is a build option, not a claim that every combination already works.",
  ],
  [
    "Can I get an agent for personal use?",
    "Yes. Choose Personal in your inquiry. You can start with planning, notes, research organization, or drafting everyday messages. An organization name is optional for personal inquiries.",
  ],
  [
    "How do pricing, access, and approvals work?",
    "Pricing and timelines follow the agreed scope. We define the tools, access, and human approvals before rollout. Payments, budgets, publishing, hiring decisions, academic decisions, and other consequential actions stay subject to the approvals agreed for your workflow.",
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
function HeroConstellation() {
  return (
    <div
      className="hero-constellation"
      aria-label="Illustrated AI employees with a social media manager introduction"
    >
      <div className="constellation-heading">
        <span className="eyebrow">THE NEXT KIND OF TEAMMATE</span>
        <span className="constellation-spark" aria-hidden="true">
          ✦
        </span>
      </div>
      <svg
        className="constellation-orbits"
        viewBox="0 0 600 620"
        fill="none"
        aria-hidden="true"
      >
        <ellipse
          cx="307"
          cy="350"
          rx="258"
          ry="132"
          transform="rotate(-28 307 350)"
        />
        <ellipse
          cx="307"
          cy="350"
          rx="210"
          ry="241"
          transform="rotate(25 307 350)"
        />
        <path d="M76 399L289 324 507 404M289 324V112" />
        <circle cx="289" cy="112" r="4" />
        <circle cx="76" cy="399" r="4" />
        <circle cx="507" cy="404" r="4" />
      </svg>
      <span className="constellation-note">
        <span />
        DESIGNED TO WORK WITH YOU
      </span>
      <div className="hero-mini mini-accountant accent-gold">
        <Avatar agent={AGENTS[1]} />
        <div>
          <span className="mini-code">AC / FINANCE</span>
          <strong>Accountant</strong>
        </div>
      </div>
      <AvatarGreeting agent={AGENTS[0]} className="hero-avatar" hero />
      <div className="hero-role-label">
        <span className="label-spark" aria-hidden="true">
          ✦
        </span>
        <div>
          <span>MEET YOUR NEXT HIRE</span>
          <strong>AI Social Media Manager</strong>
        </div>
        <ArrowUpRight size={19} aria-hidden="true" />
      </div>
      <div className="hero-mini mini-support accent-cyan">
        <Avatar agent={AGENTS[2]} />
        <div>
          <span className="mini-code">CC / EXPERIENCE</span>
          <strong>Customer Care</strong>
        </div>
      </div>
      <div className="constellation-footer">
        <span>
          <HandHint />
          Hover, focus, or tap to say hello.
        </span>
        <span>HUMAN-LED. AI-ENABLED.</span>
      </div>
    </div>
  );
}
function HandHint() {
  return <Sparkles size={15} aria-hidden="true" />;
}
function EmployeeCard({ agent, onDetails, onInquiry }) {
  return (
    <article
      id={`employee-${agent.id}`}
      className={`employee-card accent-${agent.accent}`}
    >
      <div className="employee-card-top">
        <span className="employee-code">
          {agent.code} <span>/ AI EMPLOYEE</span>
        </span>
        <button
          className="icon-button"
          aria-label={`View ${agent.short} details`}
          onClick={() => onDetails(agent)}
        >
          <ArrowUpRight size={20} />
        </button>
      </div>
      <AvatarGreeting agent={agent} />
      <div className="employee-card-content">
        <span className="role-category">{agent.category}</span>
        <h3>{agent.short}</h3>
        <p>{agent.summary}</p>
        <div className="role-skills">
          {agent.tools.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
      </div>
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
        <div>
          <span className="eyebrow">REAL ROLES. EXTRAORDINARY TEAMMATES.</span>
          <h2>
            Good people deserve
            <br />
            <span>great AI colleagues.</span>
          </h2>
        </div>
        <p>
          Meet the specialists for the work you do every day. Hire a role. Build
          it around your workflow. Bring a whole team together.
        </p>
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
        <span>
          Role previews are illustrative. We agree on capabilities and tools
          with you.
        </span>
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
          <span className="eyebrow">YOUR FRAMEWORK. YOUR FREEDOM.</span>
          <h2>
            Different engines.
            <br />
            <span>One shared ambition.</span>
          </h2>
        </div>
        <p>
          Build with your preferred framework or agent platform. We shape the
          architecture around your team, your tools, and the way you work.
        </p>
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
        <span className="research-date">RESEARCHED 15 OCT 2026</span>
      </div>
      <div className="framework-grid">
        {frameworks.slice(0, expanded ? frameworks.length : 8).map((f) => (
          <article className="framework-card" key={f.name}>
            <div className="framework-mark" aria-hidden="true">
              {f.short}
            </div>
            <div>
              <h3>{f.name}</h3>
              <p>{f.detail}</p>
            </div>
            <div className="framework-actions">
              <a
                href={f.url}
                target="_blank"
                rel="noreferrer"
                aria-label={`${f.name} official documentation (opens in new tab)`}
              >
                Docs <ExternalLink size={13} aria-hidden="true" />
              </a>
              <button
                onClick={() =>
                  onInquiry({
                    intent: "Build",
                    role: "Custom AI employee",
                    framework: f.name,
                  })
                }
                aria-label={`Build with ${f.name}`}
              >
                Build <ArrowUpRight size={14} aria-hidden="true" />
              </button>
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
        <div>
          <span className="eyebrow">THE CONNECTION LAYER</span>
          <h3>
            Independent agents.
            <br />
            Connected possibilities.
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
          >
            <span className="protocol-icon">
              <Radio size={24} aria-hidden="true" />
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
          >
            <span className="protocol-icon">
              <Workflow size={24} aria-hidden="true" />
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
        Frameworks and platforms are build options, not partner endorsements.
        Cross-framework connections depend on supported APIs, protocols,
        permissions, and testing. Have another stack?{" "}
        <button
          className="text-button"
          onClick={() =>
            onInquiry({
              intent: "Build",
              framework: "Other / my existing setup",
            })
          }
        >
          Tell us about it <ArrowUpRight size={15} aria-hidden="true" />
        </button>
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
              ["How it works", "#how-it-works"],
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
            <span className="hero-eyebrow">
              <span aria-hidden="true">✦</span> INTELLIGENCE, WITH PERSONALITY.
            </span>
            <h1>
              Your next hire.
              <br />
              <span>Beyond ordinary.</span>
            </h1>
            <p>
              Meet AI employees built for real work. From balancing the books to
              growing your brand, find your specialist—or build one that’s
              entirely yours.
            </p>
            <div className="hero-actions">
              <a
                href="#employees"
                className="button button-solid intent-primary"
              >
                Meet your AI employees <ArrowUpRight size={19} />
              </a>
              <button
                className="hero-secondary text-button"
                onClick={() => openInquiry()}
              >
                Build a custom agent <ArrowRight size={19} />
              </button>
            </div>
            <div className="hero-trust">
              <span>
                <ShieldCheck size={16} aria-hidden="true" />
                Your goals. Your direction.
              </span>
              <span className="trust-divider" />
              <span>Made for the way Bangladesh works.</span>
            </div>
          </div>
          <HeroConstellation />
        </section>
        <section
          className="audience-section container"
          aria-label="Companies Organizations Institutions or Personal"
        >
          <span className="eyebrow">ONE PLATFORM. YOUR KIND OF WORK.</span>
          <div className="audience-list">
            {AUDIENCES.map((a, i) => {
              const Icon = AUDIENCE_ICONS[i];
              return (
                <React.Fragment key={a}>
                  {i === 3 && <span className="audience-or">or</span>}
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
          <div className="custom-copy">
            <span className="eyebrow">A ROLE IS ONLY THE BEGINNING.</span>
            <h2>
              Built around your work.
              <br />
              <span>Not the other way around.</span>
            </h2>
            <p>
              Your approvals, your language, your way of getting things done. We
              turn your everyday workflows into a brief for an AI employee—or a
              coordinated swarm.
            </p>
            <ul>
              <li>
                <Check size={18} aria-hidden="true" />
                Bangla and English workflows scoped to your team
              </li>
              <li>
                <Check size={18} aria-hidden="true" />
                Your tools, preferred framework, and knowledge
              </li>
              <li>
                <Check size={18} aria-hidden="true" />
                Human checkpoints for decisions that matter
              </li>
            </ul>
            <Button onClick={() => openInquiry()}>
              Build something that fits <ArrowUpRight size={18} />
            </Button>
          </div>
          <div className="custom-blueprint">
            <span className="blueprint-label">
              YOUR AI EMPLOYEE / CUSTOM CONFIGURATION
            </span>
            <div className="blueprint-orbit">
              <Avatar agent={AGENTS[11]} />
              <span className="blueprint-node node-language">
                বাংলা + English
              </span>
              <span className="blueprint-node node-tools">
                <Workflow size={16} aria-hidden="true" />
                Your tools
              </span>
              <span className="blueprint-node node-human">
                <ShieldCheck size={16} aria-hidden="true" />
                Human direction
              </span>
            </div>
            <div className="blueprint-caption">
              <Sparkles size={18} aria-hidden="true" />
              <span>A little more you. A lot more possible.</span>
            </div>
          </div>
        </section>
        <FrameworkSection onInquiry={openInquiry} />
        <section
          className="process-section container section-space"
          id="how-it-works"
        >
          <div className="section-heading">
            <div>
              <span className="eyebrow">
                FROM NICE TO MEET YOU, TO LET’S GET TO WORK.
              </span>
              <h2>
                A better way to work.
                <br />
                <span>Starts with a conversation.</span>
              </h2>
            </div>
          </div>
          <div className="process-grid">
            {[
              {
                title: "Choose your teammate.",
                text: "Find the role you need, or tell us about a workflow that deserves its own kind of intelligence.",
              },
              {
                title: "Make it your own.",
                text: "Agree on the responsibilities, language, framework, tools, and human approvals. Start with a focused scope.",
              },
              {
                title: "Build. Review. Grow.",
                text: "Validate the workflow with your team before rollout. Expand when the work and the results make sense.",
              },
            ].map((p, i) => (
              <article key={p.title}>
                <span className="process-number">
                  0{i + 1}
                  <ArrowRight size={20} aria-hidden="true" />
                </span>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="faq-section container section-space" id="questions">
          <div>
            <span className="eyebrow">CURIOUS? GOOD.</span>
            <h2>
              The human
              <br />
              <span>questions.</span>
            </h2>
            <p>
              Big ideas deserve clear answers.
              <br />
              <a href="mailto:automicanhq@gmail.com" className="text-button">
                Talk to the humans <ArrowUpRight size={17} />
              </a>
            </p>
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
        <section className="final-cta container">
          <span className="cta-emblem">
            <Orbit size={45} strokeWidth={1.3} aria-hidden="true" />
          </span>
          <div>
            <span className="eyebrow">
              HUMAN AMBITION. EXTRAORDINARY COMPANY.
            </span>
            <h2>Your next chapter has a new teammate.</h2>
          </div>
          <Button onClick={() => openInquiry()}>
            Let’s build it <ArrowUpRight size={19} />
          </Button>
        </section>
      </main>
      <footer className="site-footer container">
        <div className="footer-top">
          <div>
            <Brand />
            <p>AI employees. Human ambition.</p>
          </div>
          <nav aria-label="Footer navigation">
            <a href="#employees">Meet the employees</a>
            <a href="#frameworks">Frameworks & platforms</a>
            <a href="mailto:automicanhq@gmail.com">
              Get in touch <ArrowUpRight size={15} />
            </a>
          </nav>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} Automican. All rights reserved.
          </span>
          <span>
            Built for companies, organizations, institutions, and personal
            ambition.
          </span>
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
                <span className="eyebrow">YOUR NEW TEAMMATE</span>
                <p>{detail.greeting}</p>
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
