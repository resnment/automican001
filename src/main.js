import { initCoreScene } from "./core-scene.js";
import { runTypewriter } from "./typewriter.js";
import { initAnimations } from "./animations.js";
import { dialogues, species } from "./data.js";

const canvas = document.getElementById("automican-core-canvas");
initCoreScene(canvas);

// Typewriter dialogue
const typewriterEl = document.getElementById("typewriter");
runTypewriter(typewriterEl, dialogues, { typeSpeed: 22, lineDelay: 650 });

// Species cards
const speciesGrid = document.getElementById("species-grid");
species.forEach((s) => {
  const card = document.createElement("article");
  card.className = "agent-card";
  card.innerHTML = `
    <h3 class="text-xl font-semibold text-cyan-200">${s.title}</h3>
    <p class="text-violet-300/90 mt-2 text-sm uppercase tracking-[0.15em]">${s.role}</p>
    <p class="mt-4 text-cyan-100/85">${s.desc}</p>
  `;
  speciesGrid.appendChild(card);
});

// Live Sync simulated stream
const sync = document.getElementById("sync-stream");
const statuses = [
  "Thinkers ↔ Human Strategy Council: SYNCHRONIZED",
  "Builders ↔ Product Cells: DEPLOYMENT WINDOW ACTIVE",
  "Protectors ↔ Security Grid: THREAT SCORE STABLE",
  "Cross-Nation Latency: 12ms",
  "Empathy-Logic Alignment Index: 97.4%"
];

setInterval(() => {
  const line = document.createElement("p");
  const stamp = new Date().toLocaleTimeString();
  line.innerHTML = `<span class="text-cyan-400">[${stamp}]</span> ${statuses[Math.floor(Math.random() * statuses.length)]}`;
  line.className = "sync-line";
  sync.prepend(line);

  // Keep last 12 lines
  while (sync.children.length > 12) sync.removeChild(sync.lastChild);
}, 1200);

// GSAP
initAnimations();
