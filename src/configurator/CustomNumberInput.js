
class CustomNumberInput extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._op = 'p'; // default plus
    this._val = 0;
    this._operators = [
      { id: 'p', symbol: '+', class: 'op-p' },
      { id: 'm', symbol: '-', class: 'op-m' },
      { id: 't', symbol: '×', class: 'op-t' },
      { id: 's', symbol: '÷', class: 'op-s' }
    ];
  }

  get value() {
    return this._val === 0 ? '' : `${this._op}${this._val}`;
  }

  set value(valStr) {
    if (!valStr) {
      this._val = 0;
      this._op = 'p';
    } else {
      const match = valStr.match(/([pmts])(\d+)/);
      if (match) {
        this._op = match[1];
        this._val = parseInt(match[2], 10);
      }
    }
    this.render();
  }

  connectedCallback() {
    this.render();
  }

  _changeOp(dir) {
    const currentIndex = this._operators.findIndex(o => o.id === this._op);
    let nextIndex = currentIndex + dir;
    if (nextIndex < 0) nextIndex = this._operators.length - 1;
    if (nextIndex >= this._operators.length) nextIndex = 0;
    this._op = this._operators[nextIndex].id;
    this.render();
    this._emitChange();
  }

  _changeVal(dir) {
    this._val += dir;
    if (this._val > 20) this._val = 20;
    if (this._val < 0) this._val = 0; // Preprečimo negativne vrednosti, saj imamo predznak posebej
    this.render();
    this._emitChange();
  }

  _emitChange() {
    this.dispatchEvent(new CustomEvent('change', {
      detail: { value: this.value },
      bubbles: true,
      composed: true
    }));
  }

  render() {
    const opObj = this._operators.find(o => o.id === this._op);
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
          font-family: system-ui, sans-serif;
        }
        .input-container {
          display: flex;
          align-items: center;
          gap: 10px;
          background: var(--bubble, #e5eef6);
          padding: 10px;
          border-radius: var(--radius, 16px);
          border: 2px solid var(--grid-stroke, #dfe7ef);
        }
        .control-group {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
        }
        .display-box {
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius-sm, 12px);
          font-size: 24px;
          font-weight: 900;
          background: var(--card, #ffffff);
          box-shadow: var(--shadow, 0 4px 6px rgba(0,0,0,0.05));
          user-select: none;
        }
        .op-display {
          color: white;
        }
        .op-p { background: var(--pos-bg, #C8E6C9); color: var(--pos-ink, #194d23); }
        .op-m { background: var(--neg-bg, #FFCDD2); color: var(--neg-ink, #7a1c1c); }
        .op-t { background: var(--mul-bg, #E1F5FE); color: var(--mul-ink, #01579B); }
        .op-s { background: var(--div-bg, #FFF3E0); color: var(--div-ink, #E65100); }

        .val-display {
          color: var(--ink, #223);
          min-width: 60px;
        }

        .arrow-btn {
          background: var(--primary, #26C6DA);
          color: white;
          border: none;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          transition: transform 0.1s, background 0.2s;
        }
        .arrow-btn:hover {
          background: var(--primary-d, #1aa7b7);
          transform: scale(1.1);
        }
        .arrow-btn:active {
          transform: scale(0.9);
        }
        .arrow-btn.down {
          /* transform: rotate(180deg); */
        }
      </style>
      <div class="input-container">
        <!-- Operacija -->
        <div class="control-group">
          <button class="arrow-btn up" id="op-up">▲</button>
          <div class="display-box op-display ${opObj.class}">${opObj.symbol}</div>
          <button class="arrow-btn down" id="op-down">▼</button>
        </div>

        <!-- Vrednost -->
        <div class="control-group">
          <button class="arrow-btn up" id="val-up">▲</button>
          <div class="display-box val-display">${this._val}</div>
          <button class="arrow-btn down" id="val-down">▼</button>
        </div>
      </div>
    `;

    this.shadowRoot.getElementById('op-up').onclick = () => this._changeOp(1);
    this.shadowRoot.getElementById('op-down').onclick = () => this._changeOp(-1);
    this.shadowRoot.getElementById('val-up').onclick = () => this._changeVal(1);
    this.shadowRoot.getElementById('val-down').onclick = () => this._changeVal(-1);
  }
}

customElements.define('custom-number-input', CustomNumberInput);
export default CustomNumberInput;
