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
  // 1. DVOJNI MATEMATIČNI GRID z intenzivnimi gradienti in delci
  stableGrid: `
    body {
      background-color: var(--bg) !important;
      background-image: 
        radial-gradient(at 0% 0%, var(--primary) 0px, transparent 60%),
        radial-gradient(at 100% 0%, var(--accent) 0px, transparent 60%),
        radial-gradient(at 0% 100%, var(--primary-d) 0px, transparent 60%),
        radial-gradient(at 100% 100%, var(--bubble) 0px, transparent 60%);
      background-attachment: fixed;
      position: relative;
      overflow: hidden;
    }
    body::before { /* Glavna mreža */
      content: "";
      position: fixed;
      inset: -100px;
      z-index: -1;
      opacity: 0.35;
      background-image: 
        linear-gradient(var(--grid-stroke) 1px, transparent 1px),
        linear-gradient(90deg, var(--grid-stroke) 1px, transparent 1px);
      background-size: 50px 50px;
      animation: gridSlide 35s linear infinite;
    }
    body::after { /* Lebdeči delci (simboli) */
      content: "";
      position: fixed;
      inset: -50px;
      z-index: -1;
      opacity: 0.15;
      background-image: 
        radial-gradient(circle at 10% 20%, var(--ink) 1px, transparent 2px, transparent 15px), /* Krog */
        radial-gradient(closest-side at 50% 50%, var(--primary) 1px, transparent 2px, transparent 20px), /* Plus */
        radial-gradient(ellipse at 90% 80%, var(--accent) 1px, transparent 2px, transparent 18px); /* Minus */
      background-size: 80px 80px;
      background-repeat: repeat;
      animation: symbolsFloat 40s linear infinite alternate;
    }
    @keyframes gridSlide { from { transform: translate3d(0, 0, 0); } to { transform: translate3d(50px, 50px, 0); } }
    @keyframes symbolsFloat {
      0% { transform: translate3d(-10%, -5%, 0) scale(1); }
      100% { transform: translate3d(10%, 5%, 0) scale(1.05); }
    }
  `,

  // 2. MOIRÉ PIKE na intenzivnem barvnem polju z delci
  stableMoire: `
    body {
      background-color: var(--bg) !important;
      background-image: 
        linear-gradient(180deg, var(--primary-d) 0%, transparent 50%),
        linear-gradient(0deg, var(--accent) 0%, transparent 50%),
        radial-gradient(at 50% 50%, var(--bubble) 0px, transparent 70%);
      background-attachment: fixed;
      position: relative;
      overflow: hidden;
    }
    body::before { /* Prva plast pik */
      content: "";
      position: fixed;
      inset: -150%;
      z-index: -1;
      opacity: 0.25;
      background-image: radial-gradient(var(--ink) 1px, transparent 1px);
      background-size: 35px 35px;
      animation: moireRotateA 70s linear infinite;
    }
    body::after { /* Druga plast pik in simboli */
      content: "";
      position: fixed;
      inset: -150%;
      z-index: -1;
      opacity: 0.2;
      background-image: 
        radial-gradient(var(--primary) 1px, transparent 1px), /* Druge pike */
        radial-gradient(circle at 20% 70%, var(--accent-d) 1px, transparent 15px), /* Krog */
        radial-gradient(closest-side at 70% 30%, var(--primary-d) 1px, transparent 18px); /* Plus/Minus */
      background-size: 37px 37px, 100px 100px; /* Dve velikosti ozadja */
      background-repeat: repeat;
      animation: moireRotateB 90s linear infinite reverse;
    }
    @keyframes moireRotateA { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    @keyframes moireRotateB { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
  `,

  // 3. VECTOR FLOW na linearnem gradientu z delci
  vectorWaves: `
    body {
      background-color: var(--bg) !important;
      background-image: 
        linear-gradient(to right, var(--bg) 0%, var(--bubble) 50%, var(--bg) 100%),
        linear-gradient(to bottom, var(--primary) 0%, transparent 50%);
      background-attachment: fixed;
      position: relative;
      overflow: hidden;
    }
    body::before { /* Valovanje */
      content: "";
      position: fixed;
      inset: -100%;
      z-index: -1;
      opacity: 0.2;
      background: repeating-linear-gradient(
        45deg,
        transparent 0,
        transparent 25px,
        var(--ink) 26px,
        var(--ink) 27px
      );
      animation: waveSkew 25s ease-in-out infinite alternate;
    }
    body::after { /* Lebdeči simboli */
      content: "";
      position: fixed;
      inset: -50px;
      z-index: -1;
      opacity: 0.1;
      background-image: 
        radial-gradient(circle at 30% 60%, var(--accent) 1px, transparent 12px), /* Krog */
        radial-gradient(closest-side at 80% 10%, var(--primary-d) 1px, transparent 15px); /* Plus/Minus */
      background-size: 70px 70px;
      background-repeat: repeat;
      animation: symbolsFloat 50s linear infinite reverse;
    }
    @keyframes waveSkew {
      0% { transform: skewY(-8deg) translate3d(0, -3%, 0); }
      100% { transform: skewY(8deg) translate3d(0, 3%, 0); }
    }
    @keyframes symbolsFloat {
      0% { transform: translate3d(10%, 5%, 0) scale(1); }
      100% { transform: translate3d(-10%, -5%, 0) scale(1.05); }
    }
  `,

  // 4. HEXA-CORE s statičnimi barvnimi poudarki in delci
  hexaCore: `
    body {
      background-color: var(--bg) !important;
      background-image: 
        radial-gradient(at 20% 20%, var(--accent) 0%, transparent 50%),
        radial-gradient(at 80% 80%, var(--primary) 0%, transparent 50%);
      background-attachment: fixed;
      position: relative;
      overflow: hidden;
    }
    body::before { /* Heksagonalna mreža */
      content: "";
      position: fixed;
      inset: -50px;
      z-index: -1;
      opacity: 0.15;
      background-image: 
        radial-gradient(circle at center, var(--ink) 10%, transparent 11%);
      background-size: 50px 86.6px; /* Heksagonalno razmerje */
      background-position: 0 0, 25px 43.3px;
      animation: hexaShift 25s linear infinite;
    }
    body::after { /* Lebdeči simboli */
      content: "";
      position: fixed;
      inset: -50px;
      z-index: -1;
      opacity: 0.08;
      background-image: 
        radial-gradient(circle at 15% 85%, var(--primary-d) 1px, transparent 10px), /* Krog */
        radial-gradient(closest-side at 60% 30%, var(--bubble) 1px, transparent 13px); /* Plus/Minus */
      background-size: 60px 60px;
      background-repeat: repeat;
      animation: symbolsFloatFast 30s linear infinite alternate;
    }
    @keyframes hexaShift { from { background-position: 0 0, 25px 43.3px; } to { background-position: 50px 86.6px, 75px 129.9px; } }
    @keyframes symbolsFloatFast {
      0% { transform: translate3d(5%, 10%, 0) scale(1); }
      100% { transform: translate3d(-5%, -10%, 0) scale(1.03); }
    }
  `
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
    randomKey = keys.filter(k => k !== lastKey)[Math.floor(
        Math.random() * (keys.length - 1))];
  }

  setDynamicBackgroundAnimation(randomKey);
}

// MathGame.js pokliče initDynamicBackground() znotraj initGame() za menjavo ob novi igri.
