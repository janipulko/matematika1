
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
      const step = e.target.getAttribute('data-step');
      this.handleUnlock(e.detail.combo, e.detail.cost, e.detail.isUnlocked, parseInt(step, 10));
    });
  }

  handleUnlock(combo, cost, isUnlocked, step) {
    if (isUnlocked) {
      location.href = `play.html?step=${step}&num=${combo}`;
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

      location.href = `play.html?step=${step}&num=${combo}`;
    }
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
          justify-content: center;
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
        <div class="stars-badge">Moje zvezdice: <span>${totalStars}</span> ★</div>
      </header>
      <div class="groups"></div>
    `;
  }
}

customElements.define('unlock-page', UnlockPage);
export default UnlockPage;
