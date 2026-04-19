import React, { useState, useEffect, useRef } from 'react';
import {
  Terminal,
  Activity,
  Network,
  Shield,
  ChevronRight,
  Zap,
  RefreshCw,
  Globe,
  Send
} from 'lucide-react';

// --- ResForce Agent Database ---
const ALL_AGENTS = [
  { designation: 'Main Orchestrator', department: 'System', role: 'Cross-department coordination, validation' },
  { designation: 'Origin Chief', department: 'Origin', role: 'Origin Department autonomously manage (sub-orchestrator)' },
  { designation: 'Idea Architect', department: 'Origin', role: 'Ideation, concept design, framing, brainstorming' },
  { designation: 'Research Analyst', department: 'Origin', role: 'Deep research, trend scan, signals, synthesis' },
  { designation: 'Market Analyst', department: 'Origin', role: 'Competitor intel, market sizing, opportunity mapping' },
  { designation: 'Risk Analyst', department: 'Origin', role: 'Feasibility analysis, risk matrix, assumptions, guardrails, go/no-go' },
  { designation: 'Strategy Architect', department: 'Origin', role: 'Master plan, roadmap, priorities, execution plan, positioning' },
  { designation: 'Systems Architect', department: 'Origin', role: 'System design, workflows, architecture blueprints' },
  { designation: 'Development Chief', department: 'Development', role: 'Development Department autonomously manage (sub-orchestrator)' },
  { designation: 'Product Manager', department: 'Development', role: 'Feature specs, PRD, acceptance criteria, roadmap, prioritization, user stories' },
  { designation: 'UX/UI Designer', department: 'Development', role: 'Information architecture, user flows, wireframes, UI systems, design QA' },
  { designation: 'Frontend Engineer', department: 'Development', role: 'Web UI, state management, components, performance, accessibility' },
  { designation: 'Backend Engineer', department: 'Development', role: 'APIs, authentication, DB schema, queues, caching, scalability, logging' },
  { designation: 'DevOps Engineer', department: 'Development', role: 'CI/CD, deployment, Docker, monitoring, secrets, cost management' },
  { designation: 'QA Engineer', department: 'Development', role: 'Test plans, regression testing, E2E automation, bug triage, release validation' },
  { designation: 'AI Engineer', department: 'Development', role: 'LLM/agent orchestration, RAG, evals, prompt & context engineering, tool contracts' },
  { designation: 'Data Engineer', department: 'Development', role: 'Analytics events, pipelines, dashboards, attribution, data quality' },
  { designation: 'Growth Chief', department: 'Growth', role: 'Growth Department autonomously manage (sub-orchestrator)' },
  { designation: 'Marketing Specialist', department: 'Growth', role: 'Paid campaigns, Meta/Google Ads, performance diagnosis, KPI forecasting' },
  { designation: 'Content Strategist', department: 'Growth', role: 'Content creation, social copy, multi-platform content, newsletters, calendars' },
  { designation: 'Creative Engineer', department: 'Growth', role: 'AI images/videos, design systems, ad creatives, brand assets, visual strategy' },
  { designation: 'Market Researcher', department: 'Growth', role: 'Competitive intelligence, TAM/SAM/SOM, ICP, trend research, opportunity analysis' },
  { designation: 'Social Manager', department: 'Growth', role: 'Publishing, scheduling, community management, DM handling, analytics' },
  { designation: 'Optimization Specialist', department: 'Growth', role: 'SEO, AEO, GEO, AgentEO (AI discoverability optimization)' },
  { designation: 'Revenue Chief', department: 'Revenue', role: 'Revenue Department autonomously manage (sub-orchestrator)' },
  { designation: 'Sales Executive', department: 'Revenue', role: 'Outreach, qualification, follow-ups, demos, negotiation, closing' },
  { designation: 'Deal Specialist', department: 'Revenue', role: 'Pricing, proposals, packaging, discount approval' },
  { designation: 'Operations Executive', department: 'Revenue', role: 'CRM, pipeline, forecasting, sales playbooks' },
  { designation: 'Billing Executive', department: 'Revenue', role: 'Invoicing, payments, collections, renewals' },
  { designation: 'Finance Manager', department: 'Revenue', role: 'Bookkeeping, P&L, cashflow, budgeting, runway, unit economics' },
];

