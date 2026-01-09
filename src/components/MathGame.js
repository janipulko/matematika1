
import './TargetDisplay.js';
import './ScoreGrid.js';
import './StepIndicator.js';
import './ControlsBar.js';
import './SettingsModal.js';
import './ColorSettingsModal.js';
import './ResultModal.js';
import { sound } from '../utils/soundManager.js';

// ============================================
// Pomagala: URL parsing, BFS, zvok, random
// ============================================

function parseNumsFromURL() {
  const params = new URLSearchParams(location.search);
  const raw = params.get('num');
  if (!raw) return null;

  const nums = [];
  const regex = /([pmts])(\d+)/g;
  let match;
  while ((match = regex.exec(raw)) !== null) {
    const op = match[1];
    const value = parseInt(match[2], 10);
    if (isNaN(value) || value === 0) continue;
    if (nums.some(n => n.op === op && n.val === value)) continue;
    nums.push({ op, val: value });
    if (nums.length >= 5) break;
  }

  if (nums.length < 1) return null;
  return nums;
}

async function getNumsForStep(stepIndex) {
  try {
    const response = await fetch('data/groups.json');
    const groups = await response.json();
    let count = 0;
    for (const group of groups) {
      if (stepIndex < count + group.combos.length) {
        return group.combos[stepIndex - count];
      }
      count += group.combos.length;
    }
  } catch (e) {
    console.error("Napaka pri nalaganju skupin:", e);
  }
  return 'p10p5p1'; // Fallback
}

async function findStepForCombo(combo) {
  try {
    const response = await fetch('data/groups.json');
    const groups = await response.json();
    let stepCounter = 0;
    for (const group of groups) {
      const idx = group.combos.indexOf(combo);
      if (idx !== -1) {
        return stepCounter + idx;
      }
      stepCounter += group.combos.length;
    }
  } catch (e) {
    console.error("Napaka pri iskanju koraka za combo:", e);
  }
  return null;
}

async function ensureNumsInURL() {
  const params = new URLSearchParams(location.search);
  let raw = params.get('num');
  let step = params.get('step');

  // 1. Če ni ničesar, preusmeri na shranjen korak
  if (!raw && !step) {
    const savedStep = parseInt(localStorage.getItem('math-game-step') || '0', 10);
    const combo = await getNumsForStep(savedStep);
    params.set('step', savedStep);
    params.set('num', combo);
    location.assign(`${location.pathname}?${params.toString()}`);
    return null;
  }

  // 2. Če je samo step, pridobi num
  if (step && !raw) {
    const combo = await getNumsForStep(parseInt(step, 10));
    params.set('num', combo);
    location.assign(`${location.pathname}?${params.toString()}`);
    return null;
  }

  // 3. Če je samo num, poskusi najti ustrezen step
  if (raw && !step) {
    const foundStep = await findStepForCombo(raw);
    if (foundStep !== null) {
      params.set('step', foundStep);
      location.assign(`${location.pathname}?${params.toString()}`);
      return null;
    }
    // Če koraka ne najdemo (custom combo), vsaj dodamo step=0 ali pustimo,
    // ampak za boljšo logiko bomo dodali vsaj step parameter če ga ni.
    params.set('step', '0');
    location.assign(`${location.pathname}?${params.toString()}`);
    return null;
  }

  return parseNumsFromURL();
}

function bfsMinClicks(nums) {
  const MAX = 100;
  const dist = new Array(MAX + 1).fill(Infinity);
  const q = [];
  dist[0] = 0;
  q.push(0);
  while (q.length) {
    const u = q.shift();
    for (const step of nums) {
      let v;
      if (step.op === 'p') v = u + step.val;
      else if (step.op === 'm') v = u - step.val;
      else if (step.op === 't') v = u * step.val;
      else if (step.op === 's') {
        if (u % step.val !== 0) continue; // Le celoštevilsko deljenje brez ostanka
        v = u / step.val;
      }

      if (v < 0 || v > MAX) continue;
      if (dist[v] !== Infinity) continue;
      dist[v] = dist[u] + 1;
      q.push(v);
    }
  }
  return dist;
}

