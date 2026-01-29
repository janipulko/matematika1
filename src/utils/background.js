/**
 * Dinamične animacije v obliki { ime: 'css string' }.
 * Vsaka animacija je samostojen CSS snippet, ki:
 *  - nastavi osnovo za <body>
 *  - definira ::before/::after sloje in @keyframes
 *  - uporablja obstoječe CSS spremenljivke (npr. --bg, --primary, --accent, ...)
 *
 * Opomba: Ker vstavljamo celoten CSS, pazimo, da se selektorji ne tepejo med seboj.
 * Vse animacije so napisane tako, da delujejo same zase (brez razredov).
 */

export const animations = {
  /**
   * 1) CLOUDS – tvoja izvorna animacija (radialni mehurčki)
   */
  clouds: `
    body {
      position: relative;
      overflow-x: hidden;
      background: var(--bg) !important;
      isolation: isolate;
    }

    body::before, body::after {
      content: "";
      position: fixed;
      top: -100%;
      left: -100%;
      width: 300%;
      height: 300%;
      z-index: -2;
      pointer-events: none;
    }

    body::before {
      opacity: 0.45;
      background: radial-gradient(circle at center, var(--bubble) 0%, transparent 70%);
      animation: moveClouds 40s ease-in-out infinite;
    }

    body::after {
      opacity: 0.25;
      background: radial-gradient(circle at center, var(--primary) 0%, transparent 60%);
      animation: moveClouds 60s ease-in-out infinite reverse;
    }

    @keyframes moveClouds {
      0%   { transform: translate(0, 0) scale(1); }
      33%  { transform: translate(5%, 10%) scale(1.1); }
      66%  { transform: translate(-5%, 5%) scale(0.9); }
      100% { transform: translate(0, 0) scale(1); }
    }

    @media (prefers-reduced-motion: reduce) {
      body::before, body::after { animation: none !important; }
    }
  `,

  /**
   * 2) NEON – linearni gradient glow s premikom
   */
  neon: `
    body {
      position: relative;
      overflow-x: hidden;
      background: var(--bg) !important;
      isolation: isolate;
    }

    body::before, body::after {
      content: "";
      position: fixed;
      top: -80%;
      left: -80%;
      width: 260%;
      height: 260%;
      z-index: -2;
      pointer-events: none;
      background-size: 200% 200%;
    }

    body::before {
      opacity: 0.5;
      filter: blur(80px);
      transform: scale(1.2);
      background: linear-gradient(90deg, var(--primary), var(--accent));
      animation: glowShift 12s ease-in-out infinite;
    }

    body::after {
      opacity: 0.35;
      filter: blur(100px);
      transform: scale(1.35);
      background: linear-gradient(90deg, var(--accent), var(--primary-d));
      animation: glowShiftReverse 16s ease-in-out infinite;
    }

    @keyframes glowShift {
      0%   { background-position: 0% 50%; }
      50%  { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    @keyframes glowShiftReverse {
      0%   { background-position: 100% 50%; }
      50%  { background-position: 0% 50%; }
      100% { background-position: 100% 50%; }
    }

    @media (prefers-reduced-motion: reduce) {
      body::before, body::after { animation: none !important; }
    }
  `,

  /**
   * 3) SWEEP – rotirajoči konični gradient + rahli clouds
   */
  sweep: `
    body {
      position: relative;
      overflow-x: hidden;
      background: var(--bg) !important;
      isolation: isolate;
    }

    body::before, body::after {
      content: "";
      position: fixed;
      top: -90%;
      left: -90%;
      width: 280%;
      height: 280%;
      z-index: -2;
      pointer-events: none;
    }

    body::before {
      opacity: 0.45;
      filter: blur(80px);
      transform-origin: 50% 50%;
      background: conic-gradient(
        from 0deg at 50% 50%,
        var(--primary),
        var(--accent),
        var(--primary-d),
        var(--primary)
      );
      animation: rotateSweep 20s linear infinite;
    }

    body::after {
      opacity: 0.20;
      filter: blur(100px);
      background: radial-gradient(circle at center, var(--muted) 0%, transparent 65%);
      animation: moveSweepClouds 24s ease-in-out infinite;
    }

    @keyframes rotateSweep {
      to { transform: rotate(360deg); }
    }

    @keyframes moveSweepClouds {
      0%   { transform: translate(-3%, -4%) scale(1.0); }
      50%  { transform: translate(4%, 3%)  scale(1.08); }
      100% { transform: translate(-3%, -4%) scale(1.0); }
    }

    @media (prefers-reduced-motion: reduce) {
      body::before, body::after { animation: none !important; }
    }
  `,

  /**
   * 4) GRID – mreža + potujoč radialni pulz
   */
  grid: `
    body {
      position: relative;
      overflow-x: hidden;
      background: var(--bg) !important;
      isolation: isolate;
    }

    body::after {
      content: "";
      position: fixed;
      top: -100%;
      left: -100%;
      width: 300%;
      height: 300%;
      z-index: -2;
      pointer-events: none;
      opacity: 0.35;
      background:
        repeating-linear-gradient(0deg,  var(--grid-stroke), var(--grid-stroke) 1px, transparent 1px, transparent 40px),
        repeating-linear-gradient(90deg, var(--grid-stroke), var(--grid-stroke) 1px, transparent 1px, transparent 40px);
      animation: gridDrift 30s ease-in-out infinite;
    }

    body::before {
      content: "";
      position: fixed;
      top: -100%;
      left: -100%;
      width: 300%;
      height: 300%;
      z-index: -2;
      pointer-events: none;
      opacity: 0.45;
      filter: blur(70px);
      background: radial-gradient(circle at center, var(--grid-fill) 0%, transparent 60%);
      animation: pulseTravel 22s ease-in-out infinite;
    }

    @keyframes gridDrift {
      0%   { transform: translate(0%, 0%); }
      50%  { transform: translate(3%, -3%); }
      100% { transform: translate(0%, 0%); }
    }

    @keyframes pulseTravel {
      0%   { transform: translate(-12%, -10%) scale(1.1); }
      50%  { transform: translate(12%, 8%)   scale(1.4); }
      100% { transform: translate(-12%, -10%) scale(1.1); }
    }

    @media (prefers-reduced-motion: reduce) {
      body::before, body::after { animation: none !important; }
    }
  `,

  /**
   * 5) BOKEH – več premikajočih se barvnih madežev
   */
  bokeh: `
    body {
      position: relative;
      overflow-x: hidden;
      background: var(--bg) !important;
      isolation: isolate;
    }

    body::before, body::after {
      content: "";
      position: fixed;
      top: -90%;
      left: -90%;
      width: 280%;
      height: 280%;
      z-index: -2;
      pointer-events: none;
    }

    body::before {
      opacity: 0.35;
      filter: blur(80px);
      transform: scale(1.2);
      background:
        radial-gradient(120px 120px at 20% 30%, var(--accent), transparent 70%),
        radial-gradient(160px 160px at 80% 20%, var(--primary), transparent 70%),
        radial-gradient(100px 100px at 30% 80%, var(--muted),  transparent 70%),
        radial-gradient(140px 140px at 70% 70%, var(--primary-d), transparent 70%);
      animation: bokehDriftA 26s ease-in-out infinite;
    }

    body::after {
      opacity: 0.25;
      filter: blur(100px);
      transform: scale(1.3);
      background:
        radial-gradient(200px 200px at 50% 50%, var(--bubble), transparent 75%),
        radial-gradient(140px 140px at 15% 75%, var(--accent), transparent 70%),
        radial-gradient(120px 120px at 85% 50%, var(--primary), transparent 70%);
      animation: bokehDriftB 34s ease-in-out infinite reverse;
    }

    @keyframes bokehDriftA {
      0%   { transform: translate(0%, 0%)   scale(1.2); }
      50%  { transform: translate(4%, -3%)  scale(1.3); }
      100% { transform: translate(0%, 0%)   scale(1.2); }
    }

    @keyframes bokehDriftB {
      0%   { transform: translate(0%, 0%)   scale(1.3); }
      50%  { transform: translate(-3%, 3%)  scale(1.4); }
      100% { transform: translate(0%, 0%)   scale(1.3); }
    }

    @media (prefers-reduced-motion: reduce) {
      body::before, body::after { animation: none !important; }
    }
  `,
};

const STYLE_ID = 'dynamic-bg-style-inline';

export function setDynamicBackgroundAnimation(name) {
  if (!animations[name]) {
    return null;
  }
  
  // Shranimo zadnjo uporabljeno animacijo
  window._lastBodyBgKey = name;

  let styleEl = document.getElementById(STYLE_ID);
  if (styleEl) {
    styleEl.remove();
  }

  const styleElNew = document.createElement('style');
  styleElNew.id = STYLE_ID;
  styleElNew.textContent = animations[name];
  document.head.appendChild(styleElNew);
}

export function initDynamicBackground() {
  const keys = Object.keys(animations);
  const lastKey = window._lastBodyBgKey;
  let randomKey = keys[Math.floor(Math.random() * keys.length)];

  if (keys.length > 1 && randomKey === lastKey) {
    randomKey = keys.filter(k => k !== lastKey)[Math.floor(Math.random() * (keys.length - 1))];
  }

  setDynamicBackgroundAnimation(randomKey);
}

// MathGame.js pokliče initDynamicBackground() znotraj initGame() za menjavo ob novi igri.
