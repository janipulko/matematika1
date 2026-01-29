
class SessionScore extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._stars = 0;
    this._record = 0;
  }

  static get observedAttributes() {
    return ['value', 'record'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      if (name === 'value') {
        this._stars = parseInt(newValue, 10) || 0;
      } else if (name === 'record') {
        this._record = parseInt(newValue, 10) || 0;
      }
      this.render();
    }
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const iconSize = 'clamp(18px, 4vw, 24px)';
    const fontSize = 'clamp(16px, 3.5vw, 20px)';
    const recordFontSize = 'clamp(10px, 2.5vw, 12px)';

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          background: rgba(255, 255, 255, 0.4);
          backdrop-filter: blur(4px);
          padding: 4px 16px;
          border-radius: var(--radius-sm, 12px);
          pointer-events: none;
          user-select: none;
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .score-group {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .record-group {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          border-left: 1px solid rgba(0, 0, 0, 0.1);
          padding-left: 10px;
          opacity: 0.9;
        }

        .star-icon {
          width: ${iconSize};
          height: ${iconSize};
          color: var(--accent, #FFD54F);
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
          animation: star-in 0.5s ease-out;
        }

        .trophy-icon {
          width: ${recordFontSize};
          height: ${recordFontSize};
          color: #FFB300; /* Nekoliko temnejša zlata za pokal */
          filter: drop-shadow(0 1px 2px rgba(0,0,0,0.1));
        }

        .score-value {
          font-family: system-ui, sans-serif;
          font-weight: 800;
          font-size: ${fontSize};
          color: var(--ink, #223);
          min-width: 1.2ch;
          text-align: center;
        }

        .record-label {
          font-family: system-ui, sans-serif;
          font-size: ${recordFontSize};
          font-weight: 600;
          color: var(--ink, #223);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .record-value {
          font-family: system-ui, sans-serif;
          font-size: ${recordFontSize};
          font-weight: 800;
          color: var(--ink, #223);
        }

        @keyframes star-in {
          0% { transform: scale(0) rotate(-45deg); opacity: 0; }
          70% { transform: scale(1.2) rotate(10deg); }
          100% { transform: scale(1) rotate(0); opacity: 1; }
        }

        .bump {
          transform: scale(1.1);
        }
      </style>
      <div class="score-group">
        <svg class="star-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
        </svg>
        <span class="score-value">${this._stars}</span>
      </div>
      <div class="record-group">
        <div class="score-group">
          <svg class="trophy-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18 2H6v2H2v7c0 2.21 1.79 4 4 4h2.29c.89 1.5 2.42 2.54 4.21 2.91V19H10v2h4v-2h-2.5v-2.09c1.79-.37 3.32-1.41 4.21-2.91H18c2.21 0 4-1.79 4-4V4h-4V2zM6 13c-1.1 0-2-.9-2-2V6h2v7zm14-2c0 1.1-.9 2-2 2v-7h2v5z"/>
          </svg>
          <span class="record-value">${this._record}</span>
        </div>
      </div>
    `;
  }

  // Metoda za vizualni odziv ob spremembi
  bump() {
    this.classList.add('bump');
    setTimeout(() => this.classList.remove('bump'), 300);
  }
}

customElements.define('session-score', SessionScore);
