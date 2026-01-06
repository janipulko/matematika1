
class ControlsBar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._soundOn = true;
    this._activeIndex = 0;
    this._showActive = true;
    this._handleKeyDown = this._handleKeyDown.bind(this);
  }

  connectedCallback() {
    this.render();
    window.addEventListener('keydown', this._handleKeyDown);
  }

  disconnectedCallback() {
    window.removeEventListener('keydown', this._handleKeyDown);
  }

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
      buttons[this._activeIndex].click();
    }
  }

  _updateActiveVisual() {
    const buttons = this.shadowRoot.querySelectorAll('.btn');
    buttons.forEach((btn, index) => {
      btn.classList.toggle('active-kbd', this._showActive && index === this._activeIndex);
    });
  }

  setShowActive(val) {
    this._showActive = val;
    this._updateActiveVisual();
  }

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
      
      b.addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('add', { bubbles: true, composed: true, detail: { value: n } }));
      });
      container.appendChild(b);
    });

    // Dodaj "=" gumb
    this.equalBtn = document.createElement('button');
    this.equalBtn.className = 'btn equal';
    this.equalBtn.textContent = '=';
    this.equalBtn.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('confirm', { bubbles: true, composed: true }));
    });
    container.appendChild(this.equalBtn);
    
    this._updateActiveVisual();
  }

  flashEquals() {
    if (!this.equalBtn) return;
    this.equalBtn.classList.remove('flash');
    void this.equalBtn.offsetWidth;
    this.equalBtn.classList.add('flash');
  }

  flashAny() {
    const container = this.shadowRoot.querySelector('.controls');
    if (!container) return;
    container.classList.remove('flash');
    void container.offsetWidth;
    container.classList.add('flash');
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }
        .controls {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: clamp(6px, 1.5vh, 12px);
          margin-top: clamp(8px, 2vh, 20px);
          padding-bottom: clamp(4px, 1vh, 12px);
          width: 100%;
        }
        .btn {
          appearance: none;
          border: none;
          outline: none;
          flex: 1;
          min-width: 40px;
          max-width: clamp(60px, 15vh, 120px);
          aspect-ratio: 1 / 1;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: var(--primary);
          color: #08323c;
          font-weight: 900;
          font-size: clamp(18px, 4vh, 36px);
          letter-spacing: .2px;
          cursor: pointer;
          box-shadow: 0 6px 16px rgba(38,198,218,0.3);
          transition: transform .1s cubic-bezier(0.175, 0.885, 0.32, 1.275), filter .12s ease, background .2s ease, box-shadow .2s ease;
          user-select: none;
        }
        .btn:hover { 
          filter: brightness(1.05);
          transform: scale(1.05);
          box-shadow: 0 8px 20px rgba(38,198,218,0.4);
        }
        .btn:active { 
          transform: scale(0.95);
          box-shadow: 0 2px 8px rgba(38,198,218,0.3);
        }

        .btn.neg {
          background: var(--neg-bg, #FFCDD2);
          color: var(--neg-ink, #7a1c1c);
          box-shadow: 0 6px 16px rgba(239,83,80,0.25);
        }
        .btn.neg:hover { box-shadow: 0 8px 20px rgba(239,83,80,0.35); }
        
        .btn.pos {
          background: var(--pos-bg, #C8E6C9);
          color: var(--pos-ink, #194d23);
          box-shadow: 0 6px 16px rgba(102,187,106,0.25);
        }
        .btn.pos:hover { box-shadow: 0 8px 20px rgba(102,187,106,0.35); }

        .btn.mul {
          background: var(--mul-bg, #E1F5FE);
          color: var(--mul-ink, #01579B);
          box-shadow: 0 6px 16px rgba(3,169,244,0.25);
        }
        .btn.mul:hover { box-shadow: 0 8px 20px rgba(3,169,244,0.35); }

        .btn.div {
          background: var(--div-bg, #FFF3E0);
          color: var(--div-ink, #E65100);
          box-shadow: 0 6px 16px rgba(255,152,0,0.25);
        }
        .btn.div:hover { box-shadow: 0 8px 20px rgba(255,152,0,0.35); }

        .btn.equal {
          background: var(--accent);
          color: #5a4605;
          box-shadow: 0 6px 16px rgba(255,213,79,0.3);
          font-size: clamp(28px, 6vw, 48px);
        }
        .btn.equal:hover { box-shadow: 0 8px 20px rgba(255,213,79,0.4); }
        .btn.active-kbd {
          outline: 4px solid #FF5252;
          outline-offset: 4px;
          box-shadow: 0 0 20px rgba(255, 82, 82, 0.7);
          transform: scale(1.1);
          z-index: 5;
        }
        .flash {
          animation: flash 320ms ease;
        }
        @keyframes flash {
          0% { box-shadow: 0 0 0 0 rgba(239,83,80,0.3); }
          50% { box-shadow: 0 0 0 8px rgba(239,83,80,0); }
          100% { box-shadow: 0 0 0 0 rgba(239,83,80,0); }
        }
      </style>
      <div class="controls"></div>
    `;
  }
}

customElements.define('controls-bar', ControlsBar);
export default ControlsBar;
