
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
  // Regex zdaj išče tudi x parameter za korake
  const regex = /([pmtsx])(\d+)/g;
  let match;
  let maxStepsOverride = null;

  while ((match = regex.exec(raw)) !== null) {
    const op = match[1];
    const value = parseInt(match[2], 10);
    if (isNaN(value)) continue;

    if (op === 'x') {
      maxStepsOverride = value;
      continue;
    }

    if (value === 0) continue;
    if (nums.some(n => n.op === op && n.val === value)) continue;
    nums.push({ op, val: value });
    if (nums.length >= 5) break;
  }

  if (nums.length < 1) return null;
  return { nums, maxStepsOverride };
}

function getGameDataPath() {
  const type = localStorage.getItem('math-game-type') || 'sum';
  return type === 'groups' ? 'data/groups.json' : 'data/sum.json';
}

function getStepKey() {
  const type = localStorage.getItem('math-game-type') || 'sum';
  return `math-game-step-${type}`;
}

async function getNumsForStep(stepIndex) {
  try {
    const response = await fetch(getGameDataPath());
    const groups = await response.json();
    let count = 0;
    for (const group of groups) {
      if (stepIndex < count + group.combos.length) {
        return group.combos[stepIndex - count];
      }
      count += group.combos.length;
    }
  } catch (e) {
    console.error("Napaka pri nalaganju podatkov:", e);
  }
  return 'p10p5p1'; // Fallback
}

