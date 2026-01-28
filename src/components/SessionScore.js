
class SessionScore extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._stars = 0;
  }

  static get observedAttributes() {
    return ['value'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'value' && oldValue !== newValue) {
      this._stars = parseInt(newValue, 10) || 0;
      this.render();
    }
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const iconSize = 'clamp(18px, 4vw, 24px)';
    const fontSize = 'clamp(16px, 3.5vw, 20px)';

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.4);
          backdrop-filter: blur(4px);
          padding: 4px 12px;
          border-radius: var(--radius-sm, 12px);
          pointer-events: none;
          user-select: none;
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .star-icon {
          width: ${iconSize};
          height: ${iconSize};
          color: var(--accent, #FFD54F);
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
          animation: star-in 0.5s ease-out;
        }

        .score-value {
          font-family: system-ui, sans-serif;
          font-weight: 800;
          font-size: ${fontSize};
          color: var(--ink, #223);
          min-width: 1.2ch;
          text-align: center;
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
      <svg class="star-icon" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
      </svg>
      <span class="score-value">${this._stars}</span>
    `;
  }

  // Metoda za vizualni odziv ob spremembi
  bump() {
    this.classList.add('bump');
    setTimeout(() => this.classList.remove('bump'), 300);
  }
}

customElements.define('session-score', SessionScore);
