
import '../components/ComboButton.js';
import {GameProvider} from '../utils/game-provider.js';
import '../utils/stars-provider.js';

class UnlockPage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  async connectedCallback() {
    this.render();
    await this.generateGroups();
  }

  async generateGroups() {
    const groupsContainer = this.shadowRoot.querySelector('.groups');
    const games = GameProvider.getAllGames();

    const section = document.createElement('div');
    section.className = 'section';
    section.innerHTML = `
        <h2>Moje shranjene igre</h2>
        <p>Tukaj so igre, ki si jih sam sestavil v konfiguratorju.</p>
        <div class="grid"></div>
        <div style="margin-top: 30px; text-align: center;">
          <a href="configurator.html" class="config-btn">+ Sestavi novo igro</a>
        </div>
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
        .section {
          margin-bottom: 30px;
          padding: 20px;
          background: var(--bg);
          border-radius: var(--radius-sm);
          text-align: left;
        }
        .section h2 {
          font-size: 1.2rem;
          margin-top: 0;
          margin-bottom: 10px;
          color: var(--ink);
        }
        .section p {
          margin: 0 0 15px 0;
          color: var(--muted);
          font-size: 0.95rem;
        }
        .config-btn {
          display: inline-block;
          padding: 12px 24px;
          background: var(--primary);
          color: var(--on-primary);
          text-decoration: none;
          font-weight: 900;
          border-radius: var(--radius-sm);
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
          transition: all 0.2s;
        }
        .config-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 15px rgba(0,0,0,0.15);
          filter: brightness(1.1);
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 15px;
          justify-items: center;
        }
        @media (max-width: 600px) {
          .grid {
            grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
            gap: 10px;
          }
        }
      </style>
      <div class="groups"></div>
    `;
  }
}

customElements.define('unlock-page', UnlockPage);
export default UnlockPage;
