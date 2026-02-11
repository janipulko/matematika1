/**
 * Čista CSS rešitev za ozadja vsebnika (uporablja pseudo-elemente).
 */

function generateSoftGradient() {
  const angle = Math.floor(Math.random() * 360);
  return `linear-gradient(${angle}deg, 
    color-mix(in oklab, var(--primary), transparent 96%), 
    color-mix(in oklab, var(--accent), transparent 96%))`;
}

export const CONTAINER_ANIMATIONS = {
  triangularMesh: (grad) => `
    .container { 
      background: var(--card) ${grad} !important; 
      position: relative; isolation: isolate; overflow: hidden;
    }
    .container::before {
      content: ""; position: absolute; inset: -20%; z-index: -1; opacity: 0.25;
      background-image: 
        linear-gradient(30deg, var(--primary) 12%, transparent 12.5%, transparent 87%, var(--primary) 87.5%, var(--primary)),
        linear-gradient(150deg, var(--primary) 12%, transparent 12.5%, transparent 87%, var(--primary) 87.5%, var(--primary)),
        linear-gradient(60deg, var(--accent) 25%, transparent 25.5%, transparent 75%, var(--accent) 75%, var(--accent));
      background-size: 80px 140px;
      animation: triangularMove 60s linear infinite;
    }
    @keyframes triangularMove {
      0% { transform: translate(0, 0) rotate(0deg); }
      50% { transform: translate(40px, 30px) rotate(1.5deg); }
      100% { transform: translate(0, 0) rotate(0deg); }
    }
  `,

  fractalGrid: (grad) => `
    .container { 
      background: var(--card) ${grad} !important; 
      position: relative; isolation: isolate; overflow: hidden;
    }
    .container::before {
      content: ""; position: absolute; inset: -20%; z-index: -1; opacity: 0.2;
      background: 
        repeating-linear-gradient(0deg, var(--primary) 0 1px, transparent 1px 40px),
        repeating-linear-gradient(90deg, var(--primary) 0 1px, transparent 1px 40px);
      animation: gridDriftCnt 60s linear infinite;
    }
    @keyframes gridDriftCnt {
      0% { transform: translate(0, 0) rotate(0deg); }
      100% { transform: translate(60px, 60px) rotate(2deg); }
    }
  `,

  moireDots: (grad) => `
    .container { 
      background: var(--card) ${grad} !important; 
      position: relative; isolation: isolate; overflow: hidden;
    }
    .container::before {
      content: ""; position: absolute; inset: -30%; z-index: -1; opacity: 0.3;
      background-image: radial-gradient(var(--primary) 1.5px, transparent 1.5px);
      background-size: 32px 32px;
      animation: rotateMoireCnt 100s linear infinite;
    }
    @keyframes rotateMoireCnt {
      from { transform: rotate(0deg) scale(1.3); }
      to { transform: rotate(360deg) scale(1.3); }
    }
  `,

  vectorField: (grad) => `
    .container { 
      background: var(--card) ${grad} !important; 
      position: relative; isolation: isolate; overflow: hidden;
    }
    .container::before {
      content: ""; position: absolute; inset: -20%; z-index: -1; opacity: 0.2;
      background-image: linear-gradient(90deg, var(--primary) 1px, transparent 1px);
      background-size: 40px 40px;
      animation: vectorFlow 50s linear infinite alternate;
    }
    @keyframes vectorFlow {
      from { transform: skewY(-5deg) translate(-40px, 0); }
      to { transform: skewY(5deg) translate(40px, 0); }
    }
  `
  // Po potrebi dodaj še ostale iz prejšnjega seznama na enak način...
};

/**
 * Glavna funkcija, ki vrne CSS string za container.
 */
export function getContainerBgAnimation() {
  const keys = Object.keys(CONTAINER_ANIMATIONS);
  const lastKey = window._lastContainerBgKey;
  let randomKey = keys[Math.floor(Math.random() * keys.length)];

  if (keys.length > 1 && randomKey === lastKey) {
    randomKey = keys.filter(k => k !== lastKey)[Math.floor(Math.random() * (keys.length - 1))];
  }
  window._lastContainerBgKey = randomKey;

  const grad = generateSoftGradient();

  // Vrnemo čisti CSS brez @media (prefers-reduced-motion) bloka,
  // da zagotovimo delovanje ne glede na sistemske nastavitve.
  return `
    ${CONTAINER_ANIMATIONS[randomKey](grad)}
    
    /* Zagotovimo, da nobena druga nastavitev ne povozi animacije */
    .container::before {
        display: block !important;
        visibility: visible !important;
        pointer-events: none !important;
    }
  `;
}