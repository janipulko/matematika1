/**
 * Animacije za ozadje glavnega vsebnika (container) v MathGame.js.
 * Vsaka animacija vrne CSS string, ki vključuje definicijo .container ozadja in pripadajoče @keyframes.
 */

export const CONTAINER_ANIMATIONS = {
  // 1. TRIKOTNA MREŽA (Izboljšana s prepletanjem barv)
  triangularMesh: `
    .container {
      background: var(--card);
      position: relative;
      isolation: isolate;
      overflow: hidden;
    }
    .container::before {
      content: "";
      position: absolute;
      inset: -100%;
      z-index: -1;
      opacity: 0.15;
      background-image: 
        linear-gradient(30deg, var(--primary) 12%, transparent 12.5%, transparent 87%, var(--primary) 87.5%, var(--primary)),
        linear-gradient(150deg, var(--primary) 12%, transparent 12.5%, transparent 87%, var(--primary) 87.5%, var(--primary)),
        linear-gradient(60deg, var(--accent) 25%, transparent 25.5%, transparent 75%, var(--accent) 75%, var(--accent));
      background-size: 80px 140px;
      animation: triangularMove 40s linear infinite;
    }
    @keyframes triangularMove {
      from { transform: rotate(0deg) translate(0, 0); }
      to { transform: rotate(5deg) translate(80px, 140px); }
    }
  `,

  // 2. INTERFERENČNO VALOVANJE (Dva radialna sistema, ki ustvarjata moiré vzorec)
  interferenceWaves: `
    .container {
      background: var(--card);
      position: relative;
      isolation: isolate;
    }
    .container::before, .container::after {
      content: "";
      position: absolute;
      inset: -50%;
      z-index: -1;
      opacity: 0.2;
      background: repeating-radial-gradient(
        circle at 50% 50%,
        var(--primary) 0,
        var(--primary) 1px,
        transparent 2px,
        transparent 30px
      );
      animation: wavePulse 15s ease-in-out infinite alternate;
    }
    .container::after {
      background: repeating-radial-gradient(
        circle at 50% 50%,
        var(--accent) 0,
        var(--accent) 1px,
        transparent 2px,
        transparent 30px
      );
      animation-delay: -7.5s;
      animation-duration: 20s;
    }
    @keyframes wavePulse {
      0% { transform: scale(1) translate(-5%, -5%); }
      100% { transform: scale(1.2) translate(5%, 5%); }
    }
  `,

  // 3. FRAKTALNA REKURZIVA (Gnezdene mreže, ki se premikajo z različnimi hitrostmi)
  fractalGrid: `
    .container {
      background: var(--card);
      position: relative;
      isolation: isolate;
    }
    .container::before {
      content: "";
      position: absolute;
      inset: 0;
      z-index: -1;
      background: 
        repeating-linear-gradient(0deg, var(--primary) 0 1px, transparent 1px 40px),
        repeating-linear-gradient(90deg, var(--primary) 0 1px, transparent 1px 40px);
      opacity: 0.1;
      animation: gridZoom 20s linear infinite;
    }
    .container::after {
      content: "";
      position: absolute;
      inset: 0;
      z-index: -1;
      background: 
        repeating-linear-gradient(45deg, var(--accent) 0 1px, transparent 1px 80px),
        repeating-linear-gradient(-45deg, var(--accent) 0 1px, transparent 1px 80px);
      opacity: 0.05;
      animation: gridZoom 15s linear infinite reverse;
    }
    @keyframes gridZoom {
      from { transform: scale(1); }
      to { transform: scale(2); }
    }
  `,

  // 4. LISSAJOUS KRIVULJE (Gibanje točk po kompleksni poti)
  lissajousOrbit: `
    .container {
      background: var(--card);
      position: relative;
      isolation: isolate;
    }
    .container::before {
      content: "";
      position: absolute;
      width: 200%;
      height: 200%;
      top: -50%;
      left: -50%;
      z-index: -1;
      background: 
        radial-gradient(circle at center, var(--primary) 0.5%, transparent 2%),
        radial-gradient(circle at 30% 30%, var(--accent) 0.5%, transparent 2%);
      background-size: 150px 150px;
      opacity: 0.2;
      animation: lissajousMove 25s linear infinite;
    }
    @keyframes lissajousMove {
      0% { transform: rotate(0deg) translate(0, 0); }
      50% { transform: rotate(180deg) translate(50px, 100px); }
      100% { transform: rotate(360deg) translate(0, 0); }
    }
  `,

  // 5. GEOMETRIJSKI PRESEKI (Krogi in kvadratne mreže)
  geometricIntersections: `
    .container {
      background: var(--card);
      position: relative;
      isolation: isolate;
    }
    .container::before {
      content: "";
      position: absolute;
      inset: 0;
      z-index: -1;
      background: 
        repeating-radial-gradient(circle at 0% 0%, transparent 0 50px, color-mix(in oklab, var(--primary), transparent 90%) 51px),
        repeating-radial-gradient(circle at 100% 100%, transparent 0 50px, color-mix(in oklab, var(--accent), transparent 90%) 51px);
      animation: intersectionShift 10s ease-in-out infinite alternate;
    }
    @keyframes intersectionShift {
      from { background-position: 0 0; }
      to { background-position: 100px 100px; }
    }
  `,

  // 6. SINUSOIDNA POLJA (Simulacija Fourierove analize s črtami)
  fourierWaves: `
    .container {
      background: var(--card);
      position: relative;
      isolation: isolate;
    }
    .container::before {
      content: "";
      position: absolute;
      inset: 0;
      z-index: -1;
      background: repeating-linear-gradient(
        90deg,
        transparent 0,
        transparent 20px,
        var(--primary) 21px,
        var(--primary) 22px
      );
      opacity: 0.1;
      mask-image: radial-gradient(ellipse at center, black, transparent 70%);
      animation: waveFloat 8s ease-in-out infinite alternate;
    }
    @keyframes waveFloat {
      from { transform: skewX(-10deg) translateX(-20px); }
      to { transform: skewX(10deg) translateX(20px); }
    }
  `,

  // 7. MOIRÉ PIKE (Dve plasti pik, ki rotirata in ustvarjata optično iluzijo)
  moireDots: `
    .container {
      background: var(--card);
      position: relative;
      isolation: isolate;
      overflow: hidden;
    }
    .container::before, .container::after {
      content: "";
      position: absolute;
      inset: -100%;
      z-index: -1;
      background-image: radial-gradient(var(--primary) 1px, transparent 1px);
      background-size: 20px 20px;
      opacity: 0.2;
    }
    .container::before { animation: rotateMoire 30s linear infinite; }
    .container::after { 
      background-image: radial-gradient(var(--accent) 1px, transparent 1px);
      background-size: 21px 21px; 
      animation: rotateMoire 40s linear infinite reverse; 
    }
    @keyframes rotateMoire {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `,

  // 8. TEHNIČNA LOGIČNA PLOŠČA (Geometrija, ki se sestavlja)
  logicalSpine: `
    .container {
      background: var(--card);
      position: relative;
      isolation: isolate;
    }
    .container::before {
      content: "";
      position: absolute;
      inset: 0;
      z-index: -1;
      background: 
        linear-gradient(90deg, var(--primary) 1px, transparent 1px) 0 0 / 50px 50px,
        linear-gradient(0deg, var(--primary) 1px, transparent 1px) 0 0 / 50px 50px;
      opacity: 0.05;
    }
    .container::after {
      content: "";
      position: absolute;
      width: 100px;
      height: 100px;
      border: 1px solid var(--accent);
      top: 50%;
      left: 50%;
      z-index: -1;
      opacity: 0.2;
      animation: spinePulse 12s ease-in-out infinite;
    }
    @keyframes spinePulse {
      0% { transform: translate(-50%, -50%) rotate(0deg) scale(0.5); border-radius: 0%; }
      50% { transform: translate(-50%, -50%) rotate(180deg) scale(2); border-radius: 50%; }
      100% { transform: translate(-50%, -50%) rotate(360deg) scale(0.5); border-radius: 0%; }
    }
  `,
  // 1. LORENTZOV ATRAKTOR (Simulacija kaosa in dinamičnih sistemov)
  lorentzAttractor: `
    .container {
      background: var(--card);
      position: relative;
      isolation: isolate;
      overflow: hidden;
    }
    .container::before, .container::after {
      content: "";
      position: absolute;
      inset: -50%;
      z-index: -1;
      opacity: 0.2;
      background-image: 
        radial-gradient(ellipse at center, var(--primary) 0.5%, transparent 2%),
        radial-gradient(ellipse at 30% 70%, var(--accent) 0.5%, transparent 2%);
      background-size: 120px 120px;
      animation: lorentzFlow 20s linear infinite;
    }
    .container::after {
      animation-duration: 25s;
      animation-direction: reverse;
      opacity: 0.1;
    }
    @keyframes lorentzFlow {
      0% { transform: rotate(0deg) scale(1) skew(0deg); }
      33% { transform: rotate(120deg) scale(1.2) skew(10deg); }
      66% { transform: rotate(240deg) scale(0.8) skew(-10deg); }
      100% { transform: rotate(360deg) scale(1) skew(0deg); }
    }
  `,

  // 2. VORONOI CELICE (Dinamična delitev prostora)
  voronoiCells: `
    .container {
      background: var(--card);
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
        radial-gradient(circle at 20% 30%, var(--primary) 1px, transparent 1px),
        radial-gradient(circle at 80% 70%, var(--accent) 1px, transparent 1px),
        radial-gradient(circle at 50% 50%, var(--primary) 1px, transparent 1px);
      background-size: 100px 100px;
      filter: contrast(20) brightness(2);
      animation: voronoiMove 15s ease-in-out infinite alternate;
    }
    @keyframes voronoiMove {
      0% { background-position: 0% 0%; }
      100% { background-position: 50px 50px; }
    }
  `,

  // 3. KVANTNA INTERFERENCA (Visoka gostota valovanja)
  quantumInterference: `
    .container {
      background: var(--card);
      position: relative;
      isolation: isolate;
    }
    .container::before {
      content: "";
      position: absolute;
      inset: -100%;
      z-index: -1;
      opacity: 0.25;
      background: repeating-conic-gradient(
        from 0deg at 50% 50%,
        var(--primary) 0deg 0.1deg,
        transparent 0.2deg 2deg
      );
      animation: quantumRotate 60s linear infinite;
    }
    .container::after {
      content: "";
      position: absolute;
      inset: -100%;
      z-index: -1;
      opacity: 0.2;
      background: repeating-conic-gradient(
        from 0deg at 50% 50%,
        var(--accent) 0deg 0.1deg,
        transparent 0.2deg 2deg
      );
      animation: quantumRotate 45s linear infinite reverse;
    }
    @keyframes quantumRotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `,

  // 4. FRAKTALNI TESSERACT (Hiper-kocka v gibanju)
  hyperGrid: `
    .container {
      background: var(--card);
      position: relative;
      isolation: isolate;
    }
    .container::before {
      content: "";
      position: absolute;
      inset: 0;
      z-index: -1;
      background: 
        linear-gradient(45deg, var(--primary) 1px, transparent 1px),
        linear-gradient(-45deg, var(--accent) 1px, transparent 1px);
      background-size: 60px 60px;
      opacity: 0.1;
      animation: hyperShift 10s ease-in-out infinite alternate;
    }
    @keyframes hyperShift {
      0% { transform: perspective(500px) rotateX(0deg) rotateY(0deg); }
      100% { transform: perspective(500px) rotateX(20deg) rotateY(20deg); }
    }
  `,

  // 5. VECTOR FIELD (Vektorsko polje sil)
  vectorField: `
    .container {
      background: var(--card);
      position: relative;
      isolation: isolate;
    }
    .container::before {
      content: "";
      position: absolute;
      inset: 0;
      z-index: -1;
      background-image: 
        linear-gradient(90deg, var(--primary) 2px, transparent 2px);
      background-size: 40px 40px;
      background-repeat: repeat;
      opacity: 0.15;
      mask-image: repeating-linear-gradient(0deg, black 0 2px, transparent 2px 40px);
      animation: vectorFlow 12s linear infinite;
    }
    @keyframes vectorFlow {
      from { transform: skewY(0deg) translateX(0); }
      to { transform: skewY(10deg) translateX(40px); }
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
    randomKey = keys.filter(k => k !== lastKey)[Math.floor(
        Math.random() * (keys.length - 1))];
  }

  window._lastContainerBgKey = randomKey;
  return CONTAINER_ANIMATIONS[randomKey];
}

// Pokliče se v MathGame.render() ob vsaki novi iniciaciji igre.
