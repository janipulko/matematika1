
import './ComboButton.js';

class UnlockPage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  async connectedCallback() {
    this.render();
    this.initUnlocked();
    await this.generateGroups();
  }

  initUnlocked() {
    const type = localStorage.getItem('math-game-type') || 'sum';
    
    if (type === 'custom') {
      this.currentStep = 0;
      return;
    }

    const key = `math-game-step-${type}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      this.currentStep = parseInt(stored, 10);
    } else {
      this.currentStep = 0;
      localStorage.setItem(key, '0');
    }
  }

  async generateGroups() {
    const groupsContainer = this.shadowRoot.querySelector('.groups');
    const type = localStorage.getItem('math-game-type') || 'sum';
    
    if (type === 'custom') {
      this.generateCustomGroups(groupsContainer);
      return;
    }

    const dataPath = type === 'groups' ? 'data/groups.json' : 'data/sum.json';
    
    try {
      const response = await fetch(dataPath);
      const groups = await response.json();
      
      let stepCounter = 0;
      groups.forEach(group => {
        const section = document.createElement('section');
        section.innerHTML = `
          <div class="group-header">
            <h2>${group.title}</h2>
            <p>${group.description}</p>
          </div>
          <div class="grid"></div>
        `;
        const grid = section.querySelector('.grid');
        
        let unlockedInGroup = 0;
        group.combos.forEach((combo, index) => {
          const globalStepIndex = stepCounter + index;
          if (globalStepIndex <= this.currentStep) {
            const btn = document.createElement('combo-button');
            btn.setCombo(combo, 30, true);
            btn.setAttribute('data-step', globalStepIndex);
            grid.appendChild(btn);
            unlockedInGroup++;
          }
        });
        
        const groupStartStep = stepCounter;
        stepCounter += group.combos.length;
        const groupEndStep = stepCounter - 1;
        
        // Pokažemo še naslednji zaklenjen korak, če obstaja v tej skupini
        if (this.currentStep + 1 >= groupStartStep && this.currentStep + 1 <= groupEndStep) {
           const nextCombo = group.combos[this.currentStep + 1 - groupStartStep];
           const btn = document.createElement('combo-button');
           btn.setCombo(nextCombo, 30, false);
           btn.setAttribute('data-step', this.currentStep + 1);
           grid.appendChild(btn);
        }
        
        // Če ima skupina kaj odklenjenega ali če je to skupina, kjer je naslednji korak za odklenit
        if (unlockedInGroup > 0 || (this.currentStep + 1 >= groupStartStep && this.currentStep + 1 <= groupEndStep)) {
          groupsContainer.appendChild(section);
        }
      });
    } catch (e) {
      console.error("Napaka pri nalaganju skupin:", e);
    }

    this.shadowRoot.addEventListener('unlock-combo', (e) => {
      // Če dogodek prihaja iz custom gumba, ga ignoriramo tukaj, ker ga obdeluje generateCustomGroups
      if (e.target.dataset.customParams) return;
      
      const step = e.target.getAttribute('data-step');
      this.handleUnlock(e.detail.combo, e.detail.cost, e.detail.isUnlocked, parseInt(step, 10));
    });
  }

  generateCustomGroups(container) {
    const myGames = JSON.parse(localStorage.getItem('math-game-my-games') || '[]');
    
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

    if (myGames.length === 0) {
      grid.innerHTML = `<p style="grid-column: 1/-1; padding: 20px; background: var(--bubble); border-radius: var(--radius); color: var(--muted);">Še nimaš shranjenih iger. Pojdi v konfigurator in si sestavi svojo!</p>`;
    }

    myGames.forEach((game, index) => {
      const btn = document.createElement('combo-button');
      // Za lastne igre predpostavimo, da so vedno odklenjene (isUnlocked = true)
      let comboStr = typeof game === 'string' ? game : game.num;
      
      // Če imamo objekt z dodatnimi parametri, jih dodamo v combo niz za ComboButton
      if (typeof game === 'object' && game !== null) {
        if (!comboStr.includes('st') && game.steps) comboStr += `st${game.steps}`;
        if (!comboStr.includes('tr') && game.traps !== undefined) comboStr += `tr${game.traps}`;
        if (!comboStr.includes('go') && game.targets) comboStr += `go${game.targets}`;
      }

      btn.setCombo(comboStr, 0, true);
      btn.setAttribute('data-step', index);
      // Dodamo metapodatke za igro
      btn.dataset.customParams = typeof game === 'string' ? game : JSON.stringify(game);
      grid.appendChild(btn);
    });

    container.appendChild(section);

    // Ker dogodek mehurčka (bubbles: true), ga ulovimo na shadowRoot
    this.shadowRoot.addEventListener('unlock-combo', (e) => {
      const customParams = e.target.dataset.customParams;
      if (customParams) {
        if (customParams.startsWith('{')) {
          const game = JSON.parse(customParams);
          // Za custom igre preverimo če imajo vse parametre
          const steps = game.steps || '10';
          const traps = game.traps !== undefined ? game.traps : '3';
          const targets = game.targets || '5';
          location.href = `play.html?num=${game.num}&steps=${steps}&traps=${traps}&targets=${targets}&step=${e.target.getAttribute('data-step')}`;
        } else {
          const finalCombo = this.ensureParams(customParams);
          location.href = `play.html?num=${finalCombo}&step=${e.target.getAttribute('data-step')}`;
        }
      }
    });
  }

  handleUnlock(combo, cost, isUnlocked, step) {
    if (isUnlocked) {
      const finalCombo = this.ensureParams(combo);
      location.href = `play.html?step=${step}&num=${finalCombo}`;
      return;
    }

    const currentStars = parseInt(localStorage.getItem('math-game-total-stars') || '0', 10);
    if (currentStars >= cost) {
      const newTotal = currentStars - cost;
      localStorage.setItem('math-game-total-stars', newTotal);
      
      // Posodobi korak za trenutno igro
      const type = localStorage.getItem('math-game-type') || 'sum';
      const key = `math-game-step-${type}`;
      localStorage.setItem(key, step);

      const finalCombo = this.ensureParams(combo);
      location.href = `play.html?step=${step}&num=${finalCombo}`;
    }
  }

  ensureParams(combo) {
    let finalCombo = combo;
    if (!finalCombo.includes('st')) finalCombo += 'st4';
    if (!finalCombo.includes('tr')) finalCombo += 'tr10';
    if (!finalCombo.includes('go')) finalCombo += 'go5';
    return finalCombo;
  }

  render() {
    const totalStars = localStorage.getItem('math-game-total-stars') || '0';
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
        <div class="stars-badge"><span>${totalStars}</span> ★</div>
      </header>
      <div class="groups"></div>
    `;
  }
}

customElements.define('unlock-page', UnlockPage);
export default UnlockPage;
