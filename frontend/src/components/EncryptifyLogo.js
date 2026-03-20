import React from "react";

export function EncryptifyMark({ size = 32, darkMode = true }) {
  const id = `lg_${size}`;
  const gradStart = darkMode ? "#7c3aed" : "#6d28d9";
  const gradEnd   = darkMode ? "#0ea5e9" : "#0284c7";

  return (
    <svg width={size} height={size} viewBox="0 0 72 72" fill="none">
      <defs>
        <linearGradient id={`g_${id}`} x1="0" y1="0" x2="72" y2="72" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stop-color={gradStart}/>
          <stop offset="100%" stop-color={gradEnd}/>
        </linearGradient>
        <clipPath id={`c_${id}`}>
          <rect x="0" y="0" width="72" height="72" rx="20"/>
        </clipPath>
      </defs>

      {/* Squircle background */}
      <rect width="72" height="72" rx="20" fill={`url(#g_${id})`}/>
      <rect width="72" height="72" rx="20" fill="rgba(255,255,255,0.05)"/>

      {/* Three cipher-block bars */}
      <rect x="14" y="15" width="38" height="9" rx="3" fill="white" opacity="0.95"/>
      <rect x="14" y="31" width="28" height="9" rx="3" fill="white" opacity="0.95"/>
      <rect x="14" y="47" width="38" height="9" rx="3" fill="white" opacity="0.95"/>

      {/* Diagonal key slash */}
      <line x1="46" y1="14" x2="57" y2="58"
        stroke="rgba(255,255,255,0.22)" strokeWidth="3" strokeLinecap="round"/>

      {/* Cipher lock dot on mid bar */}
      <circle cx="50" cy="35.5" r="4.5" fill={`url(#g_${id})`}/>
      <circle cx="50" cy="35.5" r="2.5" fill="rgba(255,255,255,0.92)"/>

      {/* Top-right architectural corner cut */}
      <polygon
        points="72,0 72,18 54,0"
        fill="rgba(0,0,0,0.14)"
        clipPath={`url(#c_${id})`}
      />
    </svg>
  );
}

export function EncryptifyWordmark({ size = 18, darkMode = true }) {
  const c1 = darkMode ? "#a78bfa" : "#6d28d9";
  const c2 = darkMode ? "#38bdf8" : "#0284c7";
  const uid = `wm_${size}`;
  return (
    <svg width={size * 5.8} height={size * 1.25} viewBox={`0 0 ${size * 5.8} ${size * 1.25}`}>
      <defs>
        <linearGradient id={uid} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor={c1}/>
          <stop offset="100%" stopColor={c2}/>
        </linearGradient>
      </defs>
      <text
        x="0" y={size}
        fill={`url(#${uid})`}
        fontFamily="'Syne', 'Arial Black', sans-serif"
        fontWeight="800"
        fontSize={size}
        letterSpacing="-0.02em"
      >
        Encryptify
      </text>
    </svg>
  );
}

export default function EncryptifyLogoFull({ iconSize = 32, darkMode = true }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: iconSize * 0.38 }}>
      <EncryptifyMark size={iconSize} darkMode={darkMode} />
      <EncryptifyWordmark size={iconSize * 0.52} darkMode={darkMode} />
    </div>
  );
}