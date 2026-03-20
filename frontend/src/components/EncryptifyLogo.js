import React, { useState, useEffect, useRef, useCallback } from "react";

const CHARS = "0123456789abcdef";
const randHex = (len) => Array.from({ length: len }, () => CHARS[Math.floor(Math.random() * 16)]).join("");

function useCipherText(active, length = 9, interval = 100) {
  const [text, setText] = useState("");
  useEffect(() => {
    if (!active) { setText(""); return; }
    setText(randHex(length));
    const id = setInterval(() => setText(randHex(length)), interval);
    return () => clearInterval(id);
  }, [active, length, interval]);
  return text;
}

function useIconCipher(active, interval = 80) {
  const [lines, setLines] = useState([]);
  useEffect(() => {
    if (!active) { setLines([]); return; }
    const gen = () => Array.from({ length: 6 }, () => randHex(24));
    setLines(gen());
    const id = setInterval(() => setLines(gen()), interval);
    return () => clearInterval(id);
  }, [active, interval]);
  return lines;
}

export function EncryptifyMark({ size = 32, darkMode = true, encrypted = false }) {
  const id  = `lg${size}${darkMode ? "d" : "l"}`;
  const g1  = darkMode ? "#7c3aed" : "#6d28d9";
  const g2  = darkMode ? "#0ea5e9" : "#0284c7";
  const tc  = darkMode ? "#a78bfa" : "#6d28d9";
  const iconLines = useIconCipher(encrypted, 80);

  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      {/* Real icon */}
      <svg
        width={size} height={size} viewBox="0 0 72 72" fill="none"
        style={{
          transition: "opacity 0.3s ease, filter 0.3s ease",
          opacity: encrypted ? 0 : 1,
          filter: encrypted ? "blur(4px)" : "none",
        }}
      >
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

      {/* Cipher overlay */}
      <div style={{
        position: "absolute", inset: 0,
        borderRadius: Math.round(size * 0.27),
        background: `rgba(${darkMode ? "124,58,237" : "109,40,217"},0.1)`,
        border: `0.5px solid rgba(${darkMode ? "167,139,250" : "109,40,217"},0.35)`,
        overflow: "hidden",
        opacity: encrypted ? 1 : 0,
        transition: "opacity 0.3s ease",
        fontFamily: "'DM Mono', 'Courier New', monospace",
        fontSize: Math.round(size * 0.115),
        lineHeight: 1.2,
        color: tc,
        padding: Math.round(size * 0.07),
        wordBreak: "break-all",
        pointerEvents: "none",
        letterSpacing: "0.02em",
      }}>
        {iconLines.join("\n")}
      </div>
    </div>
  );
}

export default function EncryptifyLogoFull({ iconSize = 30, darkMode = true, fontSize = 16 }) {
  const [encrypted, setEncrypted] = useState(false);
  const timerRef  = useRef(null);
  const c1        = darkMode ? "#a78bfa" : "#6d28d9";
  const c2        = darkMode ? "#38bdf8" : "#0284c7";
  const cipherWm  = useCipherText(encrypted, 13, 110);

  const handleClick = useCallback(() => {
    clearTimeout(timerRef.current);
    if (encrypted) {
      setEncrypted(false);
    } else {
      setEncrypted(true);
      timerRef.current = setTimeout(() => setEncrypted(false), 2500);
    }
  }, [encrypted]);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  return (
    <div
      onClick={handleClick}
      title={encrypted ? "Click to decrypt" : "Click to encrypt"}
      style={{
        display: "flex", alignItems: "center",
        gap: Math.round(iconSize * 0.36),
        flexShrink: 0, cursor: "pointer", userSelect: "none",
      }}
    >
      <EncryptifyMark size={iconSize} darkMode={darkMode} encrypted={encrypted} />

      {/* Wordmark area */}
      <div style={{ position: "relative", height: fontSize * 1.2, display: "flex", alignItems: "center" }}>

        {/* Real wordmark */}
        <span style={{
          fontFamily: "'Syne', 'Arial Black', sans-serif",
          fontWeight: 800, fontSize, letterSpacing: "-0.01em",
          whiteSpace: "nowrap", lineHeight: 1,
          background: `linear-gradient(120deg, ${c1} 0%, ${c2} 100%)`,
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          transition: "opacity 0.3s ease, filter 0.3s ease",
          opacity: encrypted ? 0 : 1,
          filter: encrypted ? "blur(3px)" : "none",
          position: "relative", zIndex: 1,
        }}>
          Encryptify
        </span>

        {/* Cipher wordmark */}
        <span style={{
          position: "absolute", left: 0, top: 0, bottom: 0,
          display: "flex", alignItems: "center",
          fontFamily: "'DM Mono', 'Courier New', monospace",
          fontWeight: 400,
          fontSize: fontSize * 0.58,
          whiteSpace: "nowrap", letterSpacing: "0.05em",
          color: c1,
          textShadow: `0 0 8px ${c1}88`,
          opacity: encrypted ? 1 : 0,
          transition: "opacity 0.3s ease",
          zIndex: 2,
        }}>
          {cipherWm || randHex(13)}
        </span>

        {/* Strikethrough line */}
        <div style={{
          position: "absolute", left: 0, top: "50%",
          transform: "translateY(-50%)",
          height: 2, borderRadius: 1,
          background: `linear-gradient(90deg, ${c1}, ${c2})`,
          boxShadow: `0 0 6px ${c1}88`,
          width: encrypted ? "100%" : "0%",
          transition: "width 0.35s cubic-bezier(0.4,0,0.2,1)",
          zIndex: 3,
          pointerEvents: "none",
        }} />
      </div>
    </div>
  );
}