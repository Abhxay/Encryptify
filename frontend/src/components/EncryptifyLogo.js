import React from "react";

export function EncryptifyMark({ size = 32, darkMode = true }) {
  const id = `lg${size}${darkMode ? "d" : "l"}`;
  const g1 = darkMode ? "#7c3aed" : "#6d28d9";
  const g2 = darkMode ? "#0ea5e9" : "#0284c7";

  return (
    <svg width={size} height={size} viewBox="0 0 72 72" fill="none">
      <defs>
        <linearGradient id={`g_${id}`} x1="0" y1="0" x2="72" y2="72" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor={g1}/>
          <stop offset="100%" stopColor={g2}/>
        </linearGradient>
        <clipPath id={`c_${id}`}>
          <rect x="0" y="0" width="72" height="72" rx="20"/>
        </clipPath>
      </defs>
      <rect width="72" height="72" rx="20" fill={`url(#g_${id})`}/>
      <rect width="72" height="72" rx="20" fill="rgba(255,255,255,0.05)"/>
      <rect x="14" y="15" width="38" height="9" rx="3" fill="white" opacity="0.95"/>
      <rect x="14" y="31" width="28" height="9" rx="3" fill="white" opacity="0.95"/>
      <rect x="14" y="47" width="38" height="9" rx="3" fill="white" opacity="0.95"/>
      <line x1="46" y1="14" x2="57" y2="58" stroke="rgba(255,255,255,0.22)" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="50" cy="35.5" r="4.5" fill={`url(#g_${id})`}/>
      <circle cx="50" cy="35.5" r="2.5" fill="rgba(255,255,255,0.92)"/>
      <polygon points="72,0 72,18 54,0" fill="rgba(0,0,0,0.14)" clipPath={`url(#c_${id})`}/>
    </svg>
  );
}

export default function EncryptifyLogoFull({ iconSize = 30, darkMode = true, fontSize = 16 }) {
  const c1 = darkMode ? "#a78bfa" : "#6d28d9";
  const c2 = darkMode ? "#38bdf8" : "#0284c7";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: Math.round(iconSize * 0.36), flexShrink: 0 }}>
      <EncryptifyMark size={iconSize} darkMode={darkMode} />
      <span style={{
        fontFamily: "'Syne', 'Arial Black', sans-serif",
        fontWeight: 800,
        fontSize: fontSize,
        letterSpacing: "-0.01em",
        background: `linear-gradient(120deg, ${c1} 0%, ${c2} 100%)`,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        whiteSpace: "nowrap",
        lineHeight: 1,
      }}>
        Encryptify
      </span>
    </div>
  );
}