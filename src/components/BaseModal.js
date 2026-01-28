
class BaseModal extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this._setupBaseEvents();
  }

  _setupBaseEvents() {
    // Poslušamo dogodke na nivoju komponente
    this.addEventListener('click', (e) => {
      const path = e.composedPath();
      
      // Preverimo če je klik na gumb za zapiranje (ki je v shadow DOMu)
      const isCloseBtn = path.some(el => el.classList && el.classList.contains('close-btn'));
      if (isCloseBtn) {
        this.close();
        return;
      }

      // Klik na ozadje dialoga
      if (e.target.tagName === 'DIALOG' && e.target === path[0]) {
        this.close();
      }
    });

    // Podpora za zapiranje preko dogodka iz vsebine (slotov)
    this.addEventListener('close-modal', (e) => {
      this.close();
    });
  }

  show() {
    this.render();
    const dialog = this.shadowRoot.querySelector('dialog');
    if (dialog) {
      dialog.onclose = () => {
        this.dispatchEvent(new CustomEvent('modal-closed', {
          bubbles: true,
          composed: true
        }));
        
        // Izpraznimo HTML po zaprtju
        this.shadowRoot.innerHTML = '';
        
        if (this.getAttribute('remove-on-close') !== 'false') {
          this.remove();
        }
      };

      dialog.showModal();
    }
  }

  close() {
    const dialog = this.shadowRoot.querySelector('dialog');
    if (dialog && dialog.open) {
      dialog.close();
    }
  }

  render() {
    const hideClose = this.hasAttribute('hide-close');
    const title = this.getAttribute('modal-title');

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 10000;
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
          background: var(--card, #fff);
          color: var(--ink, #223);
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
          padding: 20px 0;
          position: relative;
          width: 100%;
          background: var(--card, #fff);
          z-index: 10;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          flex-shrink: 0;
        }
        h2 {
          margin: 0;
          font-size: clamp(24px, 5vw, 40px);
          color: var(--primary-d, #1aa7b7);
          text-align: center;
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
          color: var(--muted, #6b7280);
          padding: 0;
          line-height: 1;
        }
        .content {
          padding: 20px;
          overflow-y: auto;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
        }
      </style>
      <dialog>
        ${title || !hideClose ? `
          <div class="header">
            ${title ? `<h2>${title}</h2>` : ''}
            ${!hideClose ? `<button class="close-btn" aria-label="Zapri">×</button>` : ''}
          </div>
        ` : ''}
        <div class="content">
          <slot></slot>
        </div>
      </dialog>
    `;
  }
}

customElements.define('base-modal', BaseModal);
