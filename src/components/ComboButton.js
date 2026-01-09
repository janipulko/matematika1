
class ComboButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  setCombo(combo, cost = 30, isUnlocked = false) {
    this.combo = combo;
    this.cost = isUnlocked ? 0 : cost;
    this.isUnlocked = isUnlocked;
    this.render();
  }

  render() {
    // combo format: "p2p4p10" -> [{op:'p', val:2}, ...]
    const regex = /([pmts])(\d+)/g;
    const items = [];
    let match;
    while ((match = regex.exec(this.combo)) !== null) {
      items.push({ op: match[1], val: match[2] });
    }

    const currentStars = parseInt(localStorage.getItem('math-game-total-stars') || '0', 10);
    const canAfford = this.isUnlocked || currentStars >= this.cost;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }
        button {
          width: 100%;
          height: 100%;
          min-height: 110px;
          background: var(--card);
          color: var(--ink);
          border: 4px solid var(--bubble);
          border-radius: var(--radius-sm);
          padding: 12px;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          position: relative;
          overflow: hidden;
          box-sizing: border-box;
        }
        button:hover:not(:disabled) {
          transform: translateY(-5px);
          border-color: var(--primary);
          box-shadow: 0 10px 15px rgba(0,0,0,0.05);
        }
        button:active:not(:disabled) {
          transform: scale(0.95);
        }
        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          filter: grayscale(0.5);
        }
        .circles {
          display: flex;
          gap: clamp(2px, 1vw, 6px);
          flex-wrap: nowrap;
          justify-content: center;
          width: 100%;
          padding: 0 4px;
          box-sizing: border-box;
        }
        .circle {
          flex: 1 1 0px;
          min-width: 0;
          max-width: 42px;
          aspect-ratio: 1/1;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          font-size: clamp(10px, 3vw, 14px);
          color: white;
          white-space: nowrap;
        }
        .op-p { background: var(--pos-bg); color: var(--pos-ink); }
        .op-m { background: var(--neg-bg); color: var(--neg-ink); }
        .op-t { background: var(--mul-bg); color: var(--mul-ink); }
        .op-s { background: var(--div-bg); color: var(--div-ink); }

        .cost {
          font-size: 12px;
          font-weight: bold;
          color: var(--muted);
          background: var(--bg);
          padding: 2px 8px;
          border-radius: 10px;
        }
        .cost span {
          color: var(--gold-d);
        }
        .badge-unlocked {
          font-size: 10px;
          color: var(--ok);
          font-weight: bold;
          text-transform: uppercase;
        }
      </style>
      <button ${!canAfford ? 'disabled' : ''}>
        <div class="circles">
          ${items.map(item => `
            <div class="circle op-${item.op}">
              ${item.op === 'p' ? '+' : item.op === 'm' ? '-' : item.op === 't' ? '×' : '÷'}${item.val}
            </div>
          `).join('')}
        </div>
        ${this.isUnlocked 
          ? `<div class="badge-unlocked">Odklenjeno ✓</div>`
          : `<div class="cost">Cena: <span>${this.cost}</span> ★</div>`
        }
      </button>
    `;

    this.shadowRoot.querySelector('button').onclick = () => {
      if (canAfford) {
        this.dispatchEvent(new CustomEvent('unlock-combo', {
          detail: { combo: this.combo, cost: this.cost, isUnlocked: this.isUnlocked },
          bubbles: true,
          composed: true
        }));
      }
    };
  }
}

customElements.define('combo-button', ComboButton);
