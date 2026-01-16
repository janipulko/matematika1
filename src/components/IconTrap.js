import {TRAPS} from '../utils/traps.js';

class IconTrap extends HTMLElement {
  static get observedAttributes() {
    return ['size', 'type'];
  }

  constructor() {
    super();
    this._root = this.attachShadow({mode: 'open'});
    this._size = 24;
    this._type = 'tnt';
    this._state = 'idle'; // 'idle' ali 'triggered'
  }

  connectedCallback() {
    if (this.hasAttribute('size')) {
      this._size = parseInt(this.getAttribute('size'), 10) || 24;
    }
    if (this.hasAttribute('type')) {
      let t = this.getAttribute('type');
      if (t === 'random') {
        const keys = Object.keys(TRAPS);
        this._type = keys[Math.floor(Math.random() * keys.length)];
      } else if (TRAPS[t]) {
        this._type = t;
      }
    }
    this._render();
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (oldVal === newVal || this._state === 'triggered') return;
    if (name === 'size') {
      this._size = parseInt(newVal, 10) || 24;
    }
    if (name === 'type') {
      if (newVal === 'random') {
         const keys = Object.keys(TRAPS);
         this._type = keys[Math.floor(Math.random() * keys.length)];
      } else if (TRAPS[newVal]) {
        this._type = newVal;
      }
    }
    this._render();
  }

  trigger() {
    if (this._state === 'triggered') return;
    this._state = 'triggered';
    this._render();
    
    // Obvestimo okolico, ko se animacija konča
    const svg = this._root.querySelector('svg');
    const onEnd = () => {
      this.dispatchEvent(new CustomEvent('trapend', {bubbles: true, composed: true}));
      this.remove();
    };
    
    // Ker imamo animacijo na <g>, poslušamo animationend
    const animatedG = this._root.querySelector('g');
    if (animatedG) {
      animatedG.addEventListener('animationend', onEnd, {once: true});
      // Varnostni timeout
      setTimeout(onEnd, 1000);
    } else {
      onEnd();
    }
  }

  _render() {
    const trapData = TRAPS[this._type] || TRAPS.tnt;
    const content = this._state === 'idle' ? trapData.trap : trapData.trigger;
    
    this._root.innerHTML = `
      <style>
        :host {
          display: inline-block;
          width: ${this._size}px;
          height: ${this._size}px;
          line-height: 0;
          pointer-events: none;
        }
        svg {
          width: 100%;
          height: 100%;
          display: block;
          overflow: visible;
        }
        @keyframes trapExplode {
          0% { transform: scale(0.5); opacity: 1; }
          50% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1.5); opacity: 0; }
        }
      </style>
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        ${content}
      </svg>
    `;
  }
}

customElements.define('icon-trap', IconTrap);
