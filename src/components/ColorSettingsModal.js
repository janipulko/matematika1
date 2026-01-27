
import { PALETTES, applyPalette } from '../utils/palettes.js';

class ColorSettingsModal extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this._attachEventListeners();
  }

  show() {
    const dialog = this.shadowRoot.querySelector('dialog');
    if (dialog) dialog.showModal();
  }

  close() {
    const dialog = this.shadowRoot.querySelector('dialog');
    if (dialog) dialog.close();
  }

  _attachEventListeners() {
    const dialog = this.shadowRoot.querySelector('dialog');
    const closeBtn = this.shadowRoot.querySelector('.close-btn');
    const okBtn = this.shadowRoot.querySelector('.btn-ok');

    closeBtn.onclick = () => this.close();
    okBtn.onclick = () => this.close();
    
    dialog.onclose = () => {
      this.remove();
    };

    dialog.onclick = (e) => {
      if (e.target === dialog) this.close();
    };

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
        :host {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 10001;
          pointer-events: none;
        }
        dialog {
          pointer-events: auto;
          border: none;
          padding: 0;
          width: 92vw;
          max-width: 600px;
          max-height: 92vh;
          margin: auto;
          border-radius: var(--radius, 16px);
          background: var(--card);
          color: var(--ink);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        }
        dialog[open] {
          display: flex;
        }
        dialog::backdrop {
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(4px);
        }
        .header {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
          position: sticky;
          top: 0;
          background: var(--card);
          z-index: 10;
          border-bottom: 1px solid var(--bubble);
        }
        h2 {
          margin: 0;
          font-size: clamp(24px, 5vw, 32px);
          color: var(--primary-d);
        }
        .close-btn {
          position: absolute;
          right: 20px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          font-size: 2.5rem;
          cursor: pointer;
          color: var(--muted);
          padding: 0;
          line-height: 1;
        }
        .content {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
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
          padding: 20px;
          text-align: center;
          background: var(--card);
          border-top: 1px solid var(--bubble);
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
      <dialog>
        <div class="header">
          <h2>Izbira barv</h2>
          <button class="close-btn">&times;</button>
        </div>
        <div class="content">
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
      </dialog>
    `;
  }
}

customElements.define('color-settings-modal', ColorSettingsModal);
export default ColorSettingsModal;
