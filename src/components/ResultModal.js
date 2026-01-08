
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
      btn.textContent = 'Naslednji korak ➔';
      btn.onclick = () => {
        location.href = `play.html?step=${nextStep}&num=${nextCombo}`;
      };
    } else {
      const cost = 10;
      btn.innerHTML = `Odkleni korak ${nextStep + 1} <span style="font-size: 0.8em; opacity: 0.9;">(${cost} ★)</span>`;
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

    // Gumb za naslednji korak
    await this.renderNextStepButton(container, totalStars);

    const btnRow = document.createElement('div');
    btnRow.style.display = 'flex';
    btnRow.style.gap = '10px';
    btnRow.style.width = '100%';
    btnRow.style.justifyContent = 'center';

    const btn = document.createElement('button');
    btn.className = 'btn-next';
    btn.textContent = 'Naprej';
    btn.onclick = () => {
      this.close();
      location.reload();
    };
    btnRow.appendChild(btn);
    container.appendChild(btnRow);

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

    const btn = document.createElement('button');
    btn.className = 'btn-retry';
    btn.textContent = 'Poskusi ponovno';
    btn.onclick = () => {
      this.close();
      this.dispatchEvent(new CustomEvent('reset-game', { bubbles: true, composed: true }));
    };
    container.appendChild(btn);
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
          text-align: center;
          box-shadow: none;
          background: var(--card);
          display: flex;
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
        .content {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 40px;
          width: 100%;
          height: 100%;
        }
        h2 {
          margin: 0;
          color: var(--ok);
          font-size: clamp(24px, 5vw, 48px);
        }
        .sad-emoji {
          font-size: clamp(80px, 15vw, 150px);
        }
        .stars-container {
          display: flex;
          gap: clamp(15px, 3vw, 40px);
          margin: 20px 0;
        }
        .star-outline {
          font-size: clamp(60px, 12vw, 120px);
          color: #eee;
          position: relative;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          user-select: none;
        }
        .star-outline.filled {
          color: var(--gold);
          transform: scale(1.2) rotate(5deg);
          text-shadow: 0 0 20px rgba(242, 201, 76, 0.8),
                       0 0 40px rgba(242, 201, 76, 0.4);
          background: linear-gradient(45deg, #FFD700, #FFA500);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 0 5px rgba(255, 215, 0, 0.5));
          animation: star-pop 0.5s ease-out forwards;
        }
        @keyframes star-pop {
          0% { transform: scale(0) rotate(-20deg); opacity: 0; }
          70% { transform: scale(1.4) rotate(10deg); }
          100% { transform: scale(1.2) rotate(5deg); opacity: 1; }
        }
        .star-outline.super-star {
          animation: star-pulse 2s infinite ease-in-out, star-pop 0.5s ease-out forwards;
        }
        @keyframes star-pulse {
          0%, 100% { transform: scale(1.2) rotate(5deg); filter: brightness(1); }
          50% { transform: scale(1.3) rotate(-5deg); filter: brightness(1.3) drop-shadow(0 0 15px var(--gold)); }
        }
        .total-stars {
          font-size: clamp(20px, 4vw, 32px);
          color: var(--primary);
          background: #fdfcf0;
          padding: 12px 30px;
          border-radius: var(--radius);
          font-weight: bold;
          margin-top: -10px;
          border: 2px solid rgba(242, 201, 76, 0.2);
          box-shadow: 0 4px 15px rgba(0,0,0,0.05);
        }
        .total-stars span {
          color: var(--gold);
          display: inline-block;
          animation: count-up 0.5s ease-out;
        }
        @keyframes count-up {
          from { transform: translateY(10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        button {
          padding: 18px 36px;
          font-size: clamp(18px, 4vw, 24px);
          font-weight: 900;
          border: none;
          border-radius: var(--radius);
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          text-transform: uppercase;
          letter-spacing: 1px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        button:active {
          transform: scale(0.95);
        }
        .btn-next {
          background: var(--ok);
          color: white;
          padding: 12px 24px;
          font-size: clamp(14px, 3vw, 18px);
          margin: 0 auto;
        }
        .btn-next:hover {
          background: #27ae60;
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(46, 204, 113, 0.3);
        }
        .btn-reward {
          background: linear-gradient(135deg, var(--gold), #f39c12);
          color: white;
          margin-top: -10px;
          padding: 24px 48px;
          font-size: clamp(22px, 5vw, 30px);
          box-shadow: 0 8px 20px rgba(241, 196, 15, 0.4);
          animation: entice 2s infinite ease-in-out;
          border: 3px solid rgba(255, 255, 255, 0.3);
        }
        .btn-reward:hover:not(:disabled) {
          background: linear-gradient(135deg, #f1c40f, #e67e22);
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 12px 25px rgba(241, 196, 15, 0.5);
        }
        @keyframes entice {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .btn-reward:disabled {
          background: #e2e8f0;
          color: #94a3b8;
          cursor: not-allowed;
          transform: none;
          animation: none;
          box-shadow: none;
          border: none;
        }
        .btn-retry {
          background: var(--primary);
          color: white;
        }
        .btn-retry:hover {
          background: #2980b9;
          transform: translateY(-2px);
        }
      </style>
      <dialog>
        <div class="content"></div>
      </dialog>
    `;
  }
}

customElements.define('result-modal', ResultModal);
export default ResultModal;
