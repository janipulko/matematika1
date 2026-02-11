/**
 * Dinamične animacije v obliki { ime: 'css string' }.
 */

function generateIntenseGradient() {
  const types = ['linear', 'radial'];
  const type = types[Math.floor(Math.random() * types.length)];
  const colors = ['var(--primary)', 'var(--accent)', 'var(--primary-d)', 'var(--bubble)'];
  const shuffled = [...colors].sort(() => 0.5 - Math.random());
  const [c1, c2, c3 = 'var(--bg)'] = shuffled;

  if (type === 'linear') {
    const angle = Math.floor(Math.random() * 360);
    return `linear-gradient(${angle}deg, ${c1} 0%, ${c2} 50%, ${c3} 100%)`;
  } else {
    const x = Math.floor(Math.random() * 100), y = Math.floor(Math.random() * 100);
    return `radial-gradient(at ${x}% ${y}%, ${c1} 0%, ${c2} 60%, ${c3} 100%)`;
  }
}

export const animations = {
  // 1. DVOJNI MATEMATIČNI GRID
  stableGrid: () => `
    #bg-pattern {
      opacity: 0.45;
      background-image: 
        linear-gradient(var(--grid-stroke) 1px, transparent 1px),
        linear-gradient(90deg, var(--grid-stroke) 1px, transparent 1px);
      background-size: 50px 50px;
      animation: gridDrift 80s linear infinite;
    }
    @keyframes gridDrift {
      0% { transform: translate3d(0, 0, 0) rotate(0deg); }
      50% { transform: translate3d(60px, 40px, 0) rotate(2deg); }
      100% { transform: translate3d(0, 0, 0) rotate(0deg); }
    }
  `,

  // 2. MOIRÉ PIKE
  stableMoire: () => `
    #bg-pattern {
      opacity: 0.4;
      background-image: radial-gradient(var(--ink) 1.5px, transparent 1.5px);
      background-size: 35px 35px;
      animation: moireRotate 20s linear infinite;
    }
    @keyframes moireRotate {
      from { transform: rotate(0deg) scale(1.2); }
      to { transform: rotate(360deg) scale(1.2); }
    }
  `,

  // 3. VECTOR FLOW (Geometrijske črte)
  vectorWaves: () => `
    #bg-pattern {
      opacity: 0.35;
      background: repeating-linear-gradient(
        45deg,
        transparent 0,
        transparent 25px,
        var(--ink) 26px,
        var(--ink) 27px
      );
      animation: waveDrift 80s ease-in-out infinite alternate;
    }
    @keyframes waveDrift {
      from { transform: skewY(-2deg) scale(1.1) translate3d(-30px, -20px, 0); }
      to { transform: skewY(2deg) scale(1.1) translate3d(30px, 20px, 0); }
    }
  `,

  // 4. HEXA-CORE (Matematični vzorec)
  hexaCore: () => `
    #bg-pattern {
      opacity: 0.35;
      background-image: radial-gradient(circle at center, var(--ink) 10%, transparent 11%);
      background-size: 50px 86.6px;
      background-position: 0 0, 25px 43.3px;
      animation: hexaDrift 80s linear infinite alternate;
    }
    @keyframes hexaDrift {
      from { transform: scale(1.2) translate3d(-40px, -30px, 0) rotate(-1.5deg); }
      to { transform: scale(1.2) translate3d(40px, 30px, 0) rotate(1.5deg); }
    }
  `
};

const STYLE_ID = 'dynamic-bg-style-inline';
const GRADIENT_ID = 'bg-static-gradient';
const PATTERN_ID = 'bg-pattern';

export function setDynamicBackgroundAnimation(name) {
  if (!animations[name]) return;

  // 1. Ustvari ali posodobi fizična DIV elementa
  let gradDiv = document.getElementById(GRADIENT_ID);
  if (!gradDiv) {
    gradDiv = document.createElement('div');
    gradDiv.id = GRADIENT_ID;
    document.body.prepend(gradDiv);
  }

  let patternDiv = document.getElementById(PATTERN_ID);
  if (!patternDiv) {
    patternDiv = document.createElement('div');
    patternDiv.id = PATTERN_ID;
    document.body.prepend(patternDiv);
  }

  // 2. Generiraj barve in nastavi stil gradienta
  const grad = generateIntenseGradient();
  gradDiv.style.backgroundImage = grad;

  // 3. Posodobi CSS animacije
  let styleEl = document.getElementById(STYLE_ID);
  if (styleEl) styleEl.remove();

  const css = `
    body {
      margin: 0;
      padding: 0;
      overflow: hidden;
      background-color: var(--bg);
    }
    #${GRADIENT_ID} {
      position: fixed;
      inset: 0;
      z-index: -10;
      pointer-events: none;
    }
    #${PATTERN_ID} {
      position: fixed;
      inset: -20%; /* Večji robovi za rotacijo */
      z-index: -9;
      pointer-events: none;
      will-change: transform;
    }
    ${animations[name]()}
   
  `;

  const styleElNew = document.createElement('style');
  styleElNew.id = STYLE_ID;
  styleElNew.textContent = css;
  document.head.appendChild(styleElNew);
}

export function initDynamicBackground() {
  const keys = Object.keys(animations);
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  setDynamicBackgroundAnimation(randomKey);
}