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
  neonStorm: `
    body {
      position: relative;
      overflow: hidden;
      background: var(--bg) !important;
      isolation: isolate;
    }

    body::before, body::after {
      content: "";
      position: fixed;
      inset: -100%;
      z-index: -2;
      pointer-events: none;
      background-size: 300% 300%;
      will-change: background-position, transform, filter, opacity;
    }

    body::before {
      opacity: 0.9;
      filter: blur(70px) saturate(2);
      mix-blend-mode: overlay;
      background:
        linear-gradient(100deg, var(--primary) 0%, var(--accent) 50%, var(--primary-d) 100%);
      animation: neonSweepA 8s ease-in-out infinite;
    }

    body::after {
      opacity: 0.7;
      filter: blur(90px) saturate(2.2) contrast(1.1);
      mix-blend-mode: hard-light;
      background:
        linear-gradient(-100deg, var(--accent) 0%, var(--bubble) 50%, var(--primary) 100%);
      animation: neonSweepB 10s ease-in-out infinite reverse;
    }

    @keyframes neonSweepA {
      0%   { background-position: 0% 40%; transform: scale(1.1); }
      50%  { background-position: 100% 60%; transform: scale(1.2); }
      100% { background-position: 0% 40%; transform: scale(1.1); }
    }

    @keyframes neonSweepB {
      0%   { background-position: 100% 60%; transform: scale(1.15); }
      50%  { background-position: 0% 40%;   transform: scale(1.25); }
      100% { background-position: 100% 60%; transform: scale(1.15); }
    }

    @media (prefers-reduced-motion: reduce) {
      body::before, body::after { animation: none !important; }
    }
  `,
  vortex: `
    body {
      position: relative;
      overflow: hidden;
      background: var(--bg) !important;
      isolation: isolate;
    }

    body::before, body::after {
      content: "";
      position: fixed;
      inset: -110%;
      z-index: -2;
      pointer-events: none;
      will-change: transform, filter, opacity;
    }

    body::before {
      opacity: 0.8;
      filter: blur(70px) saturate(2.1);
      mix-blend-mode: hard-light;
      background:
        conic-gradient(
          from 0deg at 50% 50%,
          var(--primary),
          var(--accent),
          var(--bubble),
          var(--primary-d),
          var(--primary)
        );
      animation: vortexRotate 12s linear infinite;
    }

    body::after {
      opacity: 0.7;
      filter: blur(90px) saturate(2.3);
      mix-blend-mode: overlay;
      background:
        radial-gradient(40% 40% at 25% 25%, var(--accent), transparent 65%),
        radial-gradient(35% 35% at 75% 30%, var(--primary), transparent 65%),
        radial-gradient(45% 45% at 50% 75%, var(--primary-d), transparent 65%);
      animation: vortexPulse 16s ease-in-out infinite alternate;
    }

    @keyframes vortexRotate {
      0%   { transform: rotate(0deg) scale(1.05); }
      50%  { transform: rotate(180deg) scale(1.22); }
      100% { transform: rotate(360deg) scale(1.05); }
    }

    @keyframes vortexPulse {
      0%   { transform: translate(-7%, -5%) scale(1.1); }
      50%  { transform: translate(7%, 6%)    scale(1.27); }
      100% { transform: translate(-7%, -5%) scale(1.1); }
    }

    @media (prefers-reduced-motion: reduce) {
      body::before, body::after { animation: none !important; }
    }
  `,
  auroraMax: `
    body {
      position: relative;
      overflow: hidden;
      background: var(--bg) !important;
      isolation: isolate;
    }

    /* Aurora trakovi */
    body::before {
      content: "";
      position: fixed;
      inset: -120%;
      z-index: -2;
      pointer-events: none;
      opacity: 0.85;
      filter: blur(90px) saturate(2.1) hue-rotate(8deg);
      mix-blend-mode: overlay;
      background:
        radial-gradient(50% 35% at 20% 40%, var(--accent), transparent 60%),
        radial-gradient(40% 30% at 65% 25%, var(--primary), transparent 60%),
        radial-gradient(45% 40% at 70% 70%, var(--bubble), transparent 65%);
      animation: auroraFlow 18s ease-in-out infinite alternate;
    }

    /* Dodatna globina z conic gradientom */
    body::after {
      content: "";
      position: fixed;
      inset: -110%;
      z-index: -2;
      pointer-events: none;
      opacity: 0.65;
      filter: blur(75px) saturate(1.9);
      mix-blend-mode: hard-light;
      background:
        conic-gradient(
          from 45deg at 50% 50%,
          var(--primary-d),
          var(--accent),
          var(--primary),
          var(--accent),
          var(--primary-d)
        );
      animation: auroraSpin 22s linear infinite reverse;
    }

    @keyframes auroraFlow {
      0%   { transform: translate(-6%, 4%) scale(1.1); }
      50%  { transform: translate(6%, -5%) scale(1.25); }
      100% { transform: translate(-6%, 4%) scale(1.1); }
    }

    @keyframes auroraSpin {
      0%   { transform: rotate(0deg) }
      100% { transform: rotate(360deg) }
    }

    @media (prefers-reduced-motion: reduce) {
      body::before, body::after { animation: none !important; }
    }
  `, bokehPulseMax: `
    body {
      position: relative;
      overflow: hidden;
      background: var(--bg) !important;
      isolation: isolate;
    }

    body::before, body::after {
      content: "";
      position: fixed;
      inset: -100%;
      z-index: -2;
      pointer-events: none;
      will-change: transform, filter, opacity;
    }

    body::before {
      opacity: 0.85;
      filter: blur(90px) saturate(2.2) contrast(1.2);
      mix-blend-mode: hard-light;
      background:
        radial-gradient(30% 30% at 15% 30%, var(--accent), transparent 70%),
        radial-gradient(35% 35% at 80% 20%, var(--primary), transparent 70%),
        radial-gradient(28% 28% at 30% 80%, var(--bubble),  transparent 70%),
        radial-gradient(32% 32% at 70% 70%, var(--primary-d), transparent 70%);
      animation: bokehMaxA 20s ease-in-out infinite;
    }

    body::after {
      opacity: 0.7;
      filter: blur(110px) saturate(2.4) brightness(1.1);
      mix-blend-mode: overlay;
      background:
        radial-gradient(40% 40% at 50% 50%, var(--bubble), transparent 75%),
        radial-gradient(28% 28% at 15% 75%, var(--accent), transparent 70%),
        radial-gradient(30% 30% at 85% 50%, var(--primary), transparent 70%);
      animation: bokehMaxB 26s ease-in-out infinite reverse;
    }

    @keyframes bokehMaxA {
      0%   { transform: translate(0%, 0%)   scale(1.15); }
      50%  { transform: translate(6%, -5%)  scale(1.3); }
      100% { transform: translate(0%, 0%)   scale(1.15); }
    }

    @keyframes bokehMaxB {
      0%   { transform: translate(0%, 0%)   scale(1.2); }
      50%  { transform: translate(-5%, 6%)  scale(1.35); }
      100% { transform: translate(0%, 0%)   scale(1.2); }
    }

    @media (prefers-reduced-motion: reduce) {
      body::before, body::after { animation: none !important; }
    }
  `,
  plasma: `
    body {
      position: relative;
      overflow: hidden;
      background: var(--bg) !important;
      isolation: isolate;
    }

    body::before, body::after {
      content: "";
      position: fixed;
      inset: -120%;
      z-index: -2;
      pointer-events: none;
      will-change: transform, filter, opacity;
    }

    /* Glavni plazemski stožec (končni gradient) */
    body::before {
      opacity: 0.85;
      filter: blur(60px) saturate(1.8) contrast(1.15);
      mix-blend-mode: hard-light;
      background:
        conic-gradient(
          from 0deg at 50% 50%,
          var(--primary),
          var(--accent),
          var(--primary-d),
          var(--bubble),
          var(--accent),
          var(--primary)
        );
      animation: plasmaSpin 14s linear infinite;
    }

    /* Radialni “plameni” */
    body::after {
      opacity: 0.75;
      filter: blur(80px) saturate(2.2) brightness(1.05);
      mix-blend-mode: overlay;
      background:
        radial-gradient(35% 35% at 20% 30%, var(--accent), transparent 70%),
        radial-gradient(45% 45% at 80% 25%, var(--primary-d), transparent 70%),
        radial-gradient(40% 40% at 50% 70%, var(--primary), transparent 70%);
      animation: plasmaDrift 18s ease-in-out infinite alternate;
    }

    @keyframes plasmaSpin {
      0%   { transform: rotate(0deg) scale(1.1); }
      50%  { transform: rotate(180deg) scale(1.2); }
      100% { transform: rotate(360deg) scale(1.1); }
    }

    @keyframes plasmaDrift {
      0%   { transform: translate(-6%, -4%) scale(1.15); }
      50%  { transform: translate(6%, 5%)   scale(1.28); }
      100% { transform: translate(-6%, -4%) scale(1.15); }
    }

    @media (prefers-reduced-motion: reduce) {
      body::before, body::after { animation: none !important; }
    }
  `,
  grid:
      `
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
  `
}

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
    randomKey = keys.filter(k => k !== lastKey)[Math.floor(
        Math.random() * (keys.length - 1))];
  }

  setDynamicBackgroundAnimation(randomKey);
}

// MathGame.js pokliče initDynamicBackground() znotraj initGame() za menjavo ob novi igri.
