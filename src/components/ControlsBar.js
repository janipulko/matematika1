
class ControlsBar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._soundOn = true;
    this._activeIndex = 0;
    this._showActive = true;
    this._handleKeyDown = this._handleKeyDown.bind(this);

    /** @type {HTMLButtonElement|null} */
    this.equalBtn = null;
  }

  connectedCallback() {
    this.render();
    window.addEventListener('keydown', this._handleKeyDown);
  }

  disconnectedCallback() {
    window.removeEventListener('keydown', this._handleKeyDown);
  }

  /** Keyboard: Left/Right za premikanje, Enter za klik aktivnega gumba */
  _handleKeyDown(e) {
    const buttons = this.shadowRoot.querySelectorAll('.btn');
    if (buttons.length === 0) return;

    if (e.key === 'ArrowLeft') {
      this._activeIndex = Math.max(0, this._activeIndex - 1);
      this._updateActiveVisual();
    } else if (e.key === 'ArrowRight') {
      this._activeIndex = Math.min(buttons.length - 1, this._activeIndex + 1);
      this._updateActiveVisual();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      buttons[this._activeIndex]?.click();
    }
  }

  /** Vizualni označevalec aktivnega gumba (za tipkovnico) */
  _updateActiveVisual() {
    const buttons = this.shadowRoot.querySelectorAll('.btn');
    buttons.forEach((btn, index) => {
      btn.classList.toggle('active-kbd', this._showActive && index === this._activeIndex);
    });
  }

  /** API: skrij/kaži aktivni označevalec */
  setShowActive(val) {
    this._showActive = Boolean(val);
    this._updateActiveVisual();
  }

  /**
   * Ustvari gumbe glede na podane operacije.
   * @param {Array<{op:'p'|'m'|'t'|'s', val:number}>} nums
   */
  setNums(nums) {
    const container = this.shadowRoot.querySelector('.controls');
    if (!container) return;

    // Počisti obstoječe gumbe
    container.innerHTML = '';

    nums.forEach(n => {
      const b = document.createElement('button');

      let label = '';
      let cls = 'btn ';

      if (n.op === 'p') { label = '+' + n.val; cls += 'pos'; }
      else if (n.op === 'm') { label = '-' + n.val; cls += 'neg'; }
      else if (n.op === 't') { label = '×' + n.val; cls += 'mul'; }
      else if (n.op === 's') { label = '÷' + n.val; cls += 'div'; }

      b.className = cls;
      b.textContent = label;
      b.setAttribute('type', 'button');
      b.setAttribute('aria-label', `Operacija ${label}`);

      b.addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('add', {
          bubbles: true,
          composed: true,
          detail: { value: n }
        }));
      });

      container.appendChild(b);
    });

    // Dodaj "=" gumb
    this.equalBtn = document.createElement('button');
    this.equalBtn.className = 'btn equal';
    this.equalBtn.textContent = '=';
    this.equalBtn.setAttribute('type', 'button');
    this.equalBtn.setAttribute('aria-label', 'Potrdi operacije');

    this.equalBtn.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('confirm', { bubbles: true, composed: true }));
    });

    container.appendChild(this.equalBtn);

    // Osveži aktivni indikator
    this._activeIndex = 0;
    this._updateActiveVisual();
  }

  /** Flash animacija posebej za "=" gumb */
  flashEquals() {
    if (!this.equalBtn) return;
    this.equalBtn.classList.remove('flash');
    // Reflow za restart animacije
    void this.equalBtn.offsetWidth;
    this.equalBtn.classList.add('flash');
  }

  /** Flash animacija za celoten container */
  flashAny() {
    const container = this.shadowRoot.querySelector('.controls');
    if (!container) return;
    container.classList.remove('flash-container');
    void container.offsetWidth;
    container.classList.add('flash-container');
  }

  /** Render z refaktoriranim CSS */
  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          margin-top: clamp(8px, 2vh, 20px);
          width: 100%;
        }

        /* 1) Container omogoči cq-enote za širino in višino */
        .controls {
          container-type: size;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: var(--gap, 0.75rem);
          padding: 0.5rem;
          box-sizing: border-box;
          
          /* Omejena višina vrstice z gumbi */
          height: clamp(64px, 15vh, 120px);
          width: 100%;

          /* 2) Izračun premera:
             - po višini: 100cqb (minus padding)
             - po širini: (100cqi - 4*gap)/5
          */
          --gap: 0.75rem;
          --raw-d: min(calc(100cqb - 1rem), calc((100cqi - 4 * var(--gap)) / 5));
          --btn-size: clamp(42px, var(--raw-d), 90px);
          --btn-font: calc(var(--btn-size) * 0.35);
        }

        /* ========= Button Base ========= */
        .btn {
          appearance: none;
          border: none;
          outline: none;

          /* Gumbi so popolni krogi s premerom --btn-size */
          width: var(--btn-size);
          height: var(--btn-size);
          border-radius: 50%;

          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--card);
          color: var(--ink);
          font-weight: 900;
          font-size: var(--btn-font);
          cursor: pointer;

          box-shadow: 0 4px 6px rgba(0,0,0,0.15), inset 0 0 0 1px rgba(255,255,255,0.1);
          transition: transform .1s cubic-bezier(0.175, 0.885, 0.32, 1.275),
                      filter .12s ease,
                      box-shadow .2s ease;

          user-select: none;
          white-space: nowrap;
          line-height: 1;
        }

        .btn:hover {
          filter: brightness(1.1);
          transform: scale(1.08);
          box-shadow: 0 8px 12px rgba(0,0,0,0.25);
        }
        .btn:active {
          transform: scale(0.92);
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }

        /* ========= Semantic Variants (polne barve za boljšo opaznost) ========= */
        .btn.neg {
          background: var(--neg-bg, #FFCDD2);
          color: var(--neg-ink, #7a1c1c);
          box-shadow: 0 4px 6px rgba(0,0,0,0.15);
        }
        .btn.neg:hover { box-shadow: 0 8px 12px rgba(0,0,0,0.25); }

        .btn.pos {
          background: var(--pos-bg, #C8E6C9);
          color: var(--pos-ink, #194d23);
          box-shadow: 0 4px 6px rgba(0,0,0,0.15);
        }
        .btn.pos:hover { box-shadow: 0 8px 12px rgba(0,0,0,0.25); }

        .btn.mul {
          background: var(--mul-bg, #E1F5FE);
          color: var(--mul-ink, #01579B);
          box-shadow: 0 4px 6px rgba(0,0,0,0.15);
        }
        .btn.mul:hover { box-shadow: 0 8px 12px rgba(0,0,0,0.25); }

        .btn.div {
          background: var(--div-bg, #FFF3E0);
          color: var(--div-ink, #E65100);
          box-shadow: 0 4px 6px rgba(0,0,0,0.15);
        }
        .btn.div:hover { box-shadow: 0 8px 12px rgba(0,0,0,0.25); }

        .btn.equal {
          background: var(--accent, #FFD54F);
          color: var(--on-accent, var(--ink));
          box-shadow: 0 4px 6px rgba(0,0,0,0.15);
        }
        .btn.equal:hover { box-shadow: 0 8px 12px rgba(0,0,0,0.25); }

        /* ========= Keyboard Active Highlight ========= */
        .btn.active-kbd {
          outline: 3px solid var(--danger);
          outline-offset: 3px;
          box-shadow: 0 0 15px rgba(255, 82, 82, 0.4);
          transform: scale(1.1);
          z-index: 5;
        }

        /* ========= Flash Animations ========= */
        .flash {
          animation: flash 320ms ease;
        }
        @keyframes flash {
          0%   { box-shadow: 0 0 0 0 rgba(239,83,80,0.3); }
          50%  { box-shadow: 0 0 0 8px rgba(239,83,80,0); }
          100% { box-shadow: 0 0 0 0 rgba(239,83,80,0); }
        }

        .flash-container {
          animation: flash-container 320ms ease;
        }
        @keyframes flash-container {
          0%   { background-color: transparent; }
          50%  { background-color: rgba(239,83,80,0.1); }
          100% { background-color: transparent; }
        }
      </style>
      <div class="controls" role="group" aria-label="Kontrole operacij">
      <div>test 123</div>
      
</div>
    `;
  }
}

customElements.define('controls-bar', ControlsBar);
export default ControlsBar;
