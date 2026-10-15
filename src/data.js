export const AGENTS = [
  {
    designation: "Main Orchestrator",
    department: "System",
    role: "Cross-department coordination, validation",
  },
  {
    designation: "Origin Chief",
    department: "Origin",
    role: "Origin Department autonomously manage (sub-orchestrator)",
  },
  {
    designation: "Idea Architect",
    department: "Origin",
    role: "Ideation, concept design, framing, brainstorming",
  },
  {
    designation: "Research Analyst",
    department: "Origin",
    role: "Deep research, trend scan, signals, synthesis",
  },
  {
    designation: "Market Analyst",
    department: "Origin",
    role: "Competitor intel, market sizing, opportunity mapping",
  },
  {
    designation: "Risk Analyst",
    department: "Origin",
    role: "Feasibility analysis, risk matrix, assumptions, guardrails, go/no-go",
  },
  {
    designation: "Strategy Architect",
    department: "Origin",
    role: "Master plan, roadmap, priorities, execution plan, positioning",
  },
  {
    designation: "Systems Architect",
    department: "Origin",
    role: "System design, workflows, architecture blueprints",
  },
  {
    designation: "Development Chief",
    department: "Development",
    role: "Development Department autonomously manage (sub-orchestrator)",
  },
  {
    designation: "Product Manager",
    department: "Development",
    role: "Feature specs, PRD, acceptance criteria, roadmap, prioritization, user stories",
  },
  {
    designation: "UX/UI Designer",
    department: "Development",
    role: "Information architecture, user flows, wireframes, UI systems, design QA",
  },
  {
    designation: "Frontend Engineer",
    department: "Development",
    role: "Web UI, state management, components, performance, accessibility",
  },
  {
    designation: "Backend Engineer",
    department: "Development",
    role: "APIs, authentication, DB schema, queues, caching, scalability, logging",
  },
  {
    designation: "DevOps Engineer",
    department: "Development",
    role: "CI/CD, deployment, Docker, monitoring, secrets, cost management",
  },
  {
    designation: "QA Engineer",
    department: "Development",
    role: "Test plans, regression testing, E2E automation, bug triage, release validation",
  },
  {
    designation: "AI Engineer",
    department: "Development",
    role: "LLM/agent orchestration, RAG, evals, prompt & context engineering, tool contracts",
  },
  {
    designation: "Data Engineer",
    department: "Development",
    role: "Analytics events, pipelines, dashboards, attribution, data quality",
  },
  {
    designation: "Growth Chief",
    department: "Growth",
    role: "Growth Department autonomously manage (sub-orchestrator)",
  },
  {
    designation: "Marketing Specialist",
    department: "Growth",
    role: "Paid campaigns, Meta/Google Ads, performance diagnosis, KPI forecasting",
  },
  {
    designation: "Content Strategist",
    department: "Growth",
    role: "Content creation, social copy, multi-platform content, newsletters, calendars",
  },
  {
    designation: "Creative Engineer",
    department: "Growth",
    role: "AI images/videos, design systems, ad creatives, brand assets, visual strategy",
  },
  {
    designation: "Market Researcher",
    department: "Growth",
    role: "Competitive intelligence, TAM/SAM/SOM, ICP, trend research, opportunity analysis",
  },
  {
    designation: "Social Manager",
    department: "Growth",
    role: "Publishing, scheduling, community management, DM handling, analytics",
  },
  {
    designation: "Optimization Specialist",
    department: "Growth",
    role: "SEO, AEO, GEO, AgentEO (AI discoverability optimization)",
  },
  {
    designation: "Revenue Chief",
    department: "Revenue",
    role: "Revenue Department autonomously manage (sub-orchestrator)",
  },
  {
    designation: "Sales Executive",
    department: "Revenue",
    role: "Outreach, qualification, follow-ups, demos, negotiation, closing",
  },
  {
    designation: "Deal Specialist",
    department: "Revenue",
    role: "Pricing, proposals, packaging, discount approval",
  },
  {
    designation: "Operations Executive",
    department: "Revenue",
    role: "CRM, pipeline, forecasting, sales playbooks",
  },
  {
    designation: "Billing Executive",
    department: "Revenue",
    role: "Invoicing, payments, collections, renewals",
  },
  {
    designation: "Finance Manager",
    department: "Revenue",
    role: "Bookkeeping, P&L, cashflow, budgeting, runway, unit economics",
  },
];

export const DEPARTMENTS = ["Origin", "Development", "Growth", "Revenue"];
export const DEPARTMENT_INFO = {
  System: {
    short: "OR",
    label: "Coordinate the collective",
    description: "Align every department around one shared objective.",
  },
  Origin: {
    short: "OG",
    label: "Find the right direction",
    description: "Turn ideas and research into an actionable strategy.",
  },
  Development: {
    short: "DV",
    label: "Bring ideas to life",
    description: "Design, build, and validate your next product.",
  },
  Growth: {
    short: "GR",
    label: "Build your momentum",
    description: "Connect content, campaigns, and audience insights.",
  },
  Revenue: {
    short: "RV",
    label: "Make progress count",
    description: "Bring sales, operations, and finance into alignment.",
  },
};
