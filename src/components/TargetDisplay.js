
class TargetDisplay extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.valueEl = this.shadowRoot.querySelector('#targetValue');
  }

  setValue(v) {
    if (!this.valueEl) return;
    this.valueEl.textContent = String(v);
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }
        .target {
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          font-weight: 800;
          font-size: clamp(32px, 8vh, 64px);
          line-height: 1;
          color: #123;
          text-shadow: 0 2px 0 rgba(255,255,255,0.9);
          margin: 4px 0;
        }
        .subtitle {
          text-align: center;
          color: var(--muted);
          font-size: clamp(10px, 1.5vh, 14px);
          margin-top: 2px;
        }
      </style>
      <div class="target" id="targetValue">0</div>
      <div class="subtitle">Zapolni mrežo do te številke, nato pritisni <b>=</b></div>
    `;
  }
}

customElements.define('target-display', TargetDisplay);
export default TargetDisplay;
