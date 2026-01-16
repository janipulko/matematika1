import './IconCat.js';
import './IconTnt.js';
import './BoomIcon.js';

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
    this.cat = this.shadowRoot.querySelector('icon-cat');

    const wrap = this.shadowRoot.querySelector('.grid-wrap');
    const grid = this.shadowRoot.querySelector('.grid-frame');

    // 🔥 STABILNA RESIZE LOGIKA
    this._ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
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
        const catSize = Math.floor(cellSize * 1.1);
        this.cat.setAttribute('size', catSize);
      }

      // Prilagodi velikost TNT ikon
      const tntIcons = this.shadowRoot.querySelectorAll('icon-tnt');
      const tntSize = Math.floor(cellSize * 0.8);
      tntIcons.forEach(icon => icon.setAttribute('size', tntSize));

      // Shranimo zadnjo izračunano velikost celice za nove TNT ikone
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
    if (!this.cells) return;
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
    if (!this.cells) return;
    this.cells.forEach((cell, i) => {
      const isTrap = traps.includes(i + 1);
      
      // Preverimo, če je bila tu prej past, ki je zdaj ni več
      const hasOldTnt = !!cell.querySelector('icon-tnt');
      
      if (hasOldTnt && !isTrap) {
        // Past je bila odstranjena -> sproži boom
        this.showExplosion(i);
      }

      cell.classList.toggle('trap', isTrap);
      
      // Odstranimo obstoječo TNT ikono, če obstaja
      const oldTnt = cell.querySelector('icon-tnt');
      if (oldTnt) oldTnt.remove();

      if (isTrap) {
        cell.title = `Past na številu ${i + 1}`;
        // Dodamo TNT ikono
        const tnt = document.createElement('icon-tnt');
        // Uporabimo zadnjo znano velikost celice
        const tntSize = this._lastCellSize ? Math.floor(this._lastCellSize * 0.8) : 20;
        tnt.setAttribute('size', tntSize); 
        cell.appendChild(tnt);
      } else {
        cell.removeAttribute('title');
      }
    });
    // Sprožimo resize observer, da se velikosti TNT ikon takoj popravijo
    if (this._ro && this.shadowRoot.querySelector('.grid-wrap')) {
        // ResizeObserver bo samodejno zaznal če se kaj spremeni, 
        // ampak ker smo dodali elemente v shadow DOM, je varno poklicati render velikosti
    }
  }

  showExplosion(index) {
    const cell = this.cells[index];
    if (!cell) return;

    const grid = this.shadowRoot.querySelector('.grid-frame');
    if (!grid) return;

    const boom = document.createElement('boom-icon');
    const size = this._lastCellSize ? Math.floor(this._lastCellSize * 2.5) : 48;
    boom.setAttribute('size', size);
    boom.setAttribute('variant', 'burst');
    boom.setAttribute('autoplay', '');
    
    // Barve prilagodimo tnt ikoni (oranžno-rdeča)
    boom.setAttribute('start', '#ff8a00');
    boom.setAttribute('end', '#ff0033');

    // Izračunamo pozicijo celice glede na grid-frame
    const cellRect = cell.getBoundingClientRect();
    const gridRect = grid.getBoundingClientRect();
    
    const left = cellRect.left - gridRect.left + (cellRect.width / 2);
    const top = cellRect.top - gridRect.top + cellRect.height; // Dno celice

    // Pozicioniranje
    boom.style.position = 'absolute';
    boom.style.left = `${left}px`;
    boom.style.top = `${top}px`;
    boom.style.transform = 'translate(-50%, -60%)'; // -60% da je center malo nad dnom celice
    boom.style.pointerEvents = 'none';
    boom.style.zIndex = '1000';

    grid.appendChild(boom);

    // Odstranimo po koncu animacije
    boom.addEventListener('boomend', () => {
      boom.remove();
    });

    // Varnostni izklop če boomend ne bi bil sprožen
    setTimeout(() => {
      if (boom.parentNode) boom.remove();
    }, 1500);
  }

  flash() {
    const wrap = this.shadowRoot.querySelector('.grid-wrap');
    if (!wrap) return;
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
          }

        /* Črte za kvadrante */
        .quadrant-line {
          position: absolute;
          pointer-events: none;
          z-index: 5;
          }

        .quadrant-line.horizontal {
          left: 0;
          right: 0;
          top: 50%;
          border-top: 2px dashed var(--grid-stroke);
          transform: translateY(calc(-50% + 0.5px));
        }

        .quadrant-line.vertical {
          top: 0;
          bottom: 0;
          left: 50%;
          border-left: 2px dashed var(--grid-stroke);
          transform: translateX(calc(-50% + 0.5px));
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
          box-shadow: inset 0 0 0 2px rgba(255,255,255,0.2), 0 2px 4px rgba(0,0,0,0.1);
          z-index: 2; /* Višji z-index za trenutno/izbrano celico */
        }

        icon-cat {
          transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          filter: drop-shadow(0 2px 6px rgba(0,0,0,0.2));
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
          0% { box-shadow: 0 0 0 0 rgba(239,83,80,0.3); }
          50% { box-shadow: 0 0 0 8px rgba(239,83,80,0); }
          100% { box-shadow: 0 0 0 0 rgba(239,83,80,0); }
        }
      </style>

      <div class="grid-wrap">
        <div class="grid-frame">
           <div class="quadrant-line horizontal"></div>
           <div class="quadrant-line vertical"></div>
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
