
class ScoreGrid extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.value = 0;
  }

  connectedCallback() {
    this.render();
    this.cells = Array.from(this.shadowRoot.querySelectorAll('.cell'));
  }

  setValue(v) {
    const n = Math.max(0, Math.min(100, Math.floor(v)));
    this.value = n;
    if (!this.cells) return;
    this.cells.forEach((cell, i) => {
      if (i < n) cell.classList.add('filled');
      else cell.classList.remove('filled');
    });
  }

  flash() {
    const wrap = this.shadowRoot.querySelector('.grid-wrap');
    if (!wrap) return;
    wrap.classList.remove('flash');
    void wrap.offsetWidth;
    wrap.classList.add('flash');
  }

  render() {
    let cellsHTML = '';
    for (let i = 0; i < 100; i++) {
      cellsHTML += '<div class="cell"></div>';
    }

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: flex;
          flex: 1;
          min-height: 0;
          align-items: center;
          justify-content: center;
          width: 100%;
          overflow: hidden;
        }
        .grid-wrap {
          padding: clamp(4px, 1vh, 12px);
          background: linear-gradient(180deg, #fff, #f9fbff);
          border-radius: var(--radius);
          border: 1px solid #eef2f7;
          height: 100%;
          aspect-ratio: 1/1;
          display: flex;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(10, 1fr);
          gap: clamp(1px, 0.4vh, 6px);
          width: 100%;
          height: 100%;
        }
        .cell {
          aspect-ratio: 1/1;
          background: #fff;
          border: clamp(1px, 0.2vh, 2px) solid var(--grid-stroke);
          border-radius: clamp(4px, 1vh, 10px);
          transition: background .18s ease, border-color .18s ease, transform .08s ease;
        }
        .cell.filled {
          background: var(--grid-fill);
          border-color: #f3d070;
          box-shadow: inset 0 0 0 2px rgba(255,255,255,0.6);
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
      <div class="grid-wrap">
        <div class="grid">
          ${cellsHTML}
        </div>
      </div>
    `;
  }
}

customElements.define('score-grid', ScoreGrid);
export default ScoreGrid;
