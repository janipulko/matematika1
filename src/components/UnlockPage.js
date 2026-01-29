
import './ComboButton.js';
import {GameProvider} from '../utils/game-provider.js';
import '../utils/stars-provider.js';

class UnlockPage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._totalStars = 0;
    
    // Poslušamo posodobitve zvezdic
    document.addEventListener('stars-updated', (e) => {
      this._totalStars = e.detail.totalStars;
      this.updateStarsDisplay();
    });
  }

  async connectedCallback() {
    this.render();
    await this.generateGroups();
  }

  updateStarsDisplay() {
    const badge = this.shadowRoot.querySelector('.stars-badge span');
    if (badge) {
      badge.textContent = this._totalStars;
    }
  }

  async generateGroups() {
    const groupsContainer = this.shadowRoot.querySelector('.groups');
    const games = GameProvider.getAllGames();

    const section = document.createElement('section');
    section.innerHTML = `
      <div class="group-header">
        <h2>Moje shranjene igre</h2>
        <p>Tukaj so igre, ki si jih sam sestavil v konfiguratorju.</p>
        <a href="configurator.html" class="config-btn">+ Sestavi novo igro</a>
      </div>
      <div class="grid"></div>
    `;
    const grid = section.querySelector('.grid');

    if (games.length === 0) {
      grid.innerHTML = `<p style="grid-column: 1/-1; padding: 20px; background: var(--bubble); border-radius: var(--radius); color: var(--muted);">Še nimaš shranjenih iger. Pojdi v konfigurator in si sestavi svojo!</p>`;
    }

    games.forEach((game, index) => {
      const btn = document.createElement('combo-button');
      const comboStr = game.num;
      
      let finalCombo = comboStr;
      if (!finalCombo.includes('st') && game.steps) finalCombo += `st${game.steps}`;
      if (!finalCombo.includes('tr') && game.traps !== undefined) finalCombo += `tr${game.traps}`;
      if (!finalCombo.includes('go') && game.targets) finalCombo += `go${game.targets}`;

      btn.setCombo(finalCombo, 0, true);
      btn.setAttribute('data-step', index);
      btn.dataset.gameParams = JSON.stringify(game);
      grid.appendChild(btn);
    });

    groupsContainer.appendChild(section);

    this.shadowRoot.addEventListener('unlock-combo', (e) => {
      const gameParams = e.target.dataset.gameParams;
      if (gameParams) {
        const game = JSON.parse(gameParams);
        const params = GameProvider.gameToParams(game);
        location.href = `play.html?${params}`;
      }
    });
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          max-width: 1000px;
          margin: 0 auto;
          padding: 20px;
          font-family: inherit;
        }
        header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
          background: var(--card);
          color: var(--ink);
          padding: 20px;
          border-radius: var(--radius);
          box-shadow: var(--shadow);
        }
        .logo {
          font-size: 24px;
          font-weight: 900;
          color: var(--primary);
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .back-link {
          appearance: none;
          border: 2px solid var(--primary);
          background: var(--bubble);
          color: var(--primary-d);
          padding: 8px 16px;
          border-radius: var(--radius-sm);
          font-weight: bold;
          text-decoration: none;
          font-size: 0.9rem;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .back-link:hover {
          background: var(--primary);
          color: var(--on-primary);
        }
        .stars-badge {
          background: var(--bg);
          padding: 10px 20px;
          border-radius: 30px;
          font-weight: bold;
          font-size: 18px;
          color: var(--primary);
          border: 2px solid var(--bubble);
        }
        .stars-badge span {
          color: var(--gold-d);
        }
        .groups {
          display: flex;
          flex-direction: column;
          gap: 50px;
        }
        .group-header {
          margin-bottom: 20px;
        }
        .config-btn {
          display: inline-flex;
          align-items: center;
          margin-top: 15px;
          padding: 10px 20px;
          background: var(--accent);
          color: var(--ink);
          text-decoration: none;
          font-weight: bold;
          border-radius: var(--radius-sm);
          box-shadow: 0 4px 0px rgba(0,0,0,0.1);
          transition: all 0.2s;
        }
        .config-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 0px rgba(0,0,0,0.1);
          filter: brightness(1.05);
        }
        .config-btn:active {
          transform: translateY(0);
          box-shadow: 0 2px 0px rgba(0,0,0,0.1);
        }
        h2 {
          margin: 0;
          color: var(--ink);
          font-size: 24px;
        }
        p {
          margin: 5px 0 0;
          color: var(--muted);
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          grid-auto-rows: auto;
          gap: 15px;
        }
        @media (max-width: 600px) {
          .grid {
            grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
            gap: 10px;
          }
          :host { padding: 10px; }
          header { margin-bottom: 20px; }
        }
        @media (max-width: 360px) {
          .grid {
            grid-template-columns: 1fr;
          }
        }
      </style>
      <header>
        <a href="play.html" class="back-link">← Nazaj v igro</a>
        <div class="stars-badge"><span>...</span> ★</div>
      </header>
      <div class="groups"></div>
    `;
    this.updateStarsDisplay();
  }
}

customElements.define('unlock-page', UnlockPage);
export default UnlockPage;
