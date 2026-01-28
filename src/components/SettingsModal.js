
import './BaseModal.js';

class SettingsModal extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._soundOn = true;
    this._showActive = true;
    this._gameType = localStorage.getItem('math-game-type') || 'sum';
    this._needsReload = false;
  }

  connectedCallback() {
    this.render();
  }

  show() {
    this._attachEventListeners();
    const modal = this.shadowRoot.querySelector('base-modal');
    if (modal) {
      modal.show();
    }
  }

  close() {
    const modal = this.shadowRoot.querySelector('base-modal');
    if (modal) modal.close();
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

  async _hardReset() {
    try {
      // 1. Unregister all service workers
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (let registration of registrations) {
          await registration.unregister();
        }
      }

      // 2. Clear all caches
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        for (let name of cacheNames) {
          await caches.delete(name);
        }
      }

      // 3. Reload the page
      window.location.reload();
    } catch (error) {
      console.error('Hard reset failed:', error);
      alert('Prišlo je do napake pri osveževanju. Prosimo, poskusite znova.');
    }
  }

  _attachEventListeners() {
    const modal = this.shadowRoot.querySelector('base-modal');
    const okBtn = this.shadowRoot.querySelector('.btn-ok');
    const muteBtn = this.shadowRoot.querySelector('.mute-btn');
    const activeBtn = this.shadowRoot.querySelector('.active-btn');
    const colorBtn = this.shadowRoot.querySelector('.color-btn');
    const refreshBtn = this.shadowRoot.querySelector('.refresh-btn');

    okBtn.onclick = () => this.close();
    
    modal.addEventListener('modal-closed', () => {
      if (this._needsReload) {
        this.dispatchEvent(new CustomEvent('settings-changed', {
          bubbles: true,
          composed: true
        }));
      }
      this.remove();
    });

    refreshBtn.onclick = async () => {
      if (confirm('Ali želite popolno osvežiti aplikacijo? To bo ponovno naložilo vse datoteke, nastavitve in napredek pa bodo ohranjeni.')) {
        await this._hardReset();
      }
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
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        .inner-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          width: 100%;
        }
        .mute-btn, .active-btn, .unlock-link, .color-btn, .config-btn, .refresh-btn {
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
          max-width: 90%;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
          box-shadow: 0 4px 10px rgba(0,0,0,0.05);
        }
        .mute-btn:hover, .active-btn:hover, .unlock-link:hover, .color-btn:hover, .config-btn:hover, .refresh-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(0,0,0,0.1);
          filter: brightness(1.05);
        }
        .mute-btn:active, .active-btn:active, .unlock-link:active, .color-btn:active, .config-btn:active, .refresh-btn:active {
          transform: scale(0.96);
        }
        .config-btn {
          background: var(--accent);
          border-color: var(--accent-d);
          color: var(--on-accent);
        }
        .refresh-btn {
          border-color: #ff9800;
          color: #e65100;
        }
        .mute-btn.off, .active-btn.off {
          border-color: var(--muted);
          color: var(--muted);
          opacity: 0.8;
        }
        .footer {
          padding: 20px 0 0 0;
          text-align: center;
          width: 100%;
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
      <base-modal modal-title="Nastavitve">
        <div class="inner-content">
          <a href="./configurator.html" class="config-btn">⚙️ Konfigurator</a>
          <a href="./type.html" class="unlock-link">🎮 Izberi igro</a>
          <a href="./unlock.html" class="unlock-link">🔓 Moja zbirka</a>
          <button class="mute-btn"></button>
          <button class="active-btn"></button>
          <button class="color-btn">🎨 Barve aplikacije</button>
          <button class="refresh-btn">🔄 Osveži aplikacijo</button>
        </div>
        <div class="footer">
          <button class="btn-ok">V redu</button>
        </div>
      </base-modal>
    `;

    this._updateMuteBtn();
    this._updateActiveBtn();
  }
}

customElements.define('settings-modal', SettingsModal);
export default SettingsModal;
