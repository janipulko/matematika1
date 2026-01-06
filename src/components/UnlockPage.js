
import './ComboButton.js';

class UnlockPage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.initUnlocked();
    this.generateGroups();
  }

  initUnlocked() {
    const key = 'math-game-unlocked-combos';
    const stored = localStorage.getItem(key);
    if (stored) {
      this.unlockedCombos = JSON.parse(stored);
    } else {
      this.unlockedCombos = ['p1p5p10'];
      localStorage.setItem(key, JSON.stringify(this.unlockedCombos));
    }
  }

  generateGroups() {
    const groupsContainer = this.shadowRoot.querySelector('.groups');
    
    const groupDefinitions = [
      {
        title: "Moje kombinacije",
        description: "Tukaj so kombinacije, ki si jih že odklenil!",
        isMyGroup: true,
        generator: () => this.unlockedCombos
      },
      {
        title: "1. Skupina: Veseli plusi (+)",
        description: "Samo seštevanje, desetka je vedno z nami!",
        generator: () => this.generateGroup1()
      },
      {
        title: "2. Skupina: Plus in minus z 10",
        description: "Mešane operacije, a pazi na odštevanje!",
        generator: () => this.generateGroup2()
      },
      {
        title: "3. Skupina: Brez desetke, s peticami",
        description: "Večja števila, ki se končajo na 5.",
        generator: () => this.generateGroup3()
      },
      {
        title: "4. Skupina: Divja naključna števila",
        description: "Brez okroglih števil, pravi izziv!",
        generator: () => this.generateGroup4()
      }
    ];

    groupDefinitions.forEach(def => {
      const section = document.createElement('section');
      section.innerHTML = `
        <div class="group-header">
          <h2>${def.title}</h2>
          <p>${def.description}</p>
        </div>
        <div class="grid"></div>
      `;
      const grid = section.querySelector('.grid');
      const combos = def.generator();
      combos.forEach(combo => {
        const isAlreadyUnlocked = def.isMyGroup || this.unlockedCombos.includes(combo);
        const btn = document.createElement('combo-button');
        btn.setCombo(combo, 30, isAlreadyUnlocked);
        grid.appendChild(btn);
      });
      groupsContainer.appendChild(section);
    });

    this.shadowRoot.addEventListener('unlock-combo', (e) => {
      this.handleUnlock(e.detail.combo, e.detail.cost, e.detail.isUnlocked);
    });
  }

  handleUnlock(combo, cost, isUnlocked) {
    if (isUnlocked) {
      location.href = `play.html?num=${combo}`;
      return;
    }

    const currentStars = parseInt(localStorage.getItem('math-game-total-stars') || '0', 10);
    if (currentStars >= cost) {
      const newTotal = currentStars - cost;
      localStorage.setItem('math-game-total-stars', newTotal);
      
      // Shrani v odklenjene
      if (!this.unlockedCombos.includes(combo)) {
        this.unlockedCombos.push(combo);
        localStorage.setItem('math-game-unlocked-combos', JSON.stringify(this.unlockedCombos));
      }

      location.href = `play.html?num=${combo}`;
    }
  }

  // --- Generatorji ---

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  generateGroup1() {
    const results = [];
    for (let i = 0; i < 12; i++) {
      const count = this.getRandomInt(3, 4);
      const nums = ['p10'];
      while (nums.length < count) {
        const v = this.getRandomInt(1, 9);
        const code = `p${v}`;
        if (!nums.includes(code)) nums.push(code);
      }
      results.push(this.shuffle(nums).join(''));
    }
    return results;
  }

  generateGroup2() {
    const results = [];
    for (let i = 0; i < 12; i++) {
      const count = this.getRandomInt(3, 4);
      const nums = ['p10'];
      // Vsaj en minus
      nums.push(`m${this.getRandomInt(1, 10)}`);
      while (nums.length < count) {
        const op = Math.random() > 0.5 ? 'p' : 'm';
        const v = this.getRandomInt(1, 10);
        const code = `${op}${v}`;
        if (!nums.includes(code)) nums.push(code);
      }
      results.push(this.shuffle(nums).join(''));
    }
    return results;
  }

  generateGroup3() {
    const results = [];
    const fives = [15, 25, 35, 45, 55];
    for (let i = 0; i < 12; i++) {
      const count = this.getRandomInt(3, 4);
      const maxPos = fives[this.getRandomInt(0, fives.length - 1)];
      const nums = [`p${maxPos}`];
      // Vsaj en minus
      nums.push(`m${this.getRandomInt(1, 20)}`);
      while (nums.length < count) {
        const op = Math.random() > 0.5 ? 'p' : 'm';
        const v = this.getRandomInt(1, 20);
        if (v === 10) continue; 
        const code = `${op}${v}`;
        if (!nums.includes(code)) nums.push(code);
      }
      results.push(this.shuffle(nums).join(''));
    }
    return results;
  }

  generateGroup4() {
    const results = [];
    const noZero = () => {
      let v;
      do { v = this.getRandomInt(2, 29); } while (v % 10 === 0);
      return v;
    };
    for (let i = 0; i < 12; i++) {
      const count = this.getRandomInt(3, 4);
      const nums = [`p${noZero()}`, `m${noZero()}`];
      while (nums.length < count) {
        const op = Math.random() > 0.5 ? 'p' : 'm';
        const v = noZero();
        const code = `${op}${v}`;
        if (!nums.includes(code)) nums.push(code);
      }
      results.push(this.shuffle(nums).join(''));
    }
    return results;
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
          background: white;
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
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          grid-auto-rows: 1fr;
          gap: 20px;
        }
        @media (max-width: 600px) {
          .grid {
            grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          }
        }
      </style>
      <header>
        <a href="play.html" class="logo"><span>🏠</span> Domov</a>
        <div class="stars-badge">Moje zvezdice: <span>${totalStars}</span> ★</div>
      </header>
      <div class="groups"></div>
    `;
  }
}

customElements.define('unlock-page', UnlockPage);
export default UnlockPage;