function pickRandomTarget(dist, minK = 4, maxK = 10) {
  const candidates = [];
  for (let t = 1; t <= 100; t++) {
    if (dist[t] >= minK && dist[t] <= maxK) candidates.push(t);
  }
  if (candidates.length > 0) {
    return candidates[Math.floor(Math.random() * candidates.length)];
  }
  const fallbackMin = [];
  const fallbackAny = [];
  for (let t = 1; t <= 100; t++) {
    if (Number.isFinite(dist[t])) {
      fallbackAny.push(t);
      if (dist[t] >= minK) fallbackMin.push(t);
    }
  }
  if (fallbackMin.length) {
    return fallbackMin[Math.floor(Math.random() * fallbackMin.length)];
  }
  if (fallbackAny.length) {
    return fallbackAny[Math.floor(Math.random() * fallbackAny.length)];
  }
  return null;
}

class MathGame extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  async connectedCallback() {
    if (this.initialized) return;

    // Pridobimo korak iz URL-ja
    const params = new URLSearchParams(location.search);
    const stepInUrl = params.get('step');
    if (stepInUrl !== null) {
        // Če je v URL-ju, ga shranimo kot trenutni (če je večji od shranjenega)
        // Ali pa samo sledimo navodilu, da je to trenutna igra.
        // Za zdaj samo nastavimo lastnost.
        this.currentStepIndex = parseInt(stepInUrl, 10);
    }

    const parsed = await ensureNumsInURL();
    if (!parsed) return;
    this.nums = parsed;

    this.dist = bfsMinClicks(this.nums);
    this.target = pickRandomTarget(this.dist, 3, 10);
    if (this.target === null) {
      const urlHint = this.nums.map(n => n.op + n.val).join('');
      this.shadowRoot.innerHTML = `<p>Konfiguracija <code>?num=${urlHint}</code> ne omogoča doseči nobenega cilja v [0..100]. Spremeni parametre.</p>`;
      return;
    }
    this.minSteps = this.dist[this.target];

    this.sum = 0;
    this.clicks = 0;
    this.sound = sound;
    
