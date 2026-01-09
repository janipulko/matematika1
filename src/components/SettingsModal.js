
class SettingsModal extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._soundOn = true;
    this._showActive = true;
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

  setSound(enabled) {
    this._soundOn = enabled;
    this._updateMuteBtn();
  }

  setActiveIndicator(enabled) {
    this._showActive = enabled;
    this._updateActiveBtn();
  }

  _updateMuteBtn() {
    const btn = this.shadowRoot.querySelector('.mute-btn');
    if (btn) {
      btn.textContent = this._soundOn ? '🔊 Zvok je vklopljen' : '🔇 Zvok je izklopljen';
      btn.classList.toggle('off', !this._soundOn);
    }
  }

  _updateActiveBtn() {
    const btn = this.shadowRoot.querySelector('.active-btn');
    if (btn) {
      btn.textContent = this._showActive ? '🎯 Aktiven gumb: DA' : '🎯 Aktiven gumb: NE';
      btn.classList.toggle('off', !this._showActive);
    }
  }

  _attachEventListeners() {
    const dialog = this.shadowRoot.querySelector('dialog');
    const closeBtn = this.shadowRoot.querySelector('.close-btn');
    const okBtn = this.shadowRoot.querySelector('.btn-ok');
    const muteBtn = this.shadowRoot.querySelector('.mute-btn');
    const activeBtn = this.shadowRoot.querySelector('.active-btn');
    const colorBtn = this.shadowRoot.querySelector('.color-btn');

    closeBtn.onclick = () => this.close();
    okBtn.onclick = () => this.close();
    
    dialog.onclose = () => {
      this.remove();
    };

    colorBtn.onclick = () => {
      this.close();
      this.dispatchEvent(new CustomEvent('open-color-settings', {
        bubbles: true,
        composed: true
      }));
    };

    muteBtn.onclick = () => {
      this._soundOn = !this._soundOn;
      this._updateMuteBtn();
      this.dispatchEvent(new CustomEvent('toggle-sound', { 
        bubbles: true, 
        composed: true, 
        detail: { enabled: this._soundOn } 
      }));
    };

    activeBtn.onclick = () => {
      this._showActive = !this._showActive;
      this._updateActiveBtn();
      this.dispatchEvent(new CustomEvent('toggle-active-indicator', { 
        bubbles: true, 
        composed: true, 
        detail: { enabled: this._showActive } 
      }));
    };

    dialog.onclick = (e) => {
      if (e.target === dialog) this.close();
    };
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        dialog {
          border: none;
          padding: 0;
          width: 100vw;
          height: 100vh;
          max-width: 100vw;
          max-height: 100vh;
          margin: 0;
          background: var(--card);
          color: var(--ink);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
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
          margin-bottom: 40px;
          position: relative;
          width: 100%;
        }
        h2 {
          margin: 0;
          font-size: clamp(24px, 5vw, 48px);
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
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 24px;
          width: 100%;
        }
        .mute-btn, .active-btn, .unlock-link, .color-btn {
          appearance: none;
          border: 3px solid var(--primary);
          background: var(--bubble);
          color: var(--primary-d);
          padding: 20px 40px;
          border-radius: var(--radius);
          font-weight: 900;
          cursor: pointer;
          transition: all 0.2s;
          font-size: clamp(18px, 4vw, 24px);
          width: 320px;
          max-width: 80%;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
          box-shadow: 0 4px 10px rgba(0,0,0,0.05);
        }
        .mute-btn:hover, .active-btn:hover, .unlock-link:hover, .color-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(0,0,0,0.1);
          filter: brightness(1.05);
        }
        .mute-btn:active, .active-btn:active, .unlock-link:active, .color-btn:active {
          transform: scale(0.96);
        }
        .mute-btn.off, .active-btn.off {
          border-color: var(--muted);
          color: var(--muted);
          opacity: 0.8;
        }
        .footer {
          margin-top: 40px;
          text-align: center;
        }
        .btn-ok {
          background: var(--primary);
          color: var(--on-primary, white);
          border: none;
          padding: 16px 48px;
          border-radius: 999px;
          font-weight: bold;
          cursor: pointer;
          font-size: clamp(18px, 4vw, 24px);
          transition: transform 0.1s;
        }
        .btn-ok:active {
          transform: scale(0.95);
        }
      </style>
      <dialog>
        <div class="header">
          <h2>Nastavitve</h2>
          <button class="close-btn">&times;</button>
        </div>
        <div class="content">
          <button class="mute-btn"></button>
          <button class="active-btn"></button>
          <button class="color-btn">🎨 Barve aplikacije</button>
          <a href="./unlock.html" class="unlock-link">🔓 Odkleni vsebino</a>
        </div>
        <div class="footer">
          <button class="btn-ok">V redu</button>
        </div>
      </dialog>
    `;

    this._updateMuteBtn();
    this._updateActiveBtn();
  }
}

customElements.define('settings-modal', SettingsModal);
export default SettingsModal;
