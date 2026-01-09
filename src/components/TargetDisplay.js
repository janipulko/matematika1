
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
          font-weight: 900;
          font-size: clamp(32px, 8vh, 64px);
          line-height: 1;
          color: var(--ink);
          text-shadow: 0 4px 10px rgba(0,0,0,0.1);
          margin: 4px 0;
        }

      </style>
      <div class="target" id="targetValue">0</div>

    `;
  }
}

customElements.define('target-display', TargetDisplay);
export default TargetDisplay;
