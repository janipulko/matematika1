import './IconCat.js';
import './IconTrap.js';

class ScoreGrid extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.value = 0;
    this._ro = null;
  }

  connectedCallback() {
    this.render();
    this.cells = Array.from(this.shadowRoot.querySelectorAll('.cell'));
    this.cat = this.shadowRoot.querySelector('icon-cat');

    const wrap = this.shadowRoot.querySelector('.grid-wrap');
    const grid = this.shadowRoot.querySelector('.grid-frame');

    // 🔥 STABILNA RESIZE LOGIKA
    this._ro = new ResizeObserver(([entry]) => {
      const {width, height} = entry.contentRect;
      const size = Math.floor(Math.min(width, height));
      grid.style.width = `${size}px`;
      grid.style.height = `${size}px`;

      // Prilagodi velikost mačke glede na celico
      const padding = size * 0.05; // ocena
      const totalGap = 9 * (size * 0.005); // ocena gapa
      const cellSize = (size - padding - totalGap) / 10;

      if (this.cat) {
        // Mačka je zdaj v celici in se prilagodi njeni velikosti. 
        // 110% velikosti celice je dovolj, da uhlji malce gledajo čez.
        const catSize = Math.floor(cellSize * 0.8);
        this.cat.setAttribute('size', catSize);
      }

      // Prilagodi velikost pasti
      const trapIcons = this.shadowRoot.querySelectorAll('icon-trap');
      const trapSize = Math.floor(cellSize * 0.8);
      trapIcons.forEach(icon => icon.setAttribute('size', trapSize));

      // Shranimo zadnjo izračunano velikost celice za nove pasti
      this._lastCellSize = cellSize;
    });

    this._ro.observe(wrap);
  }

  disconnectedCallback() {
    this._ro?.disconnect();
  }

  setValue(v) {
    const n = Math.max(0, Math.min(100, Math.floor(v)));
    this.value = n;
    if (!this.cells) {
      return;
    }
    this.cells.forEach((cell, i) => {
      cell.classList.toggle('filled', i < n);
    });

    if (this.cat) {
      if (n > 0) {
        const targetCell = this.cells[n - 1];
        if (targetCell) {
          this.cat.style.display = 'block';

          // Premaknemo mačko v celico
          targetCell.appendChild(this.cat);
          // Ponastavimo margin če ga je kaj preneslo
          this.cat.style.margin = '0';
        }
      } else {
        this.cat.style.display = 'none';
      }
    }
  }

  setTraps(traps) {
    if (!this.cells) {
      return;
    }
    this.cells.forEach((cell, i) => {
      const isTrap = traps.includes(i + 1);

      // Preverimo, če je bila tu prej past, ki je zdaj ni več
      const oldTrap = cell.querySelector('icon-trap');

      if (oldTrap && !isTrap) {
        // Past je bila odstranjena -> sproži boom
        oldTrap.trigger();
      }

      cell.classList.toggle('trap', isTrap);

      // Če pasti ni več, a oldTrap še vedno obstaja (in ni v stanju proženja), ga odstranimo
      // Opomba: trigger() sam poskrbi za odstranitev po animaciji.
      if (!isTrap && oldTrap && oldTrap.parentNode) {
        // Če smo ravno sprožili trigger, ga pustimo, sicer pa odstranimo
      }

      if (isTrap && !oldTrap) {
        cell.title = `Past na številu ${i + 1}`;
        // Dodamo novo past
        const trap = document.createElement('icon-trap');
        trap.setAttribute('type', 'random');
        const trapSize = this._lastCellSize ? Math.floor(
            this._lastCellSize * 0.8) : 20;
        trap.setAttribute('size', trapSize);
        cell.appendChild(trap);
      } else if (!isTrap) {
        cell.removeAttribute('title');
      }
    });
    // Sprožimo resize observer, da se velikosti TNT ikon takoj popravijo
    if (this._ro && this.shadowRoot.querySelector('.grid-wrap')) {
      // ResizeObserver bo samodejno zaznal če se kaj spremeni,
      // ampak ker smo dodali elemente v shadow DOM, je varno poklicati render velikosti
    }
  }

  flash() {
    const wrap = this.shadowRoot.querySelector('.grid-wrap');
    if (!wrap) {
      return;
    }
    wrap.classList.remove('flash');
    void wrap.offsetWidth;
    wrap.classList.add('flash');
  }

  flashSuccess() {
    // Odstranjeno, ker je animacija moteča
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
          position: relative;
        }

        /* 🔥 KVADRAT Z OKVIRJEM */
        .grid-frame {
          box-sizing: border-box;

          background: var(--card);
          border-radius: var(--radius);
          border: 2px solid var(--grid-stroke);
          padding: clamp(4px, 1vh, 12px);

          display: grid;
          position: relative;
          overflow: visible; /* Za srčke */


          background: linear-gradient(var(--bubble) 0 0) left top    / 50% 50% no-repeat,
          linear-gradient(var(--mul-bg) 0 0) right top    / 50% 50% no-repeat,
          linear-gradient(var(--bg) 0 0) left bottom / 50% 50% no-repeat,
          linear-gradient(var(--card) 0 0) right bottom / 50% 50% no-repeat;

        }


        /* Črte za kvadrante */
        .quadrant-line {
          position: absolute;
          pointer-events: none;
          z-index: 5;
        }


        .grid {
          width: 100%;
          height: 100%;

          display: grid;
          grid-template-columns: repeat(10, 1fr);
          gap: clamp(1px, 0.4vh, 6px);
          overflow: visible;
        }


        .cell {
          aspect-ratio: 1 / 1;
          background: rgba(128, 128, 128, 0.1);
          border: clamp(1px, 0.2vh, 2px) solid var(--grid-stroke);
          border-radius: clamp(4px, 1vh, 10px);
          transition: background .18s ease, border-color .18s ease, transform .08s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: visible; /* Pomembno za senco mačke in srčke */
          position: relative;
          z-index: 1;
        }

        .cell.filled {
          background: var(--grid-fill);
          border-color: var(--primary);
          box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.2), 0 2px 4px rgba(0, 0, 0, 0.1);
          z-index: 2; /* Višji z-index za trenutno/izbrano celico */
        }

        icon-cat {
          transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.2));
          pointer-events: none;
          position: absolute;
          z-index: 100;
          /* Centriranje mačke, ki je večja od celice */
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          /* Zagotovimo, da se ne zamakne zaradi inline stilov */
          margin: 0;
          overflow: visible; /* Za srčke */
        }

        .cell.trap {
          position: relative;
          z-index: 1;
        }

        icon-tnt {
          pointer-events: none;
          display: block;
        }

        .flash {
          animation: flash 320ms ease;
        }

        @keyframes flash {
          0% {
            box-shadow: 0 0 0 0 rgba(239, 83, 80, 0.3);
          }
          50% {
            box-shadow: 0 0 0 8px rgba(239, 83, 80, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(239, 83, 80, 0);
          }
        }
      </style>

      <div class="grid-wrap">
        <div class="grid-frame">
          <div class="grid">
            ${cellsHTML}
          </div>
        </div>
        <icon-cat style="display: none;"></icon-cat>
      </div>
    `;
  }
}

customElements.define('score-grid', ScoreGrid);
export default ScoreGrid;
