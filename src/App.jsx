import React, { useEffect, useRef, useState } from "react";
import {
  Compass,
  Code2,
  TrendingUp,
  ArrowUpRight,
  ArrowRight,
  Plus,
  Minus,
  Network,
  Sparkles,
  ShieldCheck,
  Workflow,
  Building2,
  Landmark,
  Users,
  ChevronRight,
  ChevronLeft,
  Search,
  X,
  ArrowDown,
  Menu,
  Layers3,
  Check,
} from "lucide-react";
import { AGENTS, DEPARTMENTS } from "./data";
import {
  Button,
  DepartmentIcon,
  Dialog,
  TeamDetail,
  Inquiry,
  Status,
} from "./components";

const TEAM_COPY = {
  Origin: {
    category: "RESEARCH & STRATEGY",
    headline: "Find your next big move.",
    description:
      "From a first idea to a clear direction. Put research, analysis, and strategy on the same team.",
    tags: ["Research", "Market intelligence", "Strategy"],
    result: "A clear plan to move forward.",
  },
  Development: {
    category: "PRODUCT & ENGINEERING",
    headline: "Turn ambition into a build.",
    description:
      "Bring product, design, engineering, and quality together to take your idea further.",
    tags: ["Product", "Design", "Engineering"],
    result: "One team from brief to delivery.",
  },
  Growth: {
    category: "MARKETING & REACH",
    headline: "Give your growth a team.",
    description:
      "Connect the dots between your audience, your content, and your next campaign.",
    tags: ["Content", "Campaigns", "Discovery"],
    result: "A more connected growth effort.",
  },
  Revenue: {
    category: "SALES & OPERATIONS",
    headline: "Keep business moving.",
    description:
      "Bring sales, finance, and everyday operations into one coordinated workflow.",
    tags: ["Sales", "Operations", "Finance"],
    result: "Less friction. More forward motion.",
  },
};
const FAQS = [
  [
    "What is an AI agent swarm?",
    "A swarm is a group of specialized AI agents working toward a shared goal. Instead of asking a single assistant to do everything, a coordinating agent connects roles such as researcher, designer, engineer, and analyst. People define the goals and decide the scope of the work.",
  ],
  [
    "Can I hire a team or just one agent?",
    "You can start with a specialized role, explore a department team, or discuss a custom combination. Choose a team above to see its roles, then prepare an inquiry describing the work you need help with. The final team and engagement are agreed before work begins.",
  ],
  [
    "Can you build for my organization’s workflow?",
    "Custom builds can be scoped for offices, companies, organizations, and institutions. Tell us about your current process, the tools you use, and the result you want. Integrations, access requirements, oversight, and rollout are part of that scoping conversation.",
  ],
  [
    "How are pricing and timelines decided?",
    "Pricing and timelines depend on the agreed roles, workflow complexity, integrations, and support needs. Start with a brief so the engagement can be scoped. This site does not collect payments or automatically begin a paid engagement.",
  ],
];
function Brand({ footer = false }) {
  return (
    <a
      className={`brand ${footer ? "footer-brand" : ""}`}
      href="#top"
      aria-label="Automican home"
    >
      <span className="brand-mark" aria-hidden="true">
        <Network size={25} strokeWidth={1.65} />
      </span>
      automican<span className="brand-period">.</span>
    </a>
  );
}
function SwarmMap({ onTeam }) {
  return (
    <div
      className="swarm-map"
      aria-label="Four departments coordinated by one orchestrator"
    >
      <div className="map-topline">
        <span>
          <span className="status-dot" />
          THE SWARM, IN SYNC
        </span>
        <span>30 SPECIALIST ROLES</span>
      </div>
      <div className="network-canvas">
        <svg
          className="network-lines"
          viewBox="0 0 600 470"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="300" cy="234" r="89" className="orbit-inner" />
          <circle cx="300" cy="234" r="164" className="orbit-outer" />
          <path
            d="M300 234L119 100M300 234L489 117M300 234L111 350M300 234L477 363"
            className="network-path"
          />
          <path
            d="M119 100Q300 -35 489 117M489 117Q622 234 477 363M477 363Q300 490 111 350M111 350Q-9 234 119 100"
            className="network-path faint"
          />
          <circle cx="300" cy="70" r="4" className="signal-dot" />
          <circle cx="465" cy="234" r="4" className="signal-dot" />
          <circle cx="300" cy="398" r="4" className="signal-dot" />
          <circle cx="135" cy="234" r="4" className="signal-dot" />
        </svg>
        <div className="orchestrator">
          <div className="orchestrator-icon">
            <Network size={35} strokeWidth={1.25} aria-hidden="true" />
          </div>
          <strong>
            One shared
            <br />
            intelligence.
          </strong>
          <span>THE ORCHESTRATOR</span>
        </div>
        {DEPARTMENTS.map((d, i) => (
          <button
            key={d}
            className={`map-node map-node-${i} tone-${d.toLowerCase()}`}
            onClick={() => onTeam(d)}
            aria-label={`Explore the ${d} team`}
          >
            <DepartmentIcon department={d} />
            <div>
              <strong>{d}</strong>
              <span>
                {AGENTS.filter((a) => a.department === d).length} specialist
                roles
              </span>
            </div>
            <ArrowUpRight size={13} aria-hidden="true" />
          </button>
        ))}
        <span className="map-label label-left">HUMAN DIRECTION</span>
        <span className="map-label label-right">COLLECTIVE EXECUTION</span>
      </div>
      <div className="map-bottomline">
        <span>
          <Layers3 size={14} aria-hidden="true" /> Specialized individually.
          Aligned collectively.
        </span>
        <span className="map-cross" aria-hidden="true">
          +
        </span>
      </div>
    </div>
  );
}
function Registry({ onAgent }) {
  const read = () => {
    const p = new URLSearchParams(location.search);
    return {
      query: p.get("q") || "",
      department:
        DEPARTMENTS.includes(p.get("department")) ||
        p.get("department") === "System"
          ? p.get("department")
          : "",
      page: Math.max(1, Number.parseInt(p.get("page") || "1") || 1),
      sort: p.get("sort") === "desc" ? "desc" : "asc",
    };
  };
  const [state, setState] = useState(read);
  const [draftQuery, setDraftQuery] = useState(state.query);
  const [expanded, setExpanded] = useState(() => Boolean(location.search));
  const composing = useRef(false);
  const searchRef = useRef(null);
  const update = (patch, replace = false) => {
    const next = { ...state, ...patch };
    const url = new URL(location.href);
    for (const [key, param] of [
      ["query", "q"],
      ["department", "department"],
      ["page", "page"],
      ["sort", "sort"],
    ]) {
      if (
        next[key] &&
        next[key] !== 1 &&
        !(key === "sort" && next[key] === "asc")
      )
        url.searchParams.set(param, next[key]);
      else url.searchParams.delete(param);
    }
    history[replace ? "replaceState" : "pushState"]({}, "", url);
    setState(next);
  };
  useEffect(() => {
    const restore = () => {
      const next = read();
      setState(next);
      setDraftQuery(next.query);
      if (location.search) setExpanded(true);
    };
    window.addEventListener("popstate", restore);
    return () => window.removeEventListener("popstate", restore);
  }, []);
  const filtered = AGENTS.filter(
    (a) =>
      (!state.department || a.department === state.department) &&
      `${a.designation} ${a.role} ${a.department}`
        .toLowerCase()
        .includes(state.query.toLowerCase()),
  ).sort(
    (a, b) =>
      a.designation.localeCompare(b.designation, "en-US") *
      (state.sort === "asc" ? 1 : -1),
  );
  const pages = Math.max(1, Math.ceil(filtered.length / 5));
  const page = Math.min(state.page, pages);
  useEffect(() => {
    if (state.page > pages) update({ page: pages }, true);
  }, [pages, state.page]);
  const clear = () => {
    setDraftQuery("");
    update({ query: "", page: 1 });
    searchRef.current?.focus();
  };
  return (
    <div className="registry">
      <button
        className="registry-toggle"
        aria-expanded={expanded}
        aria-controls="registry-content"
        onClick={() => setExpanded((v) => !v)}
      >
        <span>
          <Network size={20} aria-hidden="true" />
          <strong>Meet every specialist in the swarm</strong>
          <span className="count-badge">30 roles</span>
        </span>
        {expanded ? (
          <Minus size={20} aria-hidden="true" />
        ) : (
          <Plus size={20} aria-hidden="true" />
        )}
      </button>
      <div id="registry-content" hidden={!expanded}>
        <div className="registry-toolbar">
          <div className="search-field">
            <Search size={17} aria-hidden="true" />
            <input
              type="search"
              aria-label="Search agent roles"
              placeholder="Find a role or capability…"
              ref={searchRef}
              value={draftQuery}
              onCompositionStart={() => {
                composing.current = true;
              }}
              onCompositionEnd={(e) => {
                composing.current = false;
                update({ query: e.currentTarget.value, page: 1 }, true);
              }}
              onChange={(e) => {
                setDraftQuery(e.target.value);
                if (!composing.current)
                  update({ query: e.target.value, page: 1 }, true);
              }}
            />
            {draftQuery && (
              <button
                className="icon-button"
                onClick={clear}
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <label className="filter-select">
            <span className="sr-only">Filter by department</span>
            <select
              value={state.department}
              onChange={(e) => update({ department: e.target.value, page: 1 })}
            >
              <option value="">All departments</option>
              <option>System</option>
              {DEPARTMENTS.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </label>
        </div>
        <div className="table-scroll">
          <table>
            <caption className="sr-only">
              Automican agent roles and capabilities
            </caption>
            <thead>
              <tr>
                <th
                  scope="col"
                  aria-sort={state.sort === "asc" ? "ascending" : "descending"}
                >
                  <button
                    className="sort-button"
                    onClick={() =>
                      update({
                        sort: state.sort === "asc" ? "desc" : "asc",
                        page: 1,
                      })
                    }
                  >
                    Agent role{" "}
                    <ArrowDown
                      size={13}
                      className={state.sort === "desc" ? "rotated" : ""}
                      aria-hidden="true"
                    />
                  </button>
                </th>
                <th scope="col">Department</th>
                <th scope="col">Capabilities</th>
                <th scope="col">
                  <span className="sr-only">Details</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice((page - 1) * 5, page * 5).map((a) => (
                <tr key={a.designation}>
                  <td>
                    <button className="agent-name" onClick={() => onAgent(a)}>
                      {a.designation}
                    </button>
                  </td>
                  <td>
                    <span
                      className={`department-label tone-${a.department.toLowerCase()}`}
                    >
                      <span />
                      {a.department}
                    </span>
                  </td>
                  <td className="capability-cell">{a.role}</td>
                  <td>
                    <button
                      className="icon-button"
                      onClick={() => onAgent(a)}
                      aria-label={`View ${a.designation}`}
                    >
                      <ArrowUpRight size={17} />
                    </button>
                  </td>
                </tr>
              ))}
              {!filtered.length && (
                <tr>
                  <td colSpan={4}>
                    <div className="no-results">
                      <Search size={25} aria-hidden="true" />
                      <strong>No matching roles</strong>
                      <p>Try another capability or clear your filters.</p>
                      <Button
                        emphasis="outline"
                        intent="neutral"
                        onClick={() => {
                          setDraftQuery("");
                          update({ query: "", department: "", page: 1 });
                          searchRef.current?.focus();
                        }}
                      >
                        Clear filters
                      </Button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="table-footer">
          <span role="status">
            {filtered.length
              ? `${(page - 1) * 5 + 1}–${Math.min(page * 5, filtered.length)} of ${filtered.length} roles`
              : "0 roles"}
          </span>
          <nav aria-label="Agent registry pages">
            <button
              className="icon-button"
              disabled={page === 1}
              onClick={() => update({ page: page - 1 })}
              aria-label="Previous page"
            >
              <ChevronLeft size={18} />
            </button>
            <span>
              Page {page} of {pages}
            </span>
            <button
              className="icon-button"
              disabled={page === pages}
              onClick={() => update({ page: page + 1 })}
              aria-label="Next page"
            >
              <ChevronRight size={18} />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}
export default function App() {
  const [detail, setDetail] = useState(null);
  const [agent, setAgent] = useState(null);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [initialTeam, setInitialTeam] = useState("Custom team");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [status, setStatus] = useState("");
  const inquiryTrigger = useRef(null);
  const detailTrigger = useRef(null);
  const menuRef = useRef(null);
  const openDetail = (team) => {
    detailTrigger.current = document.activeElement;
    setDetail(team);
  };
  const openAgent = (role) => {
    detailTrigger.current = document.activeElement;
    setAgent(role);
  };
  useEffect(() => {
    if (!mobileOpen) return;
    const escape = (e) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        menuRef.current?.focus();
      }
    };
    document.addEventListener("keydown", escape);
    return () => document.removeEventListener("keydown", escape);
  }, [mobileOpen]);
  const hire = (team = "Custom team", role = null) => {
    inquiryTrigger.current = document.activeElement.closest("dialog")
      ? detailTrigger.current
      : document.activeElement;
    setInitialTeam(role || (team === "Custom team" ? team : `${team} team`));
    setDetail(null);
    setAgent(null);
    setInquiryOpen(true);
    setMobileOpen(false);
  };
  useEffect(() => {
    document.title = "Automican — AI agent teams, built around you";
  }, []);
  useEffect(() => {
    if (!status) return;
    const timer = setTimeout(() => setStatus(""), 6000);
    return () => clearTimeout(timer);
  }, [status]);
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
            aria-label="Main navigation"
            className={`main-nav ${mobileOpen ? "is-open" : ""}`}
          >
            <a href="#swarm" onClick={() => setMobileOpen(false)}>
              The swarm
            </a>
            <a href="#teams" onClick={() => setMobileOpen(false)}>
              Agent teams
            </a>
            <a href="#how-it-works" onClick={() => setMobileOpen(false)}>
              How it works
            </a>
            <a href="#custom" onClick={() => setMobileOpen(false)}>
              Custom builds <span className="nav-new">FOR YOU</span>
            </a>
          </nav>
          <div className="header-actions">
            <Button emphasis="outline" intent="neutral" onClick={() => hire()}>
              Let’s talk <ArrowUpRight size={16} />
            </Button>
            <button
              ref={menuRef}
              className="icon-button mobile-menu"
              aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>
      <main id="main">
        <section className="hero container" id="swarm">
          <div className="hero-copy">
            <div className="hero-eyebrow">
              <span className="little-star" aria-hidden="true">
                ✳
              </span>{" "}
              HUMAN AMBITION. AGENT EXECUTION.
            </div>
            <h1>
              Big ambitions.
              <br />
              Meet your
              <br />
              <span>AI workforce.</span>
            </h1>
            <p>
              A swarm of specialist AI agents, working as one.
              <br className="desktop-break" /> Hire a team or build your
              own—around your people,
              <br className="desktop-break" /> your workflows, and what comes
              next.
            </p>
            <div className="hero-actions">
              <a className="button button-solid intent-primary" href="#teams">
                Find your agent team <ArrowUpRight size={18} />
              </a>
              <button className="text-button" onClick={() => hire()}>
                Build something custom <ArrowRight size={17} />
              </button>
            </div>
            <div className="hero-note">
              <span className="tiny-stack" aria-hidden="true">
                <Compass />
                <Code2 />
                <TrendingUp />
              </span>
              <span>Specialized minds. One shared mission.</span>
            </div>
          </div>
          <SwarmMap onTeam={openDetail} />
        </section>
        <section
          className="audience-strip container"
          aria-label="Who we build for"
        >
          <span className="eyebrow">
            A NEW WAY TO WORK.
            <br />
            <strong>FOR EVERY KIND OF ORGANIZATION.</strong>
          </span>
          <div>
            <span>
              <Building2 aria-hidden="true" size={20} />
              Companies
            </span>
            <span>
              <Workflow aria-hidden="true" size={20} />
              Offices
            </span>
            <span>
              <Users aria-hidden="true" size={20} />
              Organizations
            </span>
            <span>
              <Landmark aria-hidden="true" size={20} />
              Institutions
            </span>
          </div>
        </section>
        <section className="teams-section container section-space" id="teams">
          <div className="section-heading">
            <div>
              <span className="eyebrow">THE RIGHT MINDS FOR THE MISSION</span>
              <h2>
                Don’t just add AI.
                <br />
                Add a team.
              </h2>
            </div>
            <p>
              From the first spark to the next stage of growth,
              <br className="desktop-break" /> find the specialists who move
              your work forward.
            </p>
          </div>
          <div className="teams-grid">
            {DEPARTMENTS.map((d) => (
              <article className={`team-card tone-${d.toLowerCase()}`} key={d}>
                <div className="team-card-top">
                  <DepartmentIcon department={d} size={22} />
                  <span>
                    {AGENTS.filter((a) => a.department === d).length} ROLES
                  </span>
                </div>
                <span className="team-category">{TEAM_COPY[d].category}</span>
                <h3>
                  {d}
                  <span> team</span>
                </h3>
                <p>{TEAM_COPY[d].description}</p>
                <div className="team-tags">
                  {TEAM_COPY[d].tags.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
                <button className="team-explore" onClick={() => openDetail(d)}>
                  Explore team <ArrowUpRight size={19} aria-hidden="true" />
                </button>
              </article>
            ))}
          </div>
          <Registry onAgent={openAgent} />
        </section>
        <section className="custom-section container section-space" id="custom">
          <div className="custom-visual" aria-hidden="true">
            <div className="custom-grid">
              <span className="custom-chip chip-a">
                <Building2 size={22} />
                Your organization
              </span>
              <div className="custom-core">
                <Network size={41} strokeWidth={1.4} />
              </div>
              <span className="custom-chip chip-b">
                <Workflow size={17} />
                Your workflow
              </span>
              <span className="custom-chip chip-c">
                <ShieldCheck size={17} />
                Your direction
              </span>
              <span className="custom-chip chip-d">
                <Sparkles size={17} />
                Your agent team
              </span>
              <svg viewBox="0 0 450 360" fill="none">
                <path d="M225 90V175M225 175L80 210M225 175L345 255M225 175L130 310" />
              </svg>
              <span className="custom-caption">
                BUILT AROUND YOU, BY DESIGN.
              </span>
            </div>
          </div>
          <div className="custom-copy">
            <span className="eyebrow">
              <span className="status-dot" /> YOUR WORK. YOUR WAY.
            </span>
            <h2>
              Your organization
              <br />
              is one of a kind.
              <br />
              <span>Your AI should be, too.</span>
            </h2>
            <p>
              Off-the-shelf doesn’t fit every ambition. Let’s shape an agent
              swarm around the way your organization actually works.
            </p>
            <ul>
              <li>
                <Check size={16} aria-hidden="true" />A team shaped around your
                goals and processes
              </li>
              <li>
                <Check size={16} aria-hidden="true" />
                Tools and integrations scoped to your environment
              </li>
              <li>
                <Check size={16} aria-hidden="true" />
                Human direction, from planning to rollout
              </li>
            </ul>
            <Button onClick={() => hire()}>
              Request a custom build <ArrowUpRight size={18} />
            </Button>
          </div>
        </section>
        <section
          className="process-section container section-space"
          id="how-it-works"
        >
          <div className="section-heading">
            <div>
              <span className="eyebrow">FROM WHAT IF TO WHAT’S NEXT</span>
              <h2>
                Your goal.
                <br />
                Our starting point.
              </h2>
            </div>
            <p>
              You bring the ambition. Together, we define
              <br className="desktop-break" /> the team, the workflow, and the
              way forward.
            </p>
          </div>
          <div className="process-grid">
            {[
              {
                title: "Tell us the mission.",
                text: "Share the work you want to improve, the bottleneck you want to remove, or the idea you want to bring to life.",
                icon: "01",
              },
              {
                title: "Shape your swarm.",
                text: "Explore a ready-defined team or work with us to scope the roles, tools, and human checkpoints you need.",
                icon: "02",
              },
              {
                title: "Build the way forward.",
                text: "Agree on the scope and rollout plan. Start with a focused workflow, then decide what comes next.",
                icon: "03",
              },
            ].map((p) => (
              <article key={p.icon}>
                <span className="process-number">
                  {p.icon}
                  <ArrowRight size={19} aria-hidden="true" />
                </span>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="faq-section container section-space" id="questions">
          <div>
            <span className="eyebrow">A LITTLE MORE CLARITY</span>
            <h2>
              Good questions.
              <br />
              Straight answers.
            </h2>
            <p>
              Still thinking it through?
              <br />
              <button className="text-button" onClick={() => hire()}>
                Let’s start a conversation <ArrowUpRight size={16} />
              </button>
            </p>
          </div>
          <div className="faq-list">
            {FAQS.map(([q, a]) => (
              <details key={q}>
                <summary>
                  {q}
                  <Plus className="faq-plus" size={19} aria-hidden="true" />
                </summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </section>
        <section className="final-cta container">
          <div className="cta-mark" aria-hidden="true">
            <Network size={37} strokeWidth={1.3} />
          </div>
          <div>
            <span className="eyebrow">YOUR NEXT CHAPTER IS A TEAM EFFORT.</span>
            <h2>Put your ambition in motion.</h2>
          </div>
          <Button onClick={() => hire()}>
            Build your agent team <ArrowUpRight size={19} />
          </Button>
        </section>
      </main>
      <footer className="container site-footer">
        <div className="footer-top">
          <div>
            <Brand footer />
            <p>Independent minds. Collective possibility.</p>
          </div>
          <a href="#teams">
            Explore teams <ArrowUpRight size={14} />
          </a>
          <a href="#custom">
            Custom builds <ArrowUpRight size={14} />
          </a>
          <a href="#questions">
            Questions <ArrowUpRight size={14} />
          </a>
          <a className="back-top" href="mailto:automicanhq@gmail.com">
            Get in touch <ArrowUpRight size={14} />
          </a>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} Automican. All rights reserved.
          </span>
          <span>Human ambition. Agent execution.</span>
        </div>
      </footer>
      <Dialog
        open={!!detail}
        onClose={() => setDetail(null)}
        title={`${detail || ""} team`}
        description={detail ? TEAM_COPY[detail].headline : ""}
      >
        {detail && <TeamDetail team={detail} onHire={hire} />}
      </Dialog>
      <Dialog
        open={!!agent}
        onClose={() => setAgent(null)}
        title={agent?.designation || "Agent role"}
        description={
          agent
            ? `Part of the ${agent.department === "System" ? "coordination layer" : `${agent.department} team`}.`
            : ""
        }
      >
        {agent && (
          <div className="agent-detail">
            <DepartmentIcon department={agent.department} size={26} />
            <h3>What this role brings</h3>
            <p>{agent.role}</p>
            <p className="muted">
              Discuss this role on its own or as part of a coordinated team.
              Capabilities and tools are agreed during scoping.
            </p>
            <Button
              onClick={() =>
                hire(
                  agent.department === "System"
                    ? "Custom team"
                    : agent.department,
                  agent.designation,
                )
              }
            >
              Discuss this role <ArrowUpRight size={17} />
            </Button>
          </div>
        )}
      </Dialog>
      <Inquiry
        open={inquiryOpen}
        initialTeam={initialTeam}
        onClose={() => {
          setInquiryOpen(false);
          requestAnimationFrame(() => {
            if (
              inquiryTrigger.current?.isConnected &&
              !inquiryTrigger.current.closest("dialog")
            )
              inquiryTrigger.current.focus();
          });
        }}
        onStatus={setStatus}
      />
      <Status message={status} />
    </>
  );
}
