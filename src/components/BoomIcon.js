class BoomIcon extends HTMLElement {
  // ---- ZAPEČENE PRIVZETE VREDNOSTI (spreminjaš tu) ----
  static START_COLOR = '#ff8a00';   // gradient začetek
  static END_COLOR = '#ff0033';   // gradient konec
  static STROKE_COLOR = 'currentColor';
  static STROKE_WIDTH = 1;

  // Animacijski privzemi
  static EASE = 'cubic-bezier(.2,.9,.2,1.1)';
  static DURATION = '800ms';
  static ITERATIONS = '1';
  static PLAY_STATE = 'running';
  static SCALE_FROM = '.7';
  static SCALE_TO = '1';

  // Stretch privzemi
  static STRETCH_DURATION = '900ms';
  static STRETCH_AMP = '1.12';

  // Osnovni scale (naravno širša oblika)
  static BASE_SX = '1.35';
  static BASE_SY = '0.85';

  // Dimenzije
  static DEFAULT_SIZE = '24px';

  // Unikaten ID za gradiente
  static _idCounter = 0;

  static get observedAttributes() {
    return [
      'size', 'width', 'height',
      'variant', 'duration', 'repeat', 'autoplay',
      'stretch', 'stretch-duration', 'stretch-amp',
      'base-sx', 'base-sy',
      'label', 'stroke-width',
      'start', 'end', 'stroke',
      'scale-from', 'scale-to',
      'trigger' // click | hover | none
    ];
  }

  constructor() {
    super();
    // Unikaten ID za gradient
    this._gradId = `boomGrad-${++BoomIcon._idCounter}`;
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(this.#tpl().content.cloneNode(true));
    this._scaleEl = this.shadowRoot.querySelector('.g-scale');
    this._stretchEl = this.shadowRoot.querySelector('.g-stretch');
    this._svg = this.shadowRoot.querySelector('svg');
    this._gradStops = {
      start: this.shadowRoot.querySelector(`#${this._gradId} .stop-start`),
      end: this.shadowRoot.querySelector(`#${this._gradId} .stop-end`)
    };
    this._mainPath = this.shadowRoot.querySelector('.boom-main');
  }

  connectedCallback() {
    this.#applyAll();
    this.#setupTriggers();
  }

  attributeChangedCallback() {
    if (!this.shadowRoot) {
      return;
    }
    this.#applyAll();
    this.#setupTriggers();
  }

  // --- Public API ---
  play() {
    this.style.setProperty('--boom-play', 'running');
  }

  pause() {
    this.style.setProperty('--boom-play', 'paused');
  }

  trigger() {
    const el = this._scaleEl;
    const prev = el.style.animation;
    el.style.animation = 'none';
    void el.offsetWidth; // reflow
    el.style.animation = prev || '';
  }

  // --- Private helpers ---
  #applyAll() {
    // Dimenzije
    const size = this.getAttribute('size');
    const width = this.getAttribute('width');
    const height = this.getAttribute('height');

    const w = width ? (isNaN(width) ? width : `${width}px`) : (size ? (isNaN(
        size) ? size : `${size}px`) : BoomIcon.DEFAULT_SIZE);
    const h = height ? (isNaN(height) ? height : `${height}px`) : (size
        ? (isNaN(size) ? size : `${size}px`) : BoomIcon.DEFAULT_SIZE);

    this.style.setProperty('--boom-w', w);
    this.style.setProperty('--boom-h', h);

    // Barve (atributi so opcijski; če niso podani, ostanejo zapečene vrednosti)
    const start = this.getAttribute('start') || BoomIcon.START_COLOR;
    const end = this.getAttribute('end') || BoomIcon.END_COLOR;
    const stroke = this.getAttribute('stroke') || BoomIcon.STROKE_COLOR;
    const sw = this.getAttribute('stroke-width') || String(
        BoomIcon.STROKE_WIDTH);

    // Nastavimo direktno v SVG/gradient — brez CSS var(), da zunanjost ne more preglasiti
    this._gradStops.start.setAttribute('stop-color', start);
    this._gradStops.end.setAttribute('stop-color', end);
    this._mainPath.setAttribute('stroke', stroke);
    this._mainPath.setAttribute('stroke-width', sw);

    // Baza širine/višine (naravno širša eksplozija)
    const baseSx = this.getAttribute('base-sx') || BoomIcon.BASE_SX;
    const baseSy = this.getAttribute('base-sy') || BoomIcon.BASE_SY;
    this.style.setProperty('--boom-base-sx', baseSx);
    this.style.setProperty('--boom-base-sy', baseSy);

    // Animacija (scale)
    const variant = (this.getAttribute('variant') || 'burst').toLowerCase();
    const duration = this.getAttribute('duration') || BoomIcon.DURATION;
    const repeat = this.getAttribute('repeat') || (variant === 'pulse'
        ? 'infinite' : BoomIcon.ITERATIONS);
    const autoplay = this.hasAttribute('autoplay') || variant === 'pulse'
        || this.getAttribute('trigger') === 'none';
    const from = this.getAttribute('scale-from') || BoomIcon.SCALE_FROM;
    const to = this.getAttribute('scale-to') || BoomIcon.SCALE_TO;

    this.style.setProperty('--boom-duration', duration);
    this.style.setProperty('--boom-iter', repeat);
    this.style.setProperty('--boom-play', autoplay ? 'running' : 'paused');
    this.style.setProperty('--boom-scale-from', from);
    this.style.setProperty('--boom-scale-to', to);

    // Smisel animacije za variant
    this.toggleAttribute('data-pulse', variant === 'pulse');

    // Stretch (vodoravni val)
    const hasStretch = this.hasAttribute('stretch');
    const stretchDur = this.getAttribute('stretch-duration')
        || BoomIcon.STRETCH_DURATION;
    const stretchAmp = this.getAttribute('stretch-amp') || BoomIcon.STRETCH_AMP;
    this.style.setProperty('--boom-stretch-duration', stretchDur);
    this.style.setProperty('--boom-stretch-amp', stretchAmp);
    this.toggleAttribute('data-stretch', hasStretch);

    // Dostopnost
    const label = this.getAttribute('label');
    if (label) {
      this.removeAttribute('aria-hidden');
      this._svg.setAttribute('role', 'img');
      this._svg.setAttribute('aria-label', label);
    } else {
      this.setAttribute('aria-hidden', 'true');
      this._svg.removeAttribute('role');
      this._svg.removeAttribute('aria-label');
    }

    // Dogodek ob koncu "burst"
    if (variant === 'burst' && repeat !== 'infinite') {
      const onEnd = (e) => {
        if (e.animationName === 'boomExpand') {
          this.dispatchEvent(new CustomEvent('boomend', {bubbles: true}));
          this._scaleEl.removeEventListener('animationend', onEnd);
        }
      };
      // Prepreči dupliciranje listenerjev
      this._scaleEl.removeEventListener('animationend', onEnd);
      this._scaleEl.addEventListener('animationend', onEnd);
    }
  }

  #setupTriggers() {
    // počisti
    this.onmouseenter = this.onmouseleave = this.onclick = null;

    const trig = (this.getAttribute('trigger') || 'none').toLowerCase();
    const autoplay = this.style.getPropertyValue('--boom-play')?.trim()
        === 'running';
    if (autoplay) {
      return;
    }

    if (trig === 'hover') {
      this.onmouseenter = () => this.play();
      this.onmouseleave = () => this.pause();
    } else if (trig === 'click') {
      this.onclick = () => {
        this.play();
        this.trigger();
      };
    }
  }

  #tpl() {
    const tpl = document.createElement('template');
    // Uporabimo this._gradId in vstavimo class selektorje, da kasneje nastavimo vrednosti programatično
    tpl.innerHTML = `
<style>
  :host {
    display: inline-block;
    width: var(--boom-w, ${BoomIcon.DEFAULT_SIZE});
    height: var(--boom-h, ${BoomIcon.DEFAULT_SIZE});
    line-height: 0;
  }

  svg { width: 100%; height: 100%; overflow: visible; }

  /* Animacijske skupine - vsaka ima svoj transform */
  .g-scale {
    transform-origin: center bottom;
    animation: boomExpand var(--boom-duration, ${BoomIcon.DURATION}) ${BoomIcon.EASE} var(--boom-iter, ${BoomIcon.ITERATIONS}) both;
    animation-play-state: var(--boom-play, ${BoomIcon.PLAY_STATE});
  }
  :host([data-pulse]) .g-scale {
    animation-direction: alternate;
    animation-iteration-count: infinite; /* pulse ignorira --boom-iter */
  }

  .g-stretch {
    transform-origin: center bottom;
    animation: boomStretch var(--boom-stretch-duration, ${BoomIcon.STRETCH_DURATION}) ease-in-out infinite;
    animation-play-state: var(--boom-play, ${BoomIcon.PLAY_STATE});
  }
  :host(:not([data-stretch])) .g-stretch { animation: none; }

  .g-base {
    /* statični razteg za širšo obliko */
    transform: scale(var(--boom-base-sx, ${BoomIcon.BASE_SX}), var(--boom-base-sy, ${BoomIcon.BASE_SY}));
    transform-origin: center bottom;
    transform-box: fill-box;
  }

  /* Ključni kadri */
  @keyframes boomExpand {
    0%   { transform: scale(var(--boom-scale-from, ${BoomIcon.SCALE_FROM})) rotate(-2deg); }
    40%  { transform: scale(var(--boom-scale-to, ${BoomIcon.SCALE_TO})) rotate(2deg); }
    70%  { transform: scale(calc(var(--boom-scale-to, ${BoomIcon.SCALE_TO}) * 1.1), calc(var(--boom-scale-to, ${BoomIcon.SCALE_TO}) * 0.85)) rotate(-1deg); }
    100% { transform: scale(var(--boom-scale-to, ${BoomIcon.SCALE_TO})) rotate(0deg); }
  }
  @keyframes boomStretch {
    0%, 100% { transform: scaleX(1); }
    40%      { transform: scaleX(var(--boom-stretch-amp, ${BoomIcon.STRETCH_AMP})); }
    70%      { transform: scaleX(0.96); }
  }

  /* Zmanjšano gibanje */
  @media (prefers-reduced-motion: reduce) {
    .g-scale, .g-stretch { animation: none !important; }
  }
</style>

<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="${this._gradId}" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop class="stop-start" offset="0%"  />
      <stop class="stop-end"   offset="100%"/>
    </linearGradient>
  </defs>

  <!-- Hierarhija transformacij: g-scale -> g-stretch -> g-base -->
  <g class="g-scale">
    <g class="g-stretch">
      <g class="g-base">
        <!-- Glavna zvezdasta “boom” oblika -->
        <path
          class="boom-main"
          d="M12 2.2
             l1.6 3.5 3.9-0.6 -2.5 3.0 2.8 2.3 -3.9 0.7 1.4 3.6 -3.3-2.0 -3.3 2.0 1.4-3.6 -3.9-0.7 2.8-2.3 -2.5-3.0 3.9 0.6z"
          fill="url(#${this._gradId})"
          stroke="${BoomIcon.STROKE_COLOR}"
          stroke-width="${BoomIcon.STROKE_WIDTH}"
          stroke-linejoin="round"
          vector-effect="non-scaling-stroke"
          shape-rendering="geometricPrecision"
        />
        <!-- Notranji poudarek -->
        <path
          d="M12 6.2
             l0.9 2.0 2.2-0.3 -1.4 1.7 1.6 1.3 -2.3 0.4 0.8 2.1 -1.9-1.2 -1.9 1.2 0.8-2.1 -2.3-0.4 1.6-1.3 -1.4-1.7 2.2 0.3z"
          fill="rgba(255,255,255,0.25)"
          stroke="transparent"
        />
      </g>
    </g>
  </g>
</svg>
`;
    return tpl;
  }
}

customElements.define('boom-icon', BoomIcon);

