
class StepIndicator extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  setSteps(minSteps) {
    this.minSteps = minSteps;
    const bubblesContainer = this.shadowRoot.querySelector('.bubbles-row');
    const starsContainer = this.shadowRoot.querySelector('.stars-row');
    if (!bubblesContainer || !starsContainer) return;

    bubblesContainer.innerHTML = '';
    starsContainer.innerHTML = '';
    this.circles = [];
    for (let i = 0; i < minSteps; i++) {
      const b = document.createElement('div');
      b.className = 'bubble';
      bubblesContainer.appendChild(b);
      this.circles.push(b);
    }

    this.stars = [];
    for (let i = 0; i < 3; i++) {
      const s = document.createElement('div');
      s.className = 'star';
      s.textContent = '★';
      starsContainer.appendChild(s);
      this.stars.push(s);
    }
  }

  update(clicks, minSteps) {
    if (!this.circles || !this.stars) return;
    this.circles.forEach((circle, i) => {
      if (clicks >= i + 1) circle.classList.add('filled');
      else circle.classList.remove('filled');
    });

    let starsLeft = 3 - Math.max(0, clicks - minSteps);
    if (starsLeft < 0) starsLeft = 0;
    this.stars.forEach((star, i) => {
      if (i < starsLeft) star.classList.remove('dim');
      else star.classList.add('dim');
    });
  }

  getStarsLeft(clicks, minSteps) {
    let left = 3 - Math.max(0, clicks - minSteps);
    return left < 0 ? 0 : left;
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
        }
        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          width: 100%;
        }
        .bubbles-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          width: 100%;
          padding: 0;
        }
        .stars-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          width: 100%;
        }
        .bubble {
          width: clamp(10px, 1.8vh, 14px);
          height: clamp(10px, 1.8vh, 14px);
          border-radius: 999px;
          background: #fff;
          border: 2px solid #bcd4e6;
          box-shadow: inset 0 0 0 2px rgba(255,255,255,0.65);
          transition: background .2s ease, transform .08s ease, border-color .2s ease;
        }
        .bubble.filled {
          background: #a6e3a1;
          border-color: #92d493;
        }
        .star {
          width: clamp(20px, 3vh, 26px);
          height: clamp(20px, 3vh, 26px);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: clamp(20px, 3vh, 26px);
          color: var(--gold);
          text-shadow: 0 1px 0 rgba(0,0,0,0.08);
          transition: transform .08s ease, opacity .2s ease, color .2s ease;
        }
        .star.dim {
          color: #d9d9d9;
          opacity: .4;
        }
      </style>
      <div class="container">
        <div class="bubbles-row"></div>
        <div class="stars-row"></div>
      </div>
    `;
  }
}

customElements.define('step-indicator', StepIndicator);
export default StepIndicator;