// --- ResForce Realistic Service Logs ---
const ALL_LOGS = [
  'RESbot coordinating cross-department workflow for new venture launch.',
  'RESbot validating final assembled output from dev-chief.',
  'origin-chief routing ideation task payload to idea-architect.',
  'origin-chief compiling strategy validation reports for RESbot.',
  'idea-architect generated 5 new concept frameworks for evaluation.',
  'idea-architect brainstorming framing angles for upcoming campaign.',
  'research-analyst parsing 120 pages of industry trend data.',
  'research-analyst synthesized weak signals into actionable insights.',
  'market-analyst executing competitor intel scan on 15 targets.',
  'market-analyst mapping market sizing opportunities.',
  'risk-analyst compiling feasibility matrix and assumption guardrails.',
  'risk-analyst issued a go/no-go recommendation for feature set.',
  'strategy-architect updating master execution roadmap.',
  'strategy-architect defining product positioning vision.',
  'systems-architect generating system workflow blueprints.',
  'systems-architect designing cross-agent architecture flow.',
  'dev-chief orchestrating sprint tasks for backend and frontend engineers.',
  'dev-chief reporting build status to RESbot.',
  'product-manager drafting PRD and defining acceptance criteria.',
  'product-manager prioritizing user stories in the backlog.',
  'ux-ui-designer finalizing high-fidelity wireframes in Figma.',
  'ux-ui-designer executing design QA on recent component updates.',
  'frontend-engineer deploying Next.js UI component updates.',
  'frontend-engineer optimizing state management and accessibility.',
  'backend-engineer optimizing database schema and API routing.',
  'backend-engineer configuring caching and queue mechanisms.',
  'devops-engineer monitoring Vercel CI/CD deployment pipeline.',
  'devops-engineer rotating secrets and checking Docker instances.',
  'qa-engineer running E2E automated regression tests.',
  'qa-engineer triaging bugs and providing release sign-off.',
  'ai-engineer updating LLM prompt contexts and tool contracts.',
  'ai-engineer tweaking LangGraph orchestration and RAG evals.',
  'data-engineer deploying new analytics pipeline to data warehouse.',
  'data-engineer building attribution dashboard.',
  'growth-chief validating ad creatives from creative-engineer.',
  'growth-chief reporting GTM readiness to RESbot.',
  'marketing-specialist optimizing Meta Ads CPA metrics.',
  'marketing-specialist forecasting KPI for new Google Ads campaign.',
  'content-strategist drafting multi-platform content calendar.',
  'content-strategist synthesizing copy for LinkedIn and X.',
  'creative-engineer generating ad variations via Midjourney & Canva.',
  'creative-engineer compiling AI-generated video assets for TikTok.',
  'market-researcher calculating TAM/SAM/SOM for expansion plan.',
  'market-researcher building Ideal Customer Profile (ICP) matrix.',
  'social-manager handling community management on WhatsApp.',
  'social-manager analyzing engagement metrics across DMs.',
  'optimization-specialist auditing AgentEO search visibility.',
  'optimization-specialist executing technical SEO optimization.',
  'revenue-chief analyzing quarterly runway and revenue forecasts.',
  'revenue-chief routing CRM updates to operations-executive.',
  'sales-executive executing automated follow-ups via email.',
  'sales-executive qualifying inbound leads and booking demos.',
  'deal-specialist drafting custom pricing proposal for enterprise.',
  'deal-specialist reviewing discount approval logic.',
  'operations-executive updating CRM pipeline statuses.',
  'operations-executive refining sales playbook documentation.',
  'billing-executive processing successful Stripe renewals.',
  'billing-executive dispatching automated invoices.',
  'finance-manager reconciling bank statements and updating P&L.',
  'finance-manager adjusting unit economics model.',
];

const getTimestamp = () => {
  const now = new Date();
  return `[${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}]`;
};

// INITIAL SEEDED LOGS SO THE 5 ROWS ARE FILLED IMMEDIATELY
const INITIAL_LOGS = [
  `${getTimestamp()} Automican Central Core initialized.`,
  `${getTimestamp()} Connecting to ResForce Agent Nodes...`,
  `${getTimestamp()} Establishing secure cross-department routing.`,
  `${getTimestamp()} Verifying Protocol Validations... OK.`,
  `${getTimestamp()} ResForce network online. Awaiting directives.`
];

// --- Components ---

