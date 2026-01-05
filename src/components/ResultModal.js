
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

  show(isSuccess, stars = 0) {
    const content = this.shadowRoot.querySelector('.content');
    content.innerHTML = '';

    if (isSuccess) {
      this.renderSuccess(content, stars);
    } else {
      this.renderFailure(content);
    }

    this.dialog.showModal();
  }

  renderSuccess(container, starsCount) {
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

    const btn = document.createElement('button');
    btn.className = 'btn-next';
    btn.textContent = 'Nadaljuj';
    btn.onclick = () => location.reload();
    container.appendChild(btn);

    // Animate stars
    setTimeout(() => {
      starOutlines.forEach((star, i) => {
        if (i < starsCount) {
          setTimeout(() => {
            star.classList.add('filled');
          }, i * 120);
        }
      });
    }, 100);
  }

  renderFailure(container) {
    const emoji = document.createElement('div');
    emoji.className = 'sad-emoji';
    emoji.textContent = '😢';
    container.appendChild(emoji);

    const msg = document.createElement('p');
    msg.textContent = 'Nič ne de, poskusi še enkrat!';
    container.appendChild(msg);

    const btn = document.createElement('button');
    btn.className = 'btn-retry';
    btn.textContent = 'Poskusi ponovno';
    btn.onclick = () => location.reload();
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
          color: #ddd;
          position: relative;
          transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .star-outline.filled {
          color: var(--gold);
          transform: scale(1.2);
          text-shadow: 0 0 10px rgba(242, 201, 76, 0.5);
        }
        button {
          padding: 16px 32px;
          font-size: clamp(18px, 4vw, 24px);
          font-weight: bold;
          border: none;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: transform 0.1s;
        }
        button:active {
          transform: scale(0.95);
        }
        .btn-next {
          background: var(--ok);
          color: white;
        }
        .btn-retry {
          background: var(--primary);
          color: white;
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
