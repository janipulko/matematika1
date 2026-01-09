class ScoreGrid extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.value = 0;
    this._ro = null;
  }

  connectedCallback() {
    this.render();
    this.cells = Array.from(this.shadowRoot.querySelectorAll('.cell'));

    const wrap = this.shadowRoot.querySelector('.grid-wrap');
    const grid = this.shadowRoot.querySelector('.grid-frame');

    // 🔥 STABILNA RESIZE LOGIKA
    this._ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      const size = Math.floor(Math.min(width, height));
      grid.style.width = `${size}px`;
      grid.style.height = `${size}px`;
    });

    this._ro.observe(wrap);
  }

  disconnectedCallback() {
    this._ro?.disconnect();
  }

  setValue(v) {
    const n = Math.max(0, Math.min(100, Math.floor(v)));
    this.value = n;
    if (!this.cells) return;
    this.cells.forEach((cell, i) => {
      cell.classList.toggle('filled', i < n);
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
          width: 100%;
          height: 100%;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .grid-wrap {
          width: 100%;
          height: 100%;
          display: grid;
          place-items: center;
        }
        
        /* 🔥 KVADRAT Z OKVIRJEM */
        .grid-frame {
            box-sizing: border-box;
          
            background: var(--card);
            border-radius: var(--radius);
            border: 1px solid var(--grid-stroke);
            padding: clamp(4px, 1vh, 12px);
          
            display: grid;
          }
          
          .grid {
            width: 100%;
            height: 100%;
          
            display: grid;
            grid-template-columns: repeat(10, 1fr);
            gap: clamp(1px, 0.4vh, 6px);
          }



        .cell {
          aspect-ratio: 1 / 1;
          background: rgba(128, 128, 128, 0.1);
          border: clamp(1px, 0.2vh, 2px) solid var(--grid-stroke);
          border-radius: clamp(4px, 1vh, 10px);
          transition: background .18s ease, border-color .18s ease, transform .08s ease;
        }

        .cell.filled {
          background: var(--grid-fill);
          border-color: var(--primary);
          box-shadow: inset 0 0 0 2px rgba(255,255,255,0.2), 0 2px 4px rgba(0,0,0,0.1);
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
        <div class="grid-frame">
           <div class="grid">
             ${cellsHTML}
            </div>
        </div>
      </div>
    `;
  }
}

customElements.define('score-grid', ScoreGrid);
export default ScoreGrid;
