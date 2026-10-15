import React, {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { RoleIcon } from "./components";

export function Avatar({ agent, className = "" }) {
  const raw = useId().replace(/:/g, "");
  const shell = `${raw}-shell`,
    shade = `${raw}-shade`,
    visor = `${raw}-visor`,
    glow = `${raw}-glow`;
  return (
    <svg
      className={`employee-avatar ${className}`}
      viewBox="0 0 300 330"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id={shell}
          x1="83"
          y1="45"
          x2="221"
          y2="178"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#faf7ee" />
          <stop offset=".35" stopColor="#cfdae5" />
          <stop offset=".68" stopColor="#aab7cb" />
          <stop offset="1" stopColor="#596a83" />
        </linearGradient>
        <linearGradient
          id={shade}
          x1="80"
          y1="179"
          x2="232"
          y2="296"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#627186" />
          <stop offset=".4" stopColor="#293d59" />
          <stop offset="1" stopColor="#111d32" />
        </linearGradient>
        <linearGradient
          id={visor}
          x1="100"
          y1="75"
          x2="192"
          y2="132"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#192d48" />
          <stop offset="1" stopColor="#040b17" />
        </linearGradient>
        <radialGradient id={glow}>
          <stop stopColor="currentColor" stopOpacity=".35" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="150" cy="306" rx="90" ry="15" fill={`url(#${glow})`} />
      <path
        d="M107 273L102 300Q117 312 135 301L138 274M164 274L167 301Q187 312 201 300L193 270"
        fill={`url(#${shade})`}
        stroke="#677b96"
        strokeOpacity=".5"
      />
      <path
        d="M81 190C62 194 56 213 58 239L61 259C63 268 78 269 84 259L89 223"
        fill={`url(#${shell})`}
        stroke="#c6d4e2"
        strokeOpacity=".4"
      />
      <path
        d="M67 258L62 274Q66 285 80 281L86 270 81 258"
        fill={`url(#${shade})`}
        stroke="#8fa5c0"
      />
      <g className="avatar-wave-arm">
        <path
          d="M215 188C234 188 245 209 243 234L240 254C237 265 223 264 217 255L211 221"
          fill={`url(#${shell})`}
          stroke="#c6d4e2"
          strokeOpacity=".4"
        />
        <g className="avatar-hand">
          <path
            d="M221 251L216 266 217 279Q224 290 238 280L244 268 238 251Z"
            fill={`url(#${shell})`}
            stroke="#adbed2"
          />
          <path
            d="M221 265L220 280M227 265L227 284M233 264L234 280"
            stroke="#6b809a"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </g>
      </g>
      <rect x="135" y="154" width="30" height="34" rx="8" fill="#6a7e96" />
      <path d="M139 160H161M139 166H161" stroke="#a6bbca" strokeWidth="2" />
      <path
        d="M113 175H187C210 175 222 194 220 221L214 267C211 286 89 286 86 267L80 221C78 194 90 175 113 175Z"
        fill={`url(#${shade})`}
        stroke="#8ea6bd"
        strokeOpacity=".5"
      />
      <path d="M97 192Q150 210 203 192" stroke="#b4c4d2" strokeOpacity=".32" />
      <path d="M94 258Q150 274 206 258" stroke="#6a839e" strokeOpacity=".45" />
      <rect
        x="126"
        y="213"
        width="48"
        height="43"
        rx="15"
        fill="#0a1729"
        stroke="currentColor"
        strokeOpacity=".6"
      />
      <RoleIcon
        icon={agent.icon}
        size={25}
        x="137"
        y="222"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect
        x="67"
        y="80"
        width="20"
        height="45"
        rx="10"
        fill={`url(#${shade})`}
        stroke="#819ab4"
      />
      <rect
        x="213"
        y="80"
        width="20"
        height="45"
        rx="10"
        fill={`url(#${shade})`}
        stroke="#819ab4"
      />
      <rect
        x="79"
        y="43"
        width="142"
        height="122"
        rx="45"
        fill={`url(#${shell})`}
        stroke="#d9e4ed"
        strokeOpacity=".7"
      />
      <path
        d="M100 54Q148 36 197 54"
        stroke="white"
        strokeOpacity=".6"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <rect
        x="94"
        y="73"
        width="112"
        height="65"
        rx="27"
        fill={`url(#${visor})`}
        stroke="#46617f"
        strokeWidth="2"
      />
      <path
        d="M106 84Q147 73 194 85"
        stroke="#80b1d3"
        strokeOpacity=".22"
        strokeWidth="2"
      />
      <g className="avatar-eyes">
        <rect
          x="115"
          y="96"
          width="17"
          height="9"
          rx="4.5"
          fill="currentColor"
        />
        <rect
          x="168"
          y="96"
          width="17"
          height="9"
          rx="4.5"
          fill="currentColor"
        />
      </g>
      <path
        d="M141 119Q150 125 159 119"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="104" cy="143" r="3" fill="currentColor" fillOpacity=".5" />
      <circle cx="196" cy="143" r="3" fill="currentColor" fillOpacity=".5" />
      {agent.icon === "support" && (
        <g stroke="currentColor" strokeWidth="4" strokeLinecap="round">
          <path d="M75 94C66 26 231 26 225 94" />
          <path d="M225 118L207 141H182" />
          <rect
            x="172"
            y="137"
            width="14"
            height="7"
            rx="3"
            fill="currentColor"
            stroke="none"
          />
        </g>
      )}
      {agent.icon === "accounts" && (
        <g stroke="#e7ca98" strokeWidth="2" fill="none">
          <rect x="107" y="88" width="34" height="27" rx="9" />
          <rect x="159" y="88" width="34" height="27" rx="9" />
          <path d="M141 98H159" />
        </g>
      )}
      {agent.icon === "admissions" && (
        <g>
          <path
            d="M85 50L150 23 215 50 150 73Z"
            fill="#26314d"
            stroke="currentColor"
          />
          <path d="M202 55V79" stroke="currentColor" strokeWidth="2" />
          <circle cx="202" cy="83" r="4" fill="currentColor" />
        </g>
      )}
      {agent.icon === "personal" && (
        <g>
          <circle
            cx="150"
            cy="43"
            r="8"
            fill={`url(#${shell})`}
            stroke="currentColor"
          />
          <path d="M150 35V23" stroke="currentColor" strokeWidth="2" />
          <circle cx="150" cy="20" r="4" fill="currentColor" />
        </g>
      )}
      <path
        d="M109 182L128 201M191 182L172 201"
        stroke="currentColor"
        strokeOpacity=".65"
        strokeWidth="2"
      />
      <circle cx="150" cy="267" r="2" fill="currentColor" />
    </svg>
  );
}
export function AvatarGreeting({ agent, className = "" }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const bubbleRef = useRef(null);
  const suppressed = useRef(false);
  const id = useId();
  useEffect(() => {
    if (!open) return;
    const outside = (event) => {
      if (!rootRef.current?.contains(event.target)) {
        suppressed.current = true;
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [open]);
  useLayoutEffect(() => {
    if (!open) return;
    const position = () => {
      const root = rootRef.current,
        bubble = bubbleRef.current;
      if (!root || !bubble) return;
      const anchor = root.getBoundingClientRect();
      const width = bubble.offsetWidth;
      const left = Math.max(
        16,
        Math.min(
          anchor.left + anchor.width / 2 - width / 2,
          window.innerWidth - width - 16,
        ),
      );
      bubble.style.left = `${left - anchor.left}px`;
      const above = anchor.top >= bubble.offsetHeight + 20;
      bubble.style.bottom = above ? "calc(100% + 10px)" : "auto";
      bubble.style.top = above ? "auto" : "calc(100% + 10px)";
    };
    position();
    window.addEventListener("resize", position);
    window.addEventListener("scroll", position, true);
    return () => {
      window.removeEventListener("resize", position);
      window.removeEventListener("scroll", position, true);
    };
  }, [open]);
  return (
    <div
      ref={rootRef}
      className={`avatar-greeting accent-${agent.accent} ${open ? "is-greeting" : ""} ${className}`}
      onPointerEnter={(e) => {
        if (e.pointerType === "mouse") {
          suppressed.current = false;
          setOpen(true);
        }
      }}
      onPointerLeave={(e) => {
        if (
          e.pointerType === "mouse" &&
          !e.currentTarget.contains(document.activeElement)
        )
          setOpen(false);
      }}
      onFocus={(e) => {
        if (!suppressed.current && e.target.matches(":focus-visible"))
          setOpen(true);
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          suppressed.current = false;
          setOpen(false);
        }
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape" && open) {
          e.preventDefault();
          e.stopPropagation();
          suppressed.current = true;
          setOpen(false);
          triggerRef.current?.focus();
        }
      }}
    >
      <button
        ref={triggerRef}
        className="avatar-trigger"
        type="button"
        aria-expanded={open}
        aria-controls={id}
        aria-describedby={open ? id : undefined}
        aria-label={`Meet your ${agent.short}`}
        onClick={() => {
          suppressed.current = false;
          setOpen((v) => !v);
        }}
      >
        <Avatar agent={agent} />
      </button>
      <div ref={bubbleRef} id={id} className="avatar-speech" hidden={!open}>
        <p>
          <span aria-hidden="true">✦ </span>
          {agent.greeting}
        </p>
      </div>
    </div>
  );
}
