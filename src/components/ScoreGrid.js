import './IconCat.js';
import './IconTrap.js';
import {AVATARS} from '../utils/avatars.js';

class ScoreGrid extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.value = 0;
    this._visualValue = 0;
    this._animationFrame = null;
    this._timer = null;
    this._ro = null;

    const keys = Object.keys(AVATARS);
    this.avatar = keys[Math.floor(Math.random() * keys.length)];
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
        // Mačka je zdaj absolutno pozicionirana nad mrežo.
        // Prilagodimo njeno velikost glede na celico.
        const catSize = Math.floor(cellSize * 0.85);
        this.cat.setAttribute('size', catSize);
        // Ponovno izračunamo pozicijo, če se je velikost spremenila
        this._updateCatPosition(this._visualValue);
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
    if (this._animationFrame) {
      cancelAnimationFrame(this._animationFrame);
    }
    if (this._timer) {
      clearTimeout(this._timer);
    }
  }

  setValue(v, animated = true) {
    const n = Math.max(0, Math.min(100, Math.floor(v)));
    this.value = n;
    if (animated) {
      this._startAnimation();
    } else {
      this._stopAnimation();
      this._visualValue = n;
      this._updateVisuals(n, false);
    }
  }

  _stopAnimation() {
    if (this._animationFrame) {
      cancelAnimationFrame(this._animationFrame);
      this._animationFrame = null;
    }
    if (this._timer) {
      clearTimeout(this._timer);
      this._timer = null;
    }
  }

  _startAnimation() {
    this._stopAnimation();

    const animate = () => {
      if (this._visualValue === this.value) {
        this._animationFrame = null;
        return;
      }

      const diff = this.value - this._visualValue;
      const step = diff > 0 ? 1 : -1;

      this._visualValue += step;
      this._updateVisuals(this._visualValue);

      // Če gre za večji skok, malo pohitrimo
      const remaining = Math.abs(this.value - this._visualValue);
      const delay = remaining > 10 ? 30 : 60;

      this._timer = setTimeout(() => {
        this._animationFrame = requestAnimationFrame(animate);
      }, delay);
    };

    this._animationFrame = requestAnimationFrame(animate);
  }

  _updateVisuals(n, triggerTraps = true) {
    if (!this.cells) {
      return;
    }
    this.cells.forEach((cell, i) => {
      const isFilled = i < n;
      // Celice "na čakanju" so tiste med trenutno vizualno vrednostjo n in ciljno vrednostjo this.value
      const isWaiting = n < this.value 
        ? (i >= n && i < this.value) // Gremo navzgor
        : (i >= this.value && i < n); // Gremo navzdol

      // Optimizacija: spremenimo razred le, če je potrebno
      if (cell.classList.contains('filled') !== isFilled) {
        cell.classList.toggle('filled', isFilled);
      }
      if (cell.classList.contains('waiting') !== isWaiting) {
        cell.classList.toggle('waiting', isWaiting);
      }
    });

    if (this.cat) {
      if (n > 0) {
        this.cat.style.display = 'block';
        this._updateCatPosition(n);

        if (triggerTraps) {
          const targetCell = this.cells[n - 1];
          const trap = targetCell ? targetCell.querySelector('icon-trap')
              : null;
          if (trap && !trap.hasAttribute('data-triggered')) {
            trap.setAttribute('data-triggered', 'true');
            this.cat.jump();
            setTimeout(() => {
              trap.trigger();
              this.dispatchEvent(new CustomEvent('trap-triggered', {
                detail: {index: n},
                bubbles: true,
                composed: true
              }));
            }, 100);
          }
        }
      } else {
        this.cat.style.display = 'none';
      }
    }
  }

  _updateCatPosition(n) {
    if (!this.cat || n <= 0 || !this.cells) {
      return;
    }

    const index = n - 1;
    const targetCell = this.cells[index];
    const grid = this.shadowRoot.querySelector('.grid');

    if (!targetCell || !grid) {
      return;
    }

    // Pridobimo geometrijo grida in ciljne celice
    const gridRect = grid.getBoundingClientRect();
    const cellRect = targetCell.getBoundingClientRect();

    // Izračunamo relativni položaj središča celice glede na grid
    // translate3d bo premaknil zgornji levi kot mačke na to točko.
    // Ker mačka nima določene width/height v % (zdaj uporablja piksle iz size),
    // jo moramo centrirati ročno.
    
    const catRect = this.cat.getBoundingClientRect();
    
    const x = (cellRect.left - gridRect.left) + (cellRect.width / 2) - (catRect.width / 2)+catRect.width/3;
    const y = (cellRect.top - gridRect.top) + (cellRect.height / 2) - (catRect.height / 2)+catRect.height/3;

    this.cat.style.transform = `translate3d(calc(${x.toFixed(2)}px + var(--cat-offset-x)), calc(${y.toFixed(2)}px + var(--cat-offset-y)), 0)`;
  }

  setTraps(traps) {
    if (!this.cells) {
      return;
    }
    this.cells.forEach((cell, i) => {
      const isTrap = traps.includes(i + 1);
      const oldTrap = cell.querySelector('icon-trap');

      // Če je past v seznamu, a je ni na mreži, jo dodamo
      if (isTrap && !oldTrap) {
        cell.title = `Past na številu ${i + 1}`;
        cell.classList.add('trap');
        const trap = document.createElement('icon-trap');
        trap.setAttribute('type', 'random');
        const trapSize = this._lastCellSize ? Math.floor(
            this._lastCellSize * 0.8) : 20;
        trap.setAttribute('size', trapSize);
        cell.appendChild(trap);
      }
          // Če pasti ni v seznamu, a je na mreži (in ni v stanju proženja), jo odstranimo takoj
      // To se zgodi ob resetu igre.
      else if (!isTrap && oldTrap && !oldTrap.hasAttribute('data-triggered')) {
        cell.removeAttribute('title');
        cell.classList.remove('trap');
        oldTrap.remove();
      } else if (!isTrap) {
        cell.removeAttribute('title');
        cell.classList.remove('trap');
      }
    });
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

        .cell.waiting {
          background: color-mix(in oklab, var(--grid-fill), transparent 70%);
          border-color: color-mix(in oklab, var(--primary), transparent 50%);
          z-index: 1;
        }

        icon-cat {
          position: absolute;
          left: 0;
          top: 0;
          z-index: 100;
          pointer-events: none;
          will-change: transform;
          transition: transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          
          /* Velikost se nastavlja dinamično preko atributa size */
          display: flex;
          align-items: center;
          justify-content: center;

          /* Fino nastavljanje zamika v pikslih */
          --cat-offset-x: 0px;
          --cat-offset-y: 0px;
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
            <icon-cat type="${this.avatar}" style="display: none;"></icon-cat>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('score-grid', ScoreGrid);
export default ScoreGrid;
