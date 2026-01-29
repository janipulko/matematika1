
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
    // combo format: "p2p4st5tr10go5" -> [{op:'p', val:2}, ...]
    // Samo osnovne operacije p, m, t, s
    const regex = /(st|tr|go|[pmts])(\d+)/g;
    const items = [];
    const params = { st: null, tr: null, go: null };
    let match;
    while ((match = regex.exec(this.combo)) !== null) {
      const op = match[1];
      const val = match[2];
      if (op === 'st' || op === 'tr' || op === 'go') {
        params[op] = val;
        continue;
      }
      
      items.push({ op, val });
    }

    // Začetna vrednost, preden dobimo posodobitev iz providerja
    const currentStars = parseInt(localStorage.getItem('math-game-total-stars') || '0', 10);
    const canAfford = this.isUnlocked || currentStars >= this.cost;

    // Default values if not in combo string
    const displaySteps = params.st || '';
    const displayTraps = params.tr || '';
    const displayTargets = params.go || '';

    const hasConfig = displaySteps && displayTraps && displayTargets;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }
        button {
          width: 100%;
          height: 100%;
          min-height: 130px;
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
          gap: 8px;
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

        .game-info {
          display: flex;
          gap: 10px;
          font-size: 11px;
          color: var(--muted);
          background: var(--bg);
          padding: 4px 8px;
          border-radius: 8px;
          width: 100%;
          justify-content: center;
          box-sizing: border-box;
        }
        .info-item {
          display: flex;
          align-items: center;
          gap: 3px;
        }
        .info-icon {
          font-style: normal;
          font-size: 14px;
        }

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

        <div class="game-info">
          ${hasConfig ? `
          <div class="info-item" title="Koraki">
            <span class="info-icon">👣</span>
            <span>${displaySteps}</span>
          </div>
          <div class="info-item" title="Pasti">
            <span class="info-icon">⚠️</span>
            <span>${displayTraps}</span>
          </div>
          <div class="info-item" title="Cilji">
            <span class="info-icon">🎯</span>
            <span>${displayTargets}</span>
          </div>
          ` : `
          <div class="info-item" style="color: var(--neg-bg)">
            <span>⚠️ Nepopopolna konfiguracija</span>
          </div>
          `}
        </div>

        ${this.isUnlocked 
          ? `<div class="badge-unlocked">Odklenjeno ✓</div>`
          : `<div class="cost">Cena: <span>${this.cost}</span> ★</div>`
        }
      </button>
    `;

    this.shadowRoot.querySelector('button').onclick = () => {
      if (canAfford) {
        // Če še ni odklenjeno in stane več kot 0, zahtevamo porabo zvezdic
        if (!this.isUnlocked && this.cost > 0) {
          this.dispatchEvent(new CustomEvent('stars-request-spend', {
            detail: { amount: this.cost },
            bubbles: true,
            composed: true
          }));
        }

        this.dispatchEvent(new CustomEvent('unlock-combo', {
          detail: { combo: this.combo, cost: this.cost, isUnlocked: this.isUnlocked },
          bubbles: true,
          composed: true
        }));
      }
    };
  }
  
  connectedCallback() {
    this._starsUpdatedHandler = (e) => {
      const totalStars = e.detail.totalStars;
      const canAfford = this.isUnlocked || totalStars >= this.cost;
      const btn = this.shadowRoot.querySelector('button');
      if (btn) {
        btn.disabled = !canAfford;
      }
    };
    document.addEventListener('stars-updated', this._starsUpdatedHandler);
  }

  disconnectedCallback() {
    document.removeEventListener('stars-updated', this._starsUpdatedHandler);
  }
}

customElements.define('combo-button', ComboButton);
