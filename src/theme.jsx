import React from "react";

export const COLORS = {
  bg: "#F4F2FB",
  purpleDark: "#3F1E63",
  purple: "#5B2A86",
  purpleMid: "#7C3AED",
  purpleLight: "#A78BFA",
  green: "#16A34A",
  greenBg: "#ECFDF5",
  blue: "#2563EB",
  blueBg: "#EFF6FF",
  orange: "#F97316",
  orangeBg: "#FFF7ED",
  red: "#DC2626",
  redBg: "#FEF2F2",
  text: "#1F2937",
  sub: "#6B7280",
};

export function Logo({ size = 40, withText = true, light = false }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="rounded-full flex items-center justify-center font-bold shrink-0"
        style={{
          width: size,
          height: size,
          background: "linear-gradient(135deg,#A78BFA,#5B2A86)",
          color: "white",
          fontSize: size * 0.32,
          letterSpacing: 1,
        }}
      >
        EIS
      </div>
      {withText && (
        <div className="leading-tight">
          <div className="font-extrabold text-sm" style={{ color: light ? "white" : COLORS.purpleDark }}>
            Elite International Schools
          </div>
          <div className="text-[11px]" style={{ color: light ? "#D8CCF2" : COLORS.sub }}>
            مدارس النخبة العالمية
          </div>
        </div>
      )}
    </div>
  );
}

export function Card({ children, className = "", style = {} }) {
  return (
    <div className={`bg-white rounded-2xl p-5 shadow-[0_4px_20px_rgba(91,42,134,0.06)] ${className}`} style={style}>
      {children}
    </div>
  );
}

export function CardTitle({ icon: Icon, children, color = COLORS.purple }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      {Icon && <Icon size={18} style={{ color }} />}
      <h3 className="font-extrabold text-sm" style={{ color: COLORS.text }}>{children}</h3>
    </div>
  );
}

export function RingProgress({ percent, color }) {
  const r = 36;
  const c = 2 * Math.PI * r;
  const offset = c - (Math.min(100, Math.max(0, percent)) / 100) * c;
  return (
    <svg width="90" height="90" viewBox="0 0 90 90">
      <circle cx="45" cy="45" r={r} fill="none" stroke="#EEE" strokeWidth="8" />
      <circle
        cx="45" cy="45" r={r} fill="none" stroke={color} strokeWidth="8"
        strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
        transform="rotate(-90 45 45)"
      />
      <text x="45" y="50" textAnchor="middle" fontSize="16" fontWeight="800" fill={color}>{Math.round(percent)}%</text>
    </svg>
  );
}

export function PrimaryButton({ children, onClick, type = "button", className = "", disabled = false }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-xl px-5 py-2.5 font-bold text-white text-sm shadow transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      style={{ background: "linear-gradient(90deg,#7C3AED,#5B2A86)" }}
    >
      {children}
    </button>
  );
}

export function Input({ label, ...props }) {
  return (
    <div className="mb-4">
      {label && <label className="block text-sm font-bold mb-1.5" style={{ color: COLORS.text }}>{label}</label>}
      <input
        {...props}
        className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition focus:border-[#A78BFA] ${props.className || ""}`}
        style={{ borderColor: "#E5E7EB", ...(props.style || {}) }}
      />
    </div>
  );
}

export function Select({ label, children, ...props }) {
  return (
    <div className="mb-4">
      {label && <label className="block text-sm font-bold mb-1.5" style={{ color: COLORS.text }}>{label}</label>}
      <select
        {...props}
        className="w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition focus:border-[#A78BFA] bg-white"
        style={{ borderColor: "#E5E7EB" }}
      >
        {children}
      </select>
    </div>
  );
}

export function Badge({ children, color, bg }) {
  return (
    <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-full" style={{ background: bg, color }}>
      {children}
    </span>
  );
}
