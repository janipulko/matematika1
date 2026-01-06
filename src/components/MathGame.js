
import './TargetDisplay.js';
import './ScoreGrid.js';
import './StepIndicator.js';
import './ControlsBar.js';
import './SettingsModal.js';
import './ResultModal.js';

// ============================================
// Pomagala: URL parsing, BFS, zvok, random
// ============================================

function parseNumsFromURL() {
  const params = new URLSearchParams(location.search);
  const raw = params.get('num');
  if (!raw) return null;

  // regex najde pare (crka)(stevilka)
  const regex = /([pmts])(\d+)/g;
  const nums = [];
  let match;
  while ((match = regex.exec(raw)) !== null) {
    const op = match[1];
    const value = parseInt(match[2], 10);
    if (isNaN(value) || value === 0) continue;
    
    // Preprečimo dvojnike (ista operacija in vrednost)
    if (nums.some(n => n.op === op && n.val === value)) continue;
    
    nums.push({ op, val: value });
    if (nums.length >= 5) break; // Povečano na 5 gumbov, če je treba
  }

  if (nums.length < 2) return null;
  return nums;
}

import { sound } from '../utils/soundManager.js';

function ensureNumsInURL() {
  const nums = parseNumsFromURL();
  if (!nums) {
    const params = new URLSearchParams(location.search);
    params.set('num', 'p1p5p10');
    const newURL = `${location.pathname}?${params.toString()}${location.hash}`;
    location.assign(newURL);
    return null;
  }
  return nums;
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

  connectedCallback() {
    if (this.initialized) return;

    const parsed = ensureNumsInURL();
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
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: flex;
          flex-direction: column;
          background: var(--card);
          border-radius: var(--radius);
          box-shadow: var(--shadow);
          padding: clamp(12px, 2vh, 24px);
          flex: 1;
          overflow: hidden;
          min-height: 0;
          position: relative;
          gap: clamp(8px, 1.5vh, 16px);
        }
        .settings-trigger, .reset-trigger {
          position: absolute;
          top: clamp(8px, 1.5vh, 16px);
          background: #f0f4f8;
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
          opacity: 0.7;
          z-index: 10;
        }
        .settings-trigger {
          right: 12px;
        }
        .reset-trigger {
          left: 12px;
        }
        .settings-trigger:hover, .reset-trigger:hover {
          background: #e2e8f0;
          opacity: 1;
        }
        .settings-trigger:hover {
          transform: rotate(30deg);
        }
        .reset-trigger:hover {
          transform: rotate(-90deg);
        }
      </style>
      <target-display></target-display>
      <score-grid></score-grid>
      <step-indicator></step-indicator>
      <controls-bar></controls-bar>
      <button class="settings-trigger" title="Nastavitve">⚙️</button>
      <button class="reset-trigger" title="Ponastavi">↺</button>
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

  onConfirm() {
    const stars = this.stepsEl.getStarsLeft(this.clicks, this.minSteps);
    const resultModal = document.createElement('result-modal');
    this.shadowRoot.appendChild(resultModal);
    
    if (this.sum === this.target) {
      this.sound.victory(stars);
      resultModal.show(true, stars);
    } else {
      this.sound.nope();
      resultModal.show(false);
    }
  }
}

customElements.define('math-game', MathGame);
export default MathGame;