    // Naloži nastavitve iz localStorage ali določi privzete
    const savedActive = localStorage.getItem('math-game-show-active');
    if (savedActive !== null) {
      this.showActiveIndicator = savedActive === 'true';
    } else {
      const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);
      this.showActiveIndicator = !isTouch;
    }

    this.render();
    this._attachEventListeners();
    this.initialized = true;
  }

  _attachEventListeners() {
    this.settingsTrigger.onclick = () => {
      const modal = document.createElement('settings-modal');
      modal.setSound(this.sound.enabled);
      modal.setActiveIndicator(this.showActiveIndicator);
      this.shadowRoot.appendChild(modal);
      modal.show();
    };
    this.resetTrigger.onclick = () => this.onReset();

    this.shadowRoot.addEventListener('add', (e) => this.onAdd(e.detail.value));
    this.shadowRoot.addEventListener('confirm', () => this.onConfirm());
    this.shadowRoot.addEventListener('toggle-sound', (e) => {
      const enabled = e.detail?.enabled ?? true;
      this.sound.setEnabled(enabled);
      if (enabled) this.sound.click();
    });
    this.shadowRoot.addEventListener('toggle-active-indicator', (e) => {
      const enabled = e.detail?.enabled ?? true;
      this.showActiveIndicator = enabled;
      localStorage.setItem('math-game-show-active', enabled);
      this.ctrlEl.setShowActive(this.showActiveIndicator);
    });

    this.shadowRoot.addEventListener('open-color-settings', () => {
      const modal = document.createElement('color-settings-modal');
      this.shadowRoot.appendChild(modal);
      modal.show();
    });

    this.shadowRoot.addEventListener('next-level', () => {
      location.reload();
    });
    this.shadowRoot.addEventListener('reset-game', () => {
      this.onReset();
    });
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          height: 100%;
          width: 100%;
          box-sizing: border-box;
        }
        .container {
          display: flex;
          flex-direction: column;
          background: var(--card);
          border-radius: var(--radius);
          box-shadow: var(--shadow);
          padding: clamp(10px, 2vh, 20px);
          height: 100%;
          box-sizing: border-box;
          position: relative;
          gap: clamp(8px, 1.5vh, 16px);
          overflow: hidden;
          border: 1px solid var(--bubble);
        }
        .section {
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .section-target { flex: 0 0 auto; }
        .section-grid { 
          flex: 1; 
          min-height: 0;
          overflow: hidden;
        }
        .section-steps { flex: 0 0 auto; }
        .section-controls { flex: 0 0 auto; }

        .settings-trigger, .reset-trigger {
          position: absolute;
          top: clamp(8px, 1.5vh, 16px);
          background: var(--bubble);
          border: none;
          border-radius: var(--radius-sm);
          width: clamp(32px, 5vh, 42px);
          height: clamp(32px, 5vh, 42px);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: clamp(16px, 2.5vh, 20px);
          color: var(--muted);
          transition: all 0.2s;
          opacity: 0.8;
          z-index: 10;
        }
        .settings-trigger {
          right: 12px;
        }
        .reset-trigger {
          left: 12px;
        }
        .settings-trigger:hover, .reset-trigger:hover {
          background: var(--primary);
          color: var(--on-primary, white);
          opacity: 1;
        }
        .settings-trigger:hover {
          transform: rotate(30deg);
        }
        .reset-trigger:hover {
          transform: rotate(-90deg);
        }
      </style>
      <div class="container">
        <div class="section section-target">
          <target-display></target-display>
        </div>
        <div class="section section-grid">
          <score-grid></score-grid>
        </div>
        <div class="section section-steps">
          <step-indicator></step-indicator>
        </div>
        <div class="section section-controls">
          <controls-bar></controls-bar>
        </div>
        <button class="settings-trigger" title="Nastavitve">⚙️</button>
        <button class="reset-trigger" title="Ponastavi">↺</button>
      </div>
    `;

    this.targetEl = this.shadowRoot.querySelector('target-display');
    this.gridEl = this.shadowRoot.querySelector('score-grid');
    this.stepsEl = this.shadowRoot.querySelector('step-indicator');
    this.ctrlEl = this.shadowRoot.querySelector('controls-bar');
    this.settingsTrigger = this.shadowRoot.querySelector('.settings-trigger');
    this.resetTrigger = this.shadowRoot.querySelector('.reset-trigger');

    this.targetEl.setValue(this.target);
    this.gridEl.setValue(this.sum);
    this.stepsEl.setSteps(this.minSteps);
    this.stepsEl.update(this.clicks, this.minSteps);
    this.ctrlEl.setNums(this.nums);
    this.ctrlEl.setShowActive(this.showActiveIndicator);
  }

  canApply(step) {
    let v;
    if (step.op === 'p') v = this.sum + step.val;
    else if (step.op === 'm') v = this.sum - step.val;
    else if (step.op === 't') v = this.sum * step.val;
    else if (step.op === 's') {
      if (this.sum % step.val !== 0) return false;
      v = this.sum / step.val;
    }
    return v >= 0 && v <= 100;
  }

  onAdd(step) {
    if (!this.canApply(step)) {
      this.gridEl.flash();
      this.ctrlEl.flashAny();
      this.sound.nope();
      return;
    }

    if (step.op === 'p') this.sum += step.val;
    else if (step.op === 'm') this.sum -= step.val;
    else if (step.op === 't') this.sum *= step.val;
    else if (step.op === 's') this.sum /= step.val;

    this.clicks += 1;
    this.gridEl.setValue(this.sum);
    this.stepsEl.update(this.clicks, this.minSteps);
    this.sound.click();
  }

  onReset() {
    this.sum = 0;
    this.clicks = 0;
    this.gridEl.setValue(this.sum);
    this.stepsEl.update(this.clicks, this.minSteps);
    this.sound.click();
  }

  async onConfirm() {
    const stars = this.stepsEl.getStarsLeft(this.clicks, this.minSteps);
    const resultModal = document.createElement('result-modal');
    this.shadowRoot.appendChild(resultModal);
    
    if (this.sum === this.target) {
      this.sound.victory(stars);
      await resultModal.show(true, stars);
    } else {
      this.sound.nope();
      await resultModal.show(false);
    }
  }
}

customElements.define('math-game', MathGame);
export default MathGame;
