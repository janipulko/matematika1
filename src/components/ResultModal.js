
class ResultModal extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.dialog = this.shadowRoot.querySelector('dialog');
    this.dialog.onclose = () => {
      this.remove();
    };

    const closeBtn = this.shadowRoot.querySelector('.close-btn');
    if (closeBtn) {
      closeBtn.onclick = () => this.close();
    }

    this._canClose = false;
    // Preprečimo takojšnje zapiranje: modal se lahko zapre šele, ko uporabnik 
    // spusti tipko Enter (keyup) in jo nato znova pritisne.
    this._handleKeyDown = this._handleKeyDown.bind(this);
    this._handleKeyUp = this._handleKeyUp.bind(this);
    window.addEventListener('keydown', this._handleKeyDown, true);
    window.addEventListener('keyup', this._handleKeyUp, true);
  }

  disconnectedCallback() {
    window.removeEventListener('keydown', this._handleKeyDown, true);
    window.removeEventListener('keyup', this._handleKeyUp, true);
  }

  _handleKeyDown(e) {
    if (e.key === 'Enter') {
      if (!this._canClose) return;
      e.stopPropagation();
      this.close();
    }
    if (e.key === 'Escape') {
      this.close();
    }
  }

  _handleKeyUp(e) {
    if (e.key === 'Enter') {
      this._canClose = true;
    }
  }

  async show(isSuccess, stars = 0) {
    const content = this.shadowRoot.querySelector('.content');
    content.innerHTML = '';

    if (isSuccess) {
      // Posodobi skupno število zvezdic v localStorage
      const currentTotal = parseInt(localStorage.getItem('math-game-total-stars') || '0', 10);
      const newTotal = currentTotal + stars;
      localStorage.setItem('math-game-total-stars', newTotal);

      await this.renderSuccess(content, stars, newTotal);
    } else {
      this.renderFailure(content);
    }

    this.dialog.showModal();
  }

  close() {
    if (this.dialog) {
      this.dialog.close();
    }
  }

  async renderNextStepButton(container, totalStars) {
    const params = new URLSearchParams(location.search);
    const currentStep = parseInt(params.get('step') || localStorage.getItem('math-game-step') || '0', 10);
    const nextStep = currentStep + 1;

    // Pridobimo podatke o naslednjem koraku
    let nextCombo = null;
    try {
      const response = await fetch('data/groups.json');
      const groups = await response.json();
      let count = 0;
      for (const group of groups) {
        if (nextStep < count + group.combos.length) {
          nextCombo = group.combos[nextStep - count];
          break;
        }
        count += group.combos.length;
      }
    } catch (e) {
      console.error("Napaka pri nalaganju za naslednji korak:", e);
    }

    if (!nextCombo) return; // Ni več korakov

    const btn = document.createElement('button');
    btn.className = 'btn-reward'; // Uporabimo isti stil kot prej
    
    const maxUnlockedStep = parseInt(localStorage.getItem('math-game-step') || '0', 10);
    const isAlreadyUnlocked = nextStep <= maxUnlockedStep;

    if (isAlreadyUnlocked) {
      btn.innerHTML = '<span>Naslednji korak ➔</span>';
      btn.onclick = () => {
        location.href = `play.html?step=${nextStep}&num=${nextCombo}`;
      };
    } else {
      const cost = 10;
      btn.innerHTML = `<span>Odkleni korak ${nextStep + 1}</span> <span style="font-size: 0.7em; opacity: 0.9; margin-left: 8px;">(${cost} ★)</span>`;
      btn.disabled = totalStars < cost;
      btn.onclick = () => {
        const newTotal = totalStars - cost;
        localStorage.setItem('math-game-total-stars', newTotal);
        localStorage.setItem('math-game-step', nextStep);
        location.href = `play.html?step=${nextStep}&num=${nextCombo}`;
      };
    }
    
    container.appendChild(btn);
  }

  async renderSuccess(container, starsCount, totalStars) {
    const title = document.createElement('h2');
    title.textContent = 'Bravo! Odlično ti gre!';
    container.appendChild(title);

    const starsContainer = document.createElement('div');
    starsContainer.className = 'stars-container';
    
    const starOutlines = [];
    for (let i = 0; i < 3; i++) {
      const star = document.createElement('div');
      star.className = 'star-outline';
      star.innerHTML = '★';
      starsContainer.appendChild(star);
      starOutlines.push(star);
    }
    
    container.appendChild(starsContainer);

    // Prikaz skupnega seštevka zvezdic
    const totalContainer = document.createElement('div');
    totalContainer.className = 'total-stars';
    totalContainer.innerHTML = `Skupaj: <span>${totalStars}</span> ★`;
    container.appendChild(totalContainer);

    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'button-group';

    // Gumb za naslednji korak
    await this.renderNextStepButton(buttonGroup, totalStars);

    const btn = document.createElement('button');
    btn.className = 'btn-next';
    btn.textContent = 'Naprej';
    btn.onclick = () => {
      this.close();
      location.reload();
    };
    buttonGroup.appendChild(btn);
    container.appendChild(buttonGroup);

    // Animate stars
    setTimeout(() => {
      starOutlines.forEach((star, i) => {
        if (i < starsCount) {
          setTimeout(() => {
            star.classList.add('filled');
            if (starsCount === 3) {
              star.classList.add('super-star');
            }
          }, i * 150);
        }
      });
    }, 100);
  }

  renderFailure(container) {
    const emoji = document.createElement('div');
    emoji.className = 'sad-emoji';
    emoji.textContent = '😢';
    container.appendChild(emoji);

    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'button-group';

    const btn = document.createElement('button');
    btn.className = 'btn-retry';
    btn.textContent = 'Poskusi ponovno';
    btn.onclick = () => {
      this.close();
      this.dispatchEvent(new CustomEvent('reset-game', { bubbles: true, composed: true }));
    };
    buttonGroup.appendChild(btn);
    container.appendChild(buttonGroup);
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          --modal-bg: var(--card);
        }
        dialog {
          border: none;
          padding: 0;
          width: 100vw;
          height: 100vh;
          max-width: 100vw;
          max-height: 100vh;
          margin: 0;
          background: radial-gradient(circle at 50% 20%, var(--card), var(--bubble));
          box-sizing: border-box;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        dialog[open] {
          display: flex;
        }
        dialog::backdrop {
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(4px);
        }
        .close-btn {
          position: absolute;
          top: 20px;
          right: 20px;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 1px solid var(--bubble);
          background: var(--card);
          color: var(--muted);
          font-size: 24px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
          transition: all 0.2s;
          padding: 0;
          box-shadow: none;
        }
        .close-btn:hover {
          background: var(--primary);
          color: white;
          transform: rotate(90deg);
        }
        .content {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-evenly;
          padding: 40px 20px;
          box-sizing: border-box;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        h2 {
          margin: 0;
          color: var(--primary-d);
          font-size: clamp(24px, 6vw, 42px);
          line-height: 1.2;
          text-shadow: 0 2px 4px rgba(0,0,0,0.1);
          text-align: center;
        }
        .sad-emoji {
          font-size: clamp(80px, 20vw, 150px);
          line-height: 1;
        }
        .stars-container {
          display: flex;
          gap: clamp(10px, 4vw, 30px);
          justify-content: center;
          align-items: center;
        }
        .star-outline {
          font-size: clamp(60px, 15vw, 120px);
          color: var(--bubble);
          position: relative;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          user-select: none;
          line-height: 1;
        }
        .star-outline.filled {
          color: var(--primary);
          transform: scale(1.2) rotate(5deg);
          text-shadow: 0 0 15px rgba(var(--primary-rgb, 38, 198, 218), 0.5);
          filter: drop-shadow(0 0 2px var(--primary));
          animation: star-pop 0.5s ease-out forwards;
        }
        @keyframes star-pop {
          0% { transform: scale(0) rotate(-20deg); opacity: 0; }
          70% { transform: scale(1.4) rotate(10deg); }
          100% { transform: scale(1.2) rotate(5deg); opacity: 1; }
        }
        .star-outline.super-star {
          color: var(--accent);
          text-shadow: 0 0 20px var(--accent);
          filter: drop-shadow(0 0 5px var(--accent));
          animation: star-pulse 2s infinite ease-in-out, star-pop 0.5s ease-out forwards;
        }
        @keyframes star-pulse {
          0%, 100% { transform: scale(1.2) rotate(5deg); filter: brightness(1); }
          50% { transform: scale(1.3) rotate(-5deg); filter: brightness(1.3) drop-shadow(0 0 15px var(--accent)); }
        }
        .total-stars {
          font-size: clamp(18px, 4vw, 28px);
          color: var(--ink);
          background: var(--bubble);
          padding: 10px 24px;
          border-radius: var(--radius);
          font-weight: bold;
          border: 2px solid var(--primary);
          box-shadow: 0 4px 15px rgba(0,0,0,0.05);
        }
        .total-stars span {
          color: var(--primary-d);
        }
        .button-group {
          display: flex;
          flex-direction: column;
          gap: 15px;
          width: 100%;
          max-width: 400px;
          align-items: center;
        }
        button {
          width: 100%;
          max-width: 320px;
          padding: 16px 24px;
          font-size: clamp(16px, 4vw, 20px);
          font-weight: 900;
          border: none;
          border-radius: var(--radius);
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          text-transform: uppercase;
          letter-spacing: 1px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          box-sizing: border-box;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 60px;
        }
        button:active {
          transform: scale(0.95);
        }
        .btn-next {
          background: var(--primary);
          color: var(--on-primary, white);
          text-shadow: 0 1px 2px rgba(0,0,0,0.2);
        }
        .btn-next:hover {
          background: var(--primary);
          filter: brightness(1.1);
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(0,0,0,0.2);
        }
        .btn-reward {
          background: var(--accent);
          color: var(--on-accent, black);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
          animation: entice 2s infinite ease-in-out;
          border: 3px solid rgba(255, 255, 255, 0.5);
        }
        .btn-reward:hover:not(:disabled) {
          background: var(--accent);
          filter: brightness(1.1);
          transform: translateY(-4px) scale(1.02);
        }
        @keyframes entice {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        .btn-reward:disabled {
          background: var(--bubble);
          color: var(--muted);
          cursor: not-allowed;
          animation: none;
          box-shadow: none;
          border: none;
          opacity: 0.6;
        }
        .btn-retry {
          background: var(--primary);
          color: var(--on-primary, white);
          text-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }
        .btn-retry:hover {
          background: var(--primary);
          filter: brightness(1.1);
          transform: translateY(-2px);
        }
      </style>
      <dialog>
        <button class="close-btn" aria-label="Zapri">&times;</button>
        <div class="content"></div>
      </dialog>
    `;
  }
}

customElements.define('result-modal', ResultModal);
export default ResultModal;