const ConceptCard = ({ title, desc, icon: Icon }) => (
  <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-6 rounded-xl hover:border-cyan-500/40 transition-all duration-300 group">
    <div className="flex items-center gap-3 mb-3">
      <div className="p-2 bg-slate-800 rounded-lg group-hover:bg-cyan-950/50 transition-colors">
        <Icon className="w-5 h-5 text-cyan-400" />
      </div>
      <h3 className="text-slate-200 text-lg font-semibold tracking-tight">{title}</h3>
    </div>
    <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
  </div>
);

// --- Main Application ---

export default function App() {
  const [logs, setLogs] = useState(INITIAL_LOGS);
  const [activeAgents, setActiveAgents] = useState([]);

  const logsContainerRef = useRef(null);

  // Initialize and randomly select 5 agents for the registry
  useEffect(() => {
    const updateAgents = () => {
      const shuffled = [...ALL_AGENTS].sort(() => 0.5 - Math.random());
      setActiveAgents(shuffled.slice(0, 5));
    };

    updateAgents();
    const agentInterval = setInterval(updateAgents, 4000);

    return () => clearInterval(agentInterval);
  }, []);

  // Simulate streaming incoming real ResForce logs with timestamps
  useEffect(() => {
    const logInterval = setInterval(() => {
      const randomLog = ALL_LOGS[Math.floor(Math.random() * ALL_LOGS.length)];
      const logWithTime = `${getTimestamp()} ${randomLog}`;
      setLogs((prev) => [...prev, logWithTime].slice(-5));
    }, 4000);
    return () => clearInterval(logInterval);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-slate-300 font-sans selection:bg-cyan-900 selection:text-cyan-100 p-4 md:p-8">
      <style>{`
        @keyframes gradient-flow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-flow {
          background-size: 200% auto;
          animation: gradient-flow 4s linear infinite;
        }
      `}</style>

      {/* Navigation */}
      <nav className="flex flex-col md:flex-row justify-between items-center mb-16 border-b border-slate-800/60 pb-6">
        <div className="flex items-center gap-3 mb-4 md:mb-0">
          <div className="w-8 h-8 flex items-center justify-center border border-cyan-500/50 rounded bg-cyan-950/30">
            <Network className="w-5 h-5 text-cyan-400" />
          </div>
          <span className="text-xl font-semibold tracking-widest text-slate-100 uppercase">Automican</span>
        </div>

        <div className="flex items-center gap-8 text-sm font-medium flex-wrap justify-center">
          <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors">Agents</a>
          <a href="#" className="text-slate-400 hover:text-slate-200 transition-colors">Solutions</a>
          <a href="#" className="text-slate-400 hover:text-slate-200 transition-colors">Resources</a>
          <a href="#" className="text-slate-400 hover:text-slate-200 transition-colors">Pricing</a>
          <a href="#" className="text-slate-400 hover:text-slate-200 transition-colors">Contact</a>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 hover:bg-cyan-950/30 hover:border-cyan-500/30 transition-colors cursor-pointer">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-xs font-mono text-emerald-500 font-bold uppercase tracking-wider">Deploy Now</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="mb-16 max-w-4xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-slate-800 bg-slate-900/50 text-xs font-mono text-slate-400 mb-6">
          <Terminal className="w-3 h-3" />
          <span>Automican Protocol</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-slate-100 mb-6 tracking-tight flex flex-col gap-4">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-400 to-emerald-400 animate-gradient-flow font-extrabold pb-1">
            AI Agentic Nation
          </span>
          <span>Rising to Sync Mankind</span>
        </h1>
        <p className="text-lg text-slate-400 font-mono min-h-[3rem]">
          AI Agent — a sovereign, autonomous network that thinks, collaborates, and executes across your entire operation — 24/7.
        </p>
      </header>

      {/* Concept Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        <ConceptCard
          title="Sovereign"
          desc="Self-governed system, fully under your control, with no outside authority or control."
          icon={Shield}
        />
        <ConceptCard
          title="Synchronize"
          desc="Humans, agents, and systems stay aligned, moving together in one coordinated flow."
          icon={RefreshCw}
        />
        <ConceptCard
          title="Active"
          desc="Runs nonstop for 24 hrs, executing tasks without pause, delay, or interruption."
          icon={Zap}
        />
        <ConceptCard
          title="Collective"
          desc="A unified agent network working together as one, creating shared intelligence."
          icon={Globe}
        />
      </div>

      {/* Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-12">
        {/* Agent Registry */}
        <div className="lg:col-span-3 bg-slate-900/30 border border-slate-800/80 rounded-xl overflow-hidden transition-all duration-500 flex flex-col h-[450px]">
          <div className="px-6 py-4 border-b border-slate-800/80 flex justify-between items-center bg-slate-900/50 shrink-0">
            <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-cyan-500 animate-spin-slow" />
              AGENT REGISTRY
            </h2>
            <button className="text-xs text-cyan-500 hover:text-cyan-400 font-mono flex items-center tracking-widest">
              VIEW ALL <ChevronRight className="w-3 h-3 ml-1" />
            </button>
          </div>
          <div className="flex-1 w-full overflow-hidden">
            <table className="w-full text-left border-collapse table-fixed">
              <thead>
                <tr className="bg-slate-800/40 text-xs text-cyan-400 font-bold tracking-widest border-b border-cyan-900/50">
                  <th className="px-6 py-3 w-[35%]">AGENTS</th>
                  <th className="px-6 py-3 w-[65%]">CAPABILITIES</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-slate-800/50">
                {activeAgents.map((agent, i) => (
                  <tr key={`${agent.designation}-${i}`} className="hover:bg-slate-800/20 transition-all duration-300 h-[70px]">
                    <td className="px-6 py-2 text-slate-200 font-medium truncate pr-4" title={agent.designation}>
                      {agent.designation}
                    </td>
                    <td className="px-6 py-2 text-xs text-slate-400 truncate pr-4" title={agent.role}>
                      {agent.role}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Execution Logs */}
        <div className="lg:col-span-2 bg-[#0a0f12] border border-slate-800 rounded-xl overflow-hidden flex flex-col h-[450px]">
          <div className="px-6 py-4 border-b border-slate-800/80 flex justify-between items-center bg-slate-900/50 shrink-0">
            <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-500" />
              EXECUTION LOGS
            </h2>
            <button className="text-xs text-cyan-500 hover:text-cyan-400 font-mono flex items-center tracking-widest">
              VIEW ALL <ChevronRight className="w-3 h-3 ml-1" />
            </button>
          </div>

          <div className="flex-1 w-full overflow-hidden">
            <div className="bg-slate-800/40 text-xs text-cyan-400 font-bold tracking-widest border-b border-cyan-900/50 px-6 py-3 flex">
              <div className="w-full">EXECUTION FEED</div>
            </div>

            <div className="flex flex-col divide-y divide-slate-800/50 text-sm w-full">
              {logs.map((log, index) => (
                <div key={`${index}-${log.slice(-8)}`} className="h-[70px] px-6 py-2 flex items-center hover:bg-slate-800/20 transition-all duration-300">
                  <div className="opacity-90 hover:opacity-100 font-mono text-xs sm:text-sm text-emerald-500/80 truncate w-full" title={log}>
                    {log}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Deploy Your First Agent Section */}
      <div className="bg-slate-900/30 border border-cyan-500/20 rounded-2xl p-6 md:p-8 relative overflow-hidden backdrop-blur-sm group hover:border-cyan-500/40 transition-colors">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
              <Activity className="w-6 h-6 text-cyan-400" />
              Deploy Your First Agent
            </h2>
            <p className="text-sm text-slate-400 mt-1 font-mono">Initialize a custom autonomous node for your operations.</p>
          </div>
        </div>

        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          <div className="relative">
            <textarea
              placeholder="Describe Your Agent or Agent Team..."
              className="w-full bg-[#050505]/50 border border-slate-800 rounded-xl p-4 text-slate-200 placeholder-slate-500/80 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all min-h-[120px] outline-none resize-y"
            />
            <div className="absolute bottom-3 right-3 text-xs font-mono text-slate-500">OPTIONAL: DETAILED SPEC</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Name / Company"
              className="bg-[#050505]/50 border border-slate-800 rounded-lg p-3.5 text-slate-200 placeholder-slate-500 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all outline-none"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              className="bg-[#050505]/50 border border-slate-800 rounded-lg p-3.5 text-slate-200 placeholder-slate-500 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all outline-none"
            />
            <input
              type="email"
              placeholder="Email Address"
              className="bg-[#050505]/50 border border-slate-800 rounded-lg p-3.5 text-slate-200 placeholder-slate-500 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all outline-none"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="bg-cyan-950/40 hover:bg-cyan-900/80 text-cyan-400 border border-cyan-500/40 rounded-lg px-8 py-3.5 font-mono text-sm tracking-widest transition-all flex items-center gap-2 group/btn"
            >
              SUBMIT_DIRECTIVE
              <Send className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
