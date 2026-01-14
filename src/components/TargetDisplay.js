
class TargetDisplay extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.containerEl = this.shadowRoot.querySelector('#targetsContainer');
  }

  setTargets(targets, achievedIndices = []) {
    if (!this.containerEl) return;
    this.containerEl.innerHTML = '';
    
    targets.forEach((t, i) => {
      const isAchieved = achievedIndices.includes(i);
      const bubble = document.createElement('div');
      bubble.className = `target-bubble ${isAchieved ? 'achieved' : ''}`;
      bubble.textContent = t;
      if (isAchieved) {
        const check = document.createElement('span');
        check.className = 'check';
        check.textContent = '✓';
        bubble.appendChild(check);
      }
      this.containerEl.appendChild(bubble);
    });
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
        }
        .targets-wrapper {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: clamp(8px, 2vh, 20px);
          padding: 8px 0;
        }
        .target-bubble {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: clamp(45px, 10vh, 80px);
          height: clamp(45px, 10vh, 80px);
          background: var(--card);
          border: 3px solid var(--bubble);
          border-radius: 50%;
          font-weight: 900;
          font-size: clamp(20px, 4vh, 36px);
          color: var(--ink);
          box-shadow: var(--shadow-sm);
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .target-bubble.achieved {
          background: var(--accent);
          border-color: var(--primary);
          transform: scale(0.9);
          opacity: 0.8;
          color: var(--primary-d);
        }
        .check {
          position: absolute;
          bottom: -5px;
          right: -5px;
          background: var(--primary);
          color: white;
          font-size: 14px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      </style>
      <div class="targets-wrapper" id="targetsContainer"></div>
    `;
  }
}

customElements.define('target-display', TargetDisplay);
export default TargetDisplay;
