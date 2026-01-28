
import { PALETTES, applyPalette } from '../utils/palettes.js';
import './BaseModal.js';

class ColorSettingsModal extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  show() {
    this._attachEventListeners();
    const modal = this.shadowRoot.querySelector('base-modal');
    if (modal) modal.show();
  }

  close() {
    const modal = this.shadowRoot.querySelector('base-modal');
    if (modal) modal.close();
  }

  _attachEventListeners() {
    const okBtn = this.shadowRoot.querySelector('.btn-ok');

    okBtn.onclick = () => this.close();
    
    // Poslušalci za gumbe palet
    this.shadowRoot.querySelectorAll('.palette-btn').forEach(btn => {
      btn.onclick = () => {
        const paletteId = btn.dataset.id;
        applyPalette(paletteId);
        this.close();
      };
    });
  }

  render() {
    const currentPalette = localStorage.getItem('math-game-palette') || 'fruit';

    const lightPalettes = Object.values(PALETTES).filter(p => p.type === 'light');
    const darkPalettes = Object.values(PALETTES).filter(p => p.type === 'dark');

    const renderPaletteBtn = (p) => {
      const displayColors = [
        p.colors['--bg'],
        p.colors['--primary'],
        p.colors['--accent'],
        p.colors['--bubble']
      ];

      return `
        <button class="palette-btn ${p.id === currentPalette ? 'active' : ''}" 
                data-id="${p.id}">
          <div class="palette-preview-row">
            ${displayColors.map(c => `<span class="color-dot" style="background: ${c}"></span>`).join('')}
          </div>
          <span class="palette-name">${p.name}</span>
        </button>
      `;
    };

    this.shadowRoot.innerHTML = `
      <style>
        .inner-content {
          display: flex;
          flex-direction: column;
          gap: 30px;
          align-items: center;
        }
        .section-title {
          font-size: 1.2rem;
          font-weight: bold;
          color: var(--muted);
          margin-bottom: 15px;
          width: 100%;
          max-width: 800px;
          text-align: left;
        }
        .palette-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 16px;
          width: 100%;
          max-width: 800px;
        }
        .palette-btn {
          appearance: none;
          border: 3px solid var(--bubble);
          background: var(--card);
          color: var(--ink);
          border-radius: var(--radius);
          padding: 12px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.05);
        }
        .palette-btn:hover {
          transform: translateY(-4px);
          box-shadow: 0 6px 15px rgba(0,0,0,0.1);
        }
        .palette-btn.active {
          border-color: var(--primary);
          background: var(--bubble);
        }
        .palette-preview-row {
          display: flex;
          gap: 6px;
          justify-content: center;
          width: 100%;
          padding: 4px 0;
        }
        .color-dot {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 1px solid rgba(0,0,0,0.1);
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        .palette-name {
          font-size: 0.9rem;
          font-weight: bold;
          color: var(--ink);
        }
        .footer {
          padding: 20px 0 0 0;
          text-align: center;
        }
        .btn-ok {
          background: var(--primary);
          color: var(--on-primary, white);
          border: none;
          padding: 16px 64px;
          border-radius: 999px;
          font-weight: bold;
          cursor: pointer;
          font-size: 1.2rem;
          transition: transform 0.1s;
        }
        .btn-ok:active {
          transform: scale(0.95);
        }
      </style>
      <base-modal modal-title="Izbira barv">
        <div class="inner-content">
          <div style="width: 100%; max-width: 800px;">
            <div class="section-title">Svetle barve ☀️</div>
            <div class="palette-grid">
              ${lightPalettes.map(renderPaletteBtn).join('')}
            </div>
          </div>

          <div style="width: 100%; max-width: 800px;">
            <div class="section-title">Temne barve 🌙</div>
            <div class="palette-grid">
              ${darkPalettes.map(renderPaletteBtn).join('')}
            </div>
          </div>
        </div>
        <div class="footer">
          <button class="btn-ok">V redu</button>
        </div>
      </base-modal>
    `;
  }
}

customElements.define('color-settings-modal', ColorSettingsModal);
export default ColorSettingsModal;