async function findStepForCombo(combo) {
  try {
    const response = await fetch(getGameDataPath());
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
      const savedStep = parseInt(localStorage.getItem(getStepKey()) || '0', 10);
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

function pickTargetSequence(nums, minK, maxK) {
  // 1. Določimo število ciljev na podlagi nastavitev
  const maxTargetsSetting = parseInt(localStorage.getItem('math-game-max-targets') || '3', 10);
  const minCount = Math.ceil(maxTargetsSetting * 0.6);
  const count = Math.floor(Math.random() * (maxTargetsSetting - minCount + 1)) + minCount;
  
  const targets = [];
  let currentStart = 0;
  
  // Za vsak cilj posebej izračunamo dostopnost iz prejšnje točke
  for (let i = 0; i < count; i++) {
    const dist = bfsFrom(currentStart, nums);
    const candidates = [];
    for (let t = 1; t <= 100; t++) {
      // Razdalja med posameznimi cilji naj bo razumna
      const stepDist = dist[t];
      if (stepDist >= 2 && stepDist <= maxK && !targets.includes(t)) {
        candidates.push(t);
      }
    }
    
    if (candidates.length === 0) break; // Ne moremo dodati več ciljev
    const chosen = candidates[Math.floor(Math.random() * candidates.length)];
    targets.push(chosen);
    currentStart = chosen;
  }
  
  if (targets.length === 0) return null;
  
  // Pomešamo cilje, da igralec nima vedno naraščajočega zaporedja
  return targets.sort(() => Math.random() - 0.5);
}

function bfsFrom(startNode, nums, traps = []) {
  const MAX = 100;
  const dist = new Array(MAX + 1).fill(Infinity);
  const q = [];
  dist[startNode] = 0;
  q.push(startNode);
  while (q.length) {
    const u = q.shift();
    for (const step of nums) {
      let v;
      if (step.op === 'p') v = u + step.val;
      else if (step.op === 'm') v = u - step.val;
      else if (step.op === 't') v = u * step.val;
      else if (step.op === 's') {
        if (u % step.val !== 0) continue;
        v = u / step.val;
      }
      if (v < 0 || v > MAX) continue;
      if (traps.includes(v)) continue;
      if (dist[v] !== Infinity) continue;
      dist[v] = dist[u] + 1;
      q.push(v);
    }
  }
  return dist;
}

function calculateOptimalPath(targets, nums, traps = []) {
  // Izračunamo najkrajšo pot, ki obišče vse cilje (permutacije)
  const permutations = getPermutations(targets);
  let minTotalSteps = Infinity;

  for (const p of permutations) {
    let currentSteps = 0;
    let currentPos = 0;
    let possible = true;
    
    for (const target of p) {
      const dists = bfsFrom(currentPos, nums, traps);
      if (dists[target] === Infinity) {
        possible = false;
        break;
      }
      currentSteps += dists[target];
      currentPos = target;
    }
    
    if (possible && currentSteps < minTotalSteps) {
      minTotalSteps = currentSteps;
    }
  }
  
  return minTotalSteps;
}

function getPermutations(arr) {
  if (arr.length <= 1) return [arr];
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    const char = arr[i];
    const remainingChars = arr.slice(0, i).concat(arr.slice(i + 1));
    for (const p of getPermutations(remainingChars)) {
      result.push([char].concat(p));
    }
  }
  return result;
}

function pickTraps(nums, targets, minK, maxK) {
  const traps = [];
  
  // Pridobi nastavljeno maksimalno število pasti (privzeto 10)
  const maxTrapsSetting = parseInt(localStorage.getItem('math-game-max-traps') || '10', 10);
  
  // Število pasti je naključno med 0.7 * max in max
  const minTraps = Math.floor(0.7 * maxTrapsSetting);
  const targetNumTraps = Math.floor(Math.random() * (maxTrapsSetting - minTraps + 1)) + minTraps;
  
  const possibleTraps = [];

  // Najdemo vsa dosegljiva števila (1-100), ki niso cilji
  const reachable = bfsFrom(0, nums);
  for (let i = 1; i <= 100; i++) {
    if (reachable[i] !== Infinity && !targets.includes(i)) {
      possibleTraps.push(i);
    }
  }

  if (possibleTraps.length === 0) return [];

  // Premešamo možne pasti
  possibleTraps.sort(() => Math.random() - 0.5);

  for (const t of possibleTraps) {
    if (traps.length >= targetNumTraps) break;

    // Začasno dodamo past in preverimo rešljivost
    const testTraps = [...traps, t];
    const opt = calculateOptimalPath(targets, nums, testTraps);

    // Če je igra še vedno rešljiva in pot ni preveč ekstremno dolga (npr. > 30 korakov)
    // lahko past obdržimo. 
    if (opt !== Infinity && opt < 40) {
      traps.push(t);
    }
  }

  return traps;
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
    this.nums = parsed.nums;
    this.maxStepsOverride = parsed.maxStepsOverride;

    // Naloži nastavitev za korake
    const settingsMaxSteps = parseInt(localStorage.getItem('math-game-max-steps') || '10', 10);
    const maxK = this.maxStepsOverride !== null ? this.maxStepsOverride : settingsMaxSteps;
    const minK = Math.max(2, Math.ceil(maxK / 2));

    this.targets = pickTargetSequence(this.nums, minK, maxK);
    if (!this.targets) {
      const urlHint = this.nums.map(n => n.op + n.val).join('');
      this.shadowRoot.innerHTML = `<p>Konfiguracija <code>?num=${urlHint}</code> ne omogoča doseči nobenega cilja v [0..100]. Spremeni parametre.</p>`;
      return;
    }

    this.traps = pickTraps(this.nums, this.targets, minK, maxK);
    this.achievedTargets = [];
    this.minSteps = calculateOptimalPath(this.targets, this.nums, this.traps);
    
    // Če BFS ne najde poti (teoretično ne bi smelo priti do tega, a za varnost)
    if (this.minSteps === Infinity) {
        this.traps = [];
        this.minSteps = calculateOptimalPath(this.targets, this.nums, []);
    }

    this.sum = 0;
    this.clicks = 0;
    this.sound = sound;
    
    // Naloži nastavitve iz localStorage ali določi privzete
    const savedActive = localStorage.getItem('math-game-show-active');
    const maxTraps = parseInt(localStorage.getItem('math-game-max-traps') || '10', 10);
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
    this.addEventListener('change-game-type', () => {
      // Ob spremembi igre preprosto osvežimo stran brez parametrov, 
      // da ensureNumsInURL prebere nov tip in pravilni step
      location.href = location.pathname;
    });

    this.addEventListener('change-max-steps', () => {
      // Takojšnja ponastavitev igre ob spremembi težavnosti
      location.reload();
    });

    this.addEventListener('change-max-traps', () => {
      // Takojšnja ponastavitev igre ob spremembi števila pasti
      location.reload();
    });

    this.addEventListener('change-max-targets', () => {
      // Takojšnja ponastavitev igre ob spremembi števila ciljev
      location.reload();
    });

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
      this.currentStepIndex++;
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
      </div>
    `;

    this.targetEl = this.shadowRoot.querySelector('target-display');
    this.gridEl = this.shadowRoot.querySelector('score-grid');
    this.stepsEl = this.shadowRoot.querySelector('step-indicator');
    this.ctrlEl = this.shadowRoot.querySelector('controls-bar');
    this.settingsTrigger = { click: () => {
      const modal = document.createElement('settings-modal');
      modal.setSound(this.sound.enabled);
      modal.setActiveIndicator(this.showActiveIndicator);
      this.shadowRoot.appendChild(modal);
      modal.setMaxSteps(parseInt(localStorage.getItem('math-game-max-steps') || '10', 10));
      modal.setMaxTraps(parseInt(localStorage.getItem('math-game-max-traps') || '10', 10));
      modal.setMaxTargets(parseInt(localStorage.getItem('math-game-max-targets') || '3', 10));
      modal.show();
    }};
    this.resetTrigger = { onclick: null }; 

    this.targetEl.setTargets(this.targets, this.achievedTargets);
    this.gridEl.setValue(this.sum);
    this.gridEl.setTraps(this.traps);
    this.stepsEl.setSteps(this.minSteps, this.targets.length);
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

    let nextSum = this.sum;
    if (step.op === 'p') nextSum += step.val;
    else if (step.op === 'm') nextSum -= step.val;
    else if (step.op === 't') nextSum *= step.val;
    else if (step.op === 's') nextSum /= step.val;

    // PREVERJANJE PASTI
    if (this.traps.includes(nextSum)) {
      this.clicks += 1; // Kazen
      this.gridEl.flash();
      this.stepsEl.update(this.clicks, this.minSteps);
      this.sound.nope();
      return; // Ne posodobimo this.sum
    }

    this.sum = nextSum;
    this.clicks += 1;
    this.gridEl.setValue(this.sum);
    this.stepsEl.update(this.clicks, this.minSteps);
    this.sound.click();

    // Preveri, če smo dosegli kakšen cilj
    this.targets.forEach((t, i) => {
      if (this.sum === t && !this.achievedTargets.includes(i)) {
        this.achievedTargets.push(i);
        this.targetEl.setTargets(this.targets, this.achievedTargets);
        this.sound.victory(1); // Manjši zmagovalni zvok za vmesni cilj
        
        // Če so vsi cilji doseženi, avtomatsko odpri modal po kratkem premoru
        if (this.achievedTargets.length === this.targets.length) {
          setTimeout(() => this.onConfirm(), 500);
        }
      }
    });
  }

  onReset() {
    this.sum = 0;
    this.clicks = 0;
    this.achievedTargets = [];
    this.gridEl.setValue(this.sum);
    this.targetEl.setTargets(this.targets, this.achievedTargets);
    this.stepsEl.update(this.clicks, this.minSteps);
    this.sound.click();
  }

  async onConfirm() {
    if (this.achievedTargets.length < this.targets.length) {
      this.sound.nope();
      return;
    }

    const stars = this.stepsEl.getStarsLeft(this.clicks, this.minSteps);
    const resultModal = document.createElement('result-modal');
    this.shadowRoot.appendChild(resultModal);
    
    this.sound.victory(stars);
    await resultModal.show(true, stars);
  }
}

customElements.define('math-game', MathGame);
export default MathGame;
