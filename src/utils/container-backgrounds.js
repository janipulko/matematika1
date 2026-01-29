/**
 * Animacije za ozadje glavnega vsebnika (container) v MathGame.js.
 * Vsaka animacija vrne CSS string, ki vključuje definicijo .container ozadja in pripadajoče @keyframes.
 */

export const CONTAINER_ANIMATIONS = {
  triangularMesh: `
    .container {
      background: color-mix(in oklab, var(--card), var(--bg) 5%);
      position: relative;
      isolation: isolate;
    }
    .container::before {
      content: "";
      position: absolute;
      inset: -100%;
      z-index: -1;
      opacity: 0.12;
      background-image: 
        linear-gradient(30deg, var(--primary) 12%, transparent 12.5%, transparent 87%, var(--primary) 87.5%, var(--primary)),
        linear-gradient(150deg, var(--primary) 12%, transparent 12.5%, transparent 87%, var(--primary) 87.5%, var(--primary)),
        linear-gradient(30deg, var(--primary) 12%, transparent 12.5%, transparent 87%, var(--primary) 87.5%, var(--primary)),
        linear-gradient(150deg, var(--primary) 12%, transparent 12.5%, transparent 87%, var(--primary) 87.5%, var(--primary)),
        linear-gradient(60deg, color-mix(in oklab, var(--accent), transparent 50%) 25%, transparent 25.5%, transparent 75%, color-mix(in oklab, var(--accent), transparent 50%) 75%, color-mix(in oklab, var(--accent), transparent 50%)),
        linear-gradient(60deg, color-mix(in oklab, var(--accent), transparent 50%) 25%, transparent 25.5%, transparent 75%, color-mix(in oklab, var(--accent), transparent 50%) 75%, color-mix(in oklab, var(--accent), transparent 50%));
      background-size: 80px 140px;
      background-position: 0 0, 0 0, 40px 70px, 40px 70px, 0 0, 40px 70px;
      animation: triangularMove 60s linear infinite;
    }
    @keyframes triangularMove {
      from { transform: translate(0, 0); }
      to { transform: translate(80px, 140px); }
    }
  `,

  orbitingCircles: `
    .container {
      background: color-mix(in oklab, var(--card), var(--bg) 5%);
      position: relative;
      isolation: isolate;
    }
    .container::before, .container::after {
      content: "";
      position: absolute;
      width: 150px;
      height: 150px;
      border: 1px dashed color-mix(in oklab, var(--primary), transparent 70%);
      border-radius: 50%;
      top: 50%;
      left: 50%;
      z-index: -1;
    }
    .container::before {
      animation: orbitA 20s linear infinite;
    }
    .container::after {
      width: 250px;
      height: 250px;
      border-color: color-mix(in oklab, var(--accent), transparent 70%);
      animation: orbitB 30s linear infinite;
    }
    @keyframes orbitA {
      from { transform: translate(-50%, -50%) rotate(0deg) translateX(80px) rotate(0deg); }
      to { transform: translate(-50%, -50%) rotate(360deg) translateX(80px) rotate(-360deg); }
    }
    @keyframes orbitB {
      from { transform: translate(-50%, -50%) rotate(360deg) translateX(120px) rotate(-360deg); }
      to { transform: translate(-50%, -50%) rotate(0deg) translateX(120px) rotate(0deg); }
    }
  `,

  fourierAnalysis: `
    .container {
      background: color-mix(in oklab, var(--card), var(--bg) 5%);
      position: relative;
      isolation: isolate;
    }
    .container::before {
      content: "";
      position: absolute;
      inset: 0;
      z-index: -1;
      opacity: 0.15;
      background: 
        repeating-linear-gradient(90deg, transparent, transparent 40px, var(--primary) 40px, var(--primary) 41px),
        repeating-linear-gradient(0deg, transparent, transparent 40px, var(--primary) 40px, var(--primary) 41px);
      mask-image: radial-gradient(circle at var(--x, 50%) var(--y, 50%), black 0%, transparent 50%);
      animation: scanMove 10s ease-in-out infinite alternate;
    }
    @keyframes scanMove {
      0% { -webkit-mask-position: 0% 0%; mask-position: 0% 0%; }
      100% { -webkit-mask-position: 100% 100%; mask-position: 100% 100%; }
    }
    /* Poenostavljena fourier vizualizacija z uporabo sinusoide */
    .container::after {
      content: "";
      position: absolute;
      left: 0;
      right: 0;
      top: 50%;
      height: 2px;
      background: var(--accent);
      opacity: 0.2;
      z-index: -1;
      box-shadow: 0 0 15px var(--accent);
      animation: sineWave 4s ease-in-out infinite;
    }
    @keyframes sineWave {
      0%, 100% { transform: translateY(-20px) scaleY(1); }
      50% { transform: translateY(20px) scaleY(2); }
    }
  `,

  dataStream: `
    .container {
      background: color-mix(in oklab, var(--card), var(--bg) 5%);
      position: relative;
      isolation: isolate;
    }
    .container::before {
      content: "01101001 01101110 01100100 01100101 01111000";
      position: absolute;
      top: 0;
      left: 10px;
      font-family: monospace;
      font-size: 10px;
      color: var(--primary);
      opacity: 0.1;
      white-space: nowrap;
      animation: streamDown 15s linear infinite;
      z-index: -1;
    }
    .container::after {
      content: "";
      position: absolute;
      inset: 0;
      z-index: -2;
      background: 
        linear-gradient(90deg, color-mix(in oklab, var(--card), transparent 100%) 0%, color-mix(in oklab, var(--primary), transparent 95%) 50%, color-mix(in oklab, var(--card), transparent 100%) 100%);
      background-size: 200% 100%;
      animation: streamFlow 8s linear infinite;
    }
    @keyframes streamDown {
      from { transform: translateY(-100%); }
      to { transform: translateY(1000%); }
    }
    @keyframes streamFlow {
      from { background-position: 200% 0; }
      to { background-position: -200% 0; }
    }
  `,

  interferenceWaves: `
    .container {
      background: color-mix(in oklab, var(--card), var(--bg) 5%);
      position: relative;
      isolation: isolate;
    }
    .container::before, .container::after {
      content: "";
      position: absolute;
      inset: -50%;
      z-index: -1;
      opacity: 0.15;
      background: repeating-radial-gradient(
        circle at 50% 50%,
        var(--primary) 0,
        var(--primary) 2px,
        transparent 2px,
        transparent 40px
      );
    }
    .container::before {
      animation: waveMove 20s linear infinite;
    }
    .container::after {
      background: repeating-radial-gradient(
        circle at 50% 50%,
        var(--accent) 0,
        var(--accent) 2px,
        transparent 2px,
        transparent 40px
      );
      animation: waveMove 15s linear infinite reverse;
      left: -40%;
      top: -40%;
    }
    @keyframes waveMove {
      0% { transform: scale(1) translate(0, 0); }
      50% { transform: scale(1.1) translate(5%, 5%); }
      100% { transform: scale(1) translate(0, 0); }
    }
  `,

  geometricGrid: `
    .container {
      background: 
        linear-gradient(var(--card), var(--card)) padding-box,
        repeating-linear-gradient(
          45deg,
          color-mix(in oklab, var(--primary), transparent 80%) 0,
          color-mix(in oklab, var(--primary), transparent 80%) 2px,
          transparent 2px,
          transparent 30px
        ),
        repeating-linear-gradient(
          -45deg,
          color-mix(in oklab, var(--accent), transparent 80%) 0,
          color-mix(in oklab, var(--accent), transparent 80%) 2px,
          transparent 2px,
          transparent 30px
        );
      animation: gridShift 30s linear infinite;
    }
    @keyframes gridShift {
      from { background-position: 0 0, 0 0, 0 0; }
      to { background-position: 0 0, 120px 0, -120px 0; }
    }
  `,

  moireEffect: `
    .container {
      background: color-mix(in oklab, var(--card), var(--bg) 5%);
      position: relative;
      isolation: isolate;
    }
    .container::before, .container::after {
      content: "";
      position: absolute;
      inset: -100%;
      z-index: -1;
      opacity: 0.1;
      background-image: 
        radial-gradient(var(--ink) 1px, transparent 1px);
      background-size: 20px 20px;
    }
    .container::before {
      animation: moireA 25s linear infinite;
    }
    .container::after {
      background-size: 21px 21px;
      animation: moireB 30s linear infinite;
    }
    @keyframes moireA {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    @keyframes moireB {
      from { transform: rotate(360deg); }
      to { transform: rotate(0deg); }
    }
  `,

  mathTechnical: `
    .container {
      background: 
        color-mix(in oklab, var(--card), var(--bg) 3%) linear-gradient(
          to right, 
          color-mix(in oklab, var(--primary), transparent 90%) 1px, 
          transparent 1px
        ),
        linear-gradient(
          to bottom, 
          color-mix(in oklab, var(--primary), transparent 90%) 1px, 
          transparent 1px
        );
      background-size: 40px 40px;
      position: relative;
      isolation: isolate;
    }
    .container::before {
      content: "";
      position: absolute;
      inset: 0;
      z-index: -1;
      background: 
        repeating-linear-gradient(
          120deg,
          transparent,
          transparent 100px,
          color-mix(in oklab, var(--accent), transparent 90%) 100px,
          color-mix(in oklab, var(--accent), transparent 90%) 101px
        );
      animation: techSlide 20s linear infinite;
    }
    @keyframes techSlide {
      from { background-position: 0 0; }
      to { background-position: 200px 0; }
    }
  `,

  sinusoidPlot: `
    .container {
      background: color-mix(in oklab, var(--card), var(--bg) 5%);
      position: relative;
      isolation: isolate;
    }
    .container::before {
      content: "";
      position: absolute;
      inset: 0;
      z-index: -1;
      background-image: 
        linear-gradient(var(--primary) 1px, transparent 1px),
        linear-gradient(90deg, var(--primary) 1px, transparent 1px);
      background-size: 50px 50px;
      opacity: 0.05;
    }
    .container::after {
      content: "";
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      z-index: -1;
      background: radial-gradient(circle at center, var(--accent) 0%, transparent 10%);
      background-size: 100px 100px;
      animation: mathPlotMove 10s linear infinite;
      opacity: 0.1;
    }
    @keyframes mathPlotMove {
      from { background-position: 0 0; }
      to { background-position: 200px 100px; }
    }
  `,

  rotatingPentagons: `
    .container {
      background: color-mix(in oklab, var(--card), var(--bg) 5%);
      position: relative;
      isolation: isolate;
    }
    .container::before {
      content: "";
      position: absolute;
      width: 40px;
      height: 40px;
      top: 10%;
      left: 10%;
      background: var(--primary);
      clip-path: polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%);
      opacity: 0.1;
      animation: pentagonMove 25s ease-in-out infinite alternate;
      z-index: -1;
    }
    .container::after {
      content: "";
      position: absolute;
      width: 60px;
      height: 60px;
      bottom: 15%;
      right: 15%;
      background: var(--accent);
      clip-path: polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%);
      opacity: 0.1;
      animation: pentagonMove 30s ease-in-out infinite alternate-reverse;
      z-index: -1;
    }
    @keyframes pentagonMove {
      0% { transform: translate(0, 0) rotate(0deg) scale(1); }
      100% { transform: translate(100px, 50px) rotate(360deg) scale(1.5); }
    }
  `,

  hexagonalField: `
    .container {
      background: color-mix(in oklab, var(--card), var(--bg) 5%);
      position: relative;
      isolation: isolate;
    }
    .container::before {
      content: "";
      position: absolute;
      inset: 0;
      z-index: -1;
      opacity: 0.08;
      background-image: 
        radial-gradient(circle at center, var(--primary) 20%, transparent 20%),
        radial-gradient(circle at center, var(--accent) 20%, transparent 20%);
      background-size: 60px 104px;
      background-position: 0 0, 30px 52px;
      animation: hexMove 20s linear infinite;
    }
    @keyframes hexMove {
      from { background-position: 0 0, 30px 52px; }
      to { background-position: 60px 104px, 90px 156px; }
    }
  `,

  goldenRatio: `
    .container {
      background: color-mix(in oklab, var(--card), var(--bg) 5%);
      position: relative;
      isolation: isolate;
    }
    .container::before {
      content: "";
      position: absolute;
      inset: 0;
      z-index: -1;
      background-image: 
        conic-gradient(
          from 0deg at 50% 50%,
          transparent 0deg,
          color-mix(in oklab, var(--primary), transparent 85%) 1deg,
          transparent 2deg
        );
      animation: rotateSlow 40s linear infinite;
    }
    .container::after {
      content: "";
      position: absolute;
      inset: 10%;
      z-index: -1;
      background-image: 
        conic-gradient(
          from 180deg at 50% 50%,
          transparent 0deg,
          color-mix(in oklab, var(--accent), transparent 85%) 1deg,
          transparent 2deg
        );
      animation: rotateSlow 30s linear infinite reverse;
    }
    @keyframes rotateSlow {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `,

  fibonacciSpiral: `
    .container {
      background: color-mix(in oklab, var(--card), var(--bg) 5%);
      position: relative;
      isolation: isolate;
      overflow: hidden;
    }
    .container::before {
      content: "";
      position: absolute;
      top: 50%;
      left: 50%;
      width: 1000px;
      height: 1000px;
      margin-top: -500px;
      margin-left: -500px;
      z-index: -1;
      background-image: radial-gradient(circle at center, transparent 0%, transparent 100%), 
                        repeating-radial-gradient(circle at center, transparent 0, transparent 20px, color-mix(in oklab, var(--primary), transparent 85%) 20px, color-mix(in oklab, var(--primary), transparent 85%) 21px);
      animation: fibonacciPulse 15s ease-in-out infinite alternate;
    }
    @keyframes fibonacciPulse {
      0% { transform: scale(1) rotate(0deg); opacity: 0.3; }
      100% { transform: scale(1.5) rotate(45deg); opacity: 0.6; }
    }
  `,

  matrixRain: `
    .container {
      background: color-mix(in oklab, var(--card), var(--bg) 5%);
      position: relative;
      isolation: isolate;
    }
    .container::before {
      content: "π ∞ ∑ √ ∫ ∆ ∏";
      position: absolute;
      top: 0;
      right: 20px;
      font-size: 14px;
      font-family: serif;
      color: var(--accent);
      opacity: 0.15;
      writing-mode: vertical-rl;
      animation: mathRain 12s linear infinite;
      z-index: -1;
    }
    @keyframes mathRain {
      from { transform: translateY(-100%); opacity: 0; }
      10% { opacity: 0.2; }
      90% { opacity: 0.2; }
      to { transform: translateY(500%); opacity: 0; }
    }
  `,

  geometryPulse: `
    .container {
      background: color-mix(in oklab, var(--card), var(--bg) 5%);
      position: relative;
      isolation: isolate;
    }
    .container::before {
      content: "";
      position: absolute;
      top: 50%;
      left: 50%;
      width: 20px;
      height: 20px;
      background: var(--primary);
      transform: translate(-50%, -50%);
      border-radius: 2px;
      opacity: 0.1;
      box-shadow: 0 0 0 0 var(--primary), 0 0 0 40px transparent, 0 0 0 80px transparent, 0 0 0 120px transparent;
      animation: geoPulse 6s linear infinite;
      z-index: -1;
    }
    @keyframes geoPulse {
      0% { box-shadow: 0 0 0 0 color-mix(in oklab, var(--primary), transparent 20%), 0 0 0 0px transparent, 0 0 0 0px transparent, 0 0 0 0px transparent; transform: translate(-50%, -50%) rotate(0deg); }
      100% { box-shadow: 0 0 0 150px transparent, 0 0 0 150px transparent, 0 0 0 150px transparent, 0 0 0 0px color-mix(in oklab, var(--accent), transparent 100%); transform: translate(-50%, -50%) rotate(360deg); }
    }
  `,

  hexagonalField: `
    .container {
      background: color-mix(in oklab, var(--card), var(--bg) 5%);
      position: relative;
      isolation: isolate;
    }
    .container::before {
      content: "";
      position: absolute;
      inset: 0;
      z-index: -1;
      opacity: 0.08;
      background-image: 
        radial-gradient(circle at center, var(--primary) 20%, transparent 20%),
        radial-gradient(circle at center, var(--accent) 20%, transparent 20%);
      background-size: 60px 104px;
      background-position: 0 0, 30px 52px;
      animation: hexMove 20s linear infinite;
    }
    @keyframes hexMove {
      from { background-position: 0 0, 30px 52px; }
      to { background-position: 60px 104px, 90px 156px; }
    }
  `,

  rotatingPentagons: `
    .container {
      background: color-mix(in oklab, var(--card), var(--bg) 5%);
      position: relative;
      isolation: isolate;
    }
    .container::before {
      content: "";
      position: absolute;
      width: 40px;
      height: 40px;
      top: 10%;
      left: 10%;
      background: var(--primary);
      clip-path: polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%);
      opacity: 0.1;
      animation: pentagonMove 25s ease-in-out infinite alternate;
      z-index: -1;
    }
    .container::after {
      content: "";
      position: absolute;
      width: 60px;
      height: 60px;
      bottom: 15%;
      right: 15%;
      background: var(--accent);
      clip-path: polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%);
      opacity: 0.1;
      animation: pentagonMove 30s ease-in-out infinite alternate-reverse;
      z-index: -1;
    }
    @keyframes pentagonMove {
      0% { transform: translate(0, 0) rotate(0deg) scale(1); }
      100% { transform: translate(100px, 50px) rotate(360deg) scale(1.5); }
    }
  `
};

/**
 * Vrne naključen CSS string za animacijo ozadja.
 */
export function getContainerBgAnimation() {
  const keys = Object.keys(CONTAINER_ANIMATIONS);
  
  // Poskusimo dobiti animacijo, ki ni ista kot zadnja (shranjeno v session ali static)
  // Za enostavnost bomo uporabili window objekt za hrambo zadnjega ključa
  const lastKey = window._lastContainerBgKey;
  let randomKey = keys[Math.floor(Math.random() * keys.length)];
  
  // Če imamo več kot eno animacijo, poskusimo izbrati drugo
  if (keys.length > 1 && randomKey === lastKey) {
    randomKey = keys.filter(k => k !== lastKey)[Math.floor(Math.random() * (keys.length - 1))];
  }
  
  window._lastContainerBgKey = randomKey;
  return CONTAINER_ANIMATIONS[randomKey];
}
// Pokliče se v MathGame.render() ob vsaki novi iniciaciji igre.
