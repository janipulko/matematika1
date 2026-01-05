
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
  const parts = raw.split(',').map(s => s.trim()).filter(Boolean);
  const nums = [];
  const seen = new Set();
  for (const p of parts) {
    const v = Number(p);
    if (!Number.isFinite(v)) continue;
    if (v === 0) continue;
    if (seen.has(v)) continue;
    seen.add(v);
    nums.push(v);
    if (nums.length >= 4) break;
  }
  if (nums.length < 2) return null;
  return nums;
}

import { sound } from '../utils/soundManager.js';

function ensureNumsInURL() {
  const nums = parseNumsFromURL();
  if (!nums) {
    const params = new URLSearchParams(location.search);
    params.set('num', '1,5,10');
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
      const v = u + step;
      if (v < 0 || v > MAX) continue;
      if (dist[v] !== Infinity) continue;
      dist[v] = dist[u] + 1;
      q.push(v);
    }
  }
  return dist;
}

function pickRandomTarget(dist, minK = 4, maxK = 7) {
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
    this.target = pickRandomTarget(this.dist, 4, 7);
    if (this.target === null) {
      this.shadowRoot.innerHTML = `<p>Konfiguracija <code>?num=${encodeURIComponent(this.nums.join(','))}</code> ne omogoča doseči nobenega cilja v [0..100]. Spremeni parametre.</p>`;
      return;
    }
    this.minSteps = this.dist[this.target];

    this.sum = 0;
    this.clicks = 0;
    this.sound = sound;
    this.showActiveIndicator = true;

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
      this.sound.enabled = enabled;
      if (enabled) this.sound.click();
    });
    this.shadowRoot.addEventListener('toggle-active-indicator', (e) => {
      this.showActiveIndicator = e.detail?.enabled ?? true;
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
          padding: 16px;
          flex: 1;
          overflow: hidden;
          min-height: 0;
          position: relative;
        }
        .settings-trigger, .reset-trigger {
          position: absolute;
          top: 12px;
          background: #f0f4f8;
          border: none;
          border-radius: var(--radius-sm);
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 18px;
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

  canApply(delta) {
    const v = this.sum + delta;
    return v >= 0 && v <= 100;
  }

  onAdd(delta) {
    if (!this.canApply(delta)) {
      this.gridEl.flash();
      this.ctrlEl.flashAny();
      this.sound.nope();
      return;
    }
    this.sum += delta;
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
      this.sound.ok();
      resultModal.show(true, stars);
    } else {
      this.sound.nope();
      resultModal.show(false);
    }
  }
}

customElements.define('math-game', MathGame);
export default MathGame;
