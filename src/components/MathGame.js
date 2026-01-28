import './TargetDisplay.js';
import './ScoreGrid.js';
import './StepIndicator.js';
import './ControlsBar.js';
import './SettingsModal.js';
import './ColorSettingsModal.js';
import './ResultModal.js';
import './SessionScore.js';
import {sound} from '../utils/soundManager.js';

// ============================================
// Pomagala: URL parsing, BFS, zvok, random
// ============================================

function parseNumsFromURL() {
  const params = new URLSearchParams(location.search);
  const raw = params.get('num');
  if (!raw) {
    return null;
  }

  const nums = [];
  // Regex za iskanje operacij in parametrov
  // p=plus, m=minus, t=krat, s=deljeno
  // st=koraki, tr=pasti, go=targets (cilji), x=legacy koraki
  const regex = /(st|tr|go|[pmtsx])(\d+)/g;
  let match;
  let maxStepsOverride = null;
  let maxTrapsOverride = null;
  let maxTargetsOverride = null;

  while ((match = regex.exec(raw)) !== null) {
    const op = match[1];
    const value = parseInt(match[2], 10);
    if (isNaN(value)) {
      continue;
    }

    if (op === 'st' || op === 'x') {
      maxStepsOverride = value;
      continue;
    }
    if (op === 'tr') {
      maxTrapsOverride = value;
      continue;
    }
    if (op === 'go') {
      maxTargetsOverride = value;
      continue;
    }

    if (value === 0) {
      continue;
    }
    if (nums.some(n => n.op === op && n.val === value)) {
      continue;
    }
    nums.push({op, val: value});
    if (nums.length >= 5) {
      break;
    }
  }

  if (nums.length < 1) {
    return null;
  }

  // Če parametrov ni v num nizu (st, tr, go), jih preberemo iz URL parametrov
  const paramsSteps = params.get('steps');
  const paramsTraps = params.get('traps');
  const paramsTargets = params.get('targets');

  return {
    nums,
    maxStepsOverride: paramsSteps ? parseInt(paramsSteps, 10) : maxStepsOverride,
    maxTrapsOverride: paramsTraps ? parseInt(paramsTraps, 10) : maxTrapsOverride,
    maxTargetsOverride: paramsTargets ? parseInt(paramsTargets, 10) : maxTargetsOverride
  };
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

  // Če imamo num in nastavitve (iz konfiguratorja), ne potrebujemo stepa
  if (raw && (params.has('steps') || (raw.includes('st') && raw.includes('tr') && raw.includes('go')))) {
    return parseNumsFromURL();
  }

  // 1. Če ni ničesar, preusmeri na shranjen korak
  if (!raw && !step) {
    const savedStep = parseInt(localStorage.getItem(getStepKey()) || '0', 10);
    const combo = await getNumsForStep(savedStep);
    const finalCombo = combo.includes('st') ? combo : `${combo}st4tr10go5`;
    params.set('step', savedStep);
    params.set('num', finalCombo);
    location.assign(`${location.pathname}?${params.toString()}`);
    return null;
  }

  // 2. Če je samo step, pridobi num
  if (step && !raw) {
    const combo = await getNumsForStep(parseInt(step, 10));
    const finalCombo = combo.includes('st') ? combo : `${combo}st4tr10go5`;
    params.set('num', finalCombo);
    location.assign(`${location.pathname}?${params.toString()}`);
    return null;
  }

  // 3. Če je samo num, poskusi najti ustrezen step
  if (raw && !step) {
    const foundStep = await findStepForCombo(raw);
    let finalRaw = raw;
    
    if (foundStep !== null) {
      if (!finalRaw.includes('st')) finalRaw += 'st4tr10go5';
      params.set('step', foundStep);
      params.set('num', finalRaw);
      location.assign(`${location.pathname}?${params.toString()}`);
      return null;
    }
    
    // Če koraka ne najdemo, preverimo konfiguracijo
    if (!finalRaw.includes('st') && !params.has('steps')) {
        // Brez konfiguracije in brez stepa - to je custom igra, ki nima parametrov
        // V tem primeru bomo pustili da gre čez in bo render() pokazal napako
        return parseNumsFromURL();
    }

    params.set('step', '0');
    location.assign(`${location.pathname}?${params.toString()}`);
    return null;
  }

  return parseNumsFromURL();
}

function pickTargetSequence(nums, minK, maxK, startSum = 0, maxTargetsOverride = null) {
  // 1. Določimo število ciljev na podlagi nastavitev
  if (maxTargetsOverride === null) {
    return null; // Zahtevamo eksplicitno nastavitev
  }
  const maxTargetsSetting = maxTargetsOverride;
  const minCount = Math.max(1, Math.ceil(maxTargetsSetting * 0.4));
  const count = Math.floor(Math.random() * (maxTargetsSetting - minCount + 1))
      + minCount;

  const targets = [];
  let currentStart = startSum;

  // Za vsak cilj posebej izračunamo dostopnost iz prejšnje točke
  for (let i = 0; i < count; i++) {
    const dist = bfsFrom(currentStart, nums);
    const candidates = [];

    // Prilagodljiv kriterij: najprej iščemo idealne (razdalja >= 2)
    for (let t = 1; t <= 100; t++) {
      const stepDist = dist[t];
      if (stepDist >= 2 && stepDist <= maxK && !targets.includes(t) && t
          !== startSum) {
        candidates.push(t);
      }
    }

    // Če ni idealnih, dopustimo razdaljo 1 (neposreden skok)
    if (candidates.length === 0) {
      for (let t = 1; t <= 100; t++) {
        const stepDist = dist[t];
        if (stepDist === 1 && !targets.includes(t) && t !== startSum) {
          candidates.push(t);
        }
      }
    }

    // Če še vedno ni kandidatov, poskusimo malce razširiti maxK (+1)
    if (candidates.length === 0) {
      for (let t = 1; t <= 100; t++) {
        const stepDist = dist[t];
        if (stepDist > 1 && stepDist <= (maxK + 1) && !targets.includes(t) && t
            !== startSum) {
          candidates.push(t);
        }
      }
    }

    if (candidates.length === 0) {
      break;
    } // Ne moremo dodati več ciljev
    const chosen = candidates[Math.floor(Math.random() * candidates.length)];
    targets.push(chosen);
    currentStart = chosen;
  }

  if (targets.length === 0) {
    return null;
  }

  // Pomešamo cilje, da igralec nima vedno naraščajočega zaporedja
  return targets.sort(() => Math.random() - 0.5);
}

function pickValidStartSum(nums, minK, maxK) {
  // 1. Izračunamo "težnost" operacij (bias)
  let sumVal = 0;
  let absSumVal = 0;

  for (const n of nums) {
    let v = n.val;
    if (n.op === 'm' || n.op === 's') {
      v = -v;
    }
    // Opomba: množenje 't' obravnavamo kot pozitivno, deljenje 's' kot negativno (približek)
    if (n.op === 't') {
      v = v * 2;
    } // Množenje močno poveča vrednost

    sumVal += v;
    absSumVal += Math.abs(v);
  }

  const bias = absSumVal === 0 ? 0 : sumVal / absSumVal;

  // 2. Določimo osnovni začetek (bias 1 -> 10, bias -1 -> 90)
  // Omejimo bias med -1 in 1 za vsak slučaj
  const clampedBias = Math.max(-1, Math.min(1, bias));
  const startBase = 50 - (clampedBias * 40);

  // 3. Dodamo naključen interval (+/- 15)
  const range = 15;
  const randomOffset = (Math.random() * range * 2) - range;
  let targetStart = Math.round(startBase + randomOffset);

  // Omejimo na [1, 100]
  targetStart = Math.max(1, Math.min(100, targetStart));

    // 4. Preverimo rešljivost iz te točke in okolice
    // Najprej preverimo točno to točko
    const checkReachable = (s) => {
      const dists = bfsFrom(s, nums);
      let reachableCount = 0;
      for (let t = 1; t <= 100; t++) {
        // Zmanjšamo strožost pogoja: razdalja 1 je zdaj dovoljena, maxK pa rahlo povečan
        if (dists[t] >= 1 && dists[t] <= (maxK + 1)) {
          reachableCount++;
        }
      }
      // Zahtevamo vsaj 1 dosegljiv cilj (prej 5) za večjo fleksibilnost pri ročnih konfiguracijah
      return reachableCount >= 1;
    };

  if (checkReachable(targetStart)) {
    return targetStart;
  }

  // Če ni v redu, iščemo v spirali okoli targetStart
  for (let radius = 1; radius <= 20; radius++) {
    for (const s of [targetStart - radius, targetStart + radius]) {
      if (s >= 1 && s <= 100 && checkReachable(s)) {
        return s;
      }
    }
  }

  // Fallback na staro metodo iskanja poljubne veljavne točke, če spirala odpove
  const candidates = [];
  for (let s = 1; s <= 100; s++) {
    if (checkReachable(s)) {
      candidates.push(s);
    }
  }
  if (candidates.length > 0) {
    return candidates[Math.floor(Math.random() * candidates.length)];
  }

  // Zadnji poskus: Katerokoli število, ki omogoča vsaj en cilj
  const emergencyCandidates = [];
  for (let s = 1; s <= 100; s++) {
    const dists = bfsFrom(s, nums);
    if (Object.values(dists).some(d => d > 0 && d !== Infinity)) {
      emergencyCandidates.push(s);
    }
  }
  if (emergencyCandidates.length > 0) {
    return emergencyCandidates[Math.floor(
        Math.random() * emergencyCandidates.length)];
  }

  return 1; // Končni fallback
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
      if (step.op === 'p') {
        v = u + step.val;
      } else if (step.op === 'm') {
        v = u - step.val;
      } else if (step.op === 't') {
        v = u * step.val;
      } else if (step.op === 's') {
        if (u % step.val !== 0) {
          continue;
        }
        v = u / step.val;
      }
      if (v < 0 || v > MAX) {
        continue;
      }
      if (traps.includes(v)) {
        continue;
      }
      if (dist[v] !== Infinity) {
        continue;
      }
      dist[v] = dist[u] + 1;
      q.push(v);
    }
  }
  return dist;
}

function calculateOptimalPath(targets, nums, traps = [], startSum = 0) {
  // Izračunamo najkrajšo pot, ki obišče vse cilje (permutacije)
  const permutations = getPermutations(targets);
  let minTotalSteps = Infinity;

  for (const p of permutations) {
    let currentSteps = 0;
    let currentPos = startSum;
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
  if (arr.length <= 1) {
    return [arr];
  }
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

function pickTraps(nums, targets, minK, maxK, startSum = 0, maxTrapsOverride = null) {
  const traps = [];

  // Pridobi nastavljeno maksimalno število pasti
  if (maxTrapsOverride === null) {
    return []; // Privzeto 0 pasti če ni nastavljeno
  }
  const maxTrapsSetting = maxTrapsOverride;

  if (maxTrapsSetting <= 0) {
    return [];
  }

  // Število pasti je naključno med 0.7 * max in max
  const minTraps = Math.floor(0.7 * maxTrapsSetting);
  const targetNumTraps = Math.floor(
      Math.random() * (maxTrapsSetting - minTraps + 1)) + minTraps;

  const possibleTraps = [];

  // Najdemo vsa dosegljiva števila (1-100), ki niso cilji in ni začetna vrednost
  const reachable = bfsFrom(startSum, nums);
  for (let i = 1; i <= 100; i++) {
    if (reachable[i] !== Infinity && !targets.includes(i) && i !== startSum) {
      possibleTraps.push(i);
    }
  }

  if (possibleTraps.length === 0) {
    return [];
  }

  // Premešamo možne pasti
  possibleTraps.sort(() => Math.random() - 0.5);

  for (const t of possibleTraps) {
    if (traps.length >= targetNumTraps) {
      break;
    }

    // Začasno dodamo past in preverimo rešljivost
    const testTraps = [...traps, t];
    const opt = calculateOptimalPath(targets, nums, testTraps, startSum);

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
    this.attachShadow({mode: 'open'});
    this.sessionStars = 0;
  }

  async connectedCallback() {
    if (this.initialized) {
      return;
    }

    this._attachEventListeners();

    const params = new URLSearchParams(location.search);
    await this.initGame(params);

    this.initialized = true;
  }

  async initGame(params) {
    // Odstranimo morebitni obstoječi result-modal
    const oldModal = this.shadowRoot.querySelector('result-modal');
    if (oldModal) {
      oldModal.remove();
    }

    // Pridobimo korak iz URL-ja
    const stepInUrl = params.get('step');
    if (stepInUrl !== null) {
      this.currentStepIndex = parseInt(stepInUrl, 10);
    }

    const parsed = await ensureNumsInURL();
    if (!parsed) {
      return;
    }

    if (parsed.maxStepsOverride === null || parsed.maxTrapsOverride === null
        || parsed.maxTargetsOverride === null) {
      this.error = 'Igra ni ustrezno konfigurirana. Manjkajo parametri za korake, pasti ali cilje.';
      this.render();
      return;
    }

    this.nums = parsed.nums;
    this.maxStepsOverride = parsed.maxStepsOverride;
    this.maxTrapsOverride = parsed.maxTrapsOverride;
    this.maxTargetsOverride = parsed.maxTargetsOverride;

    const maxK = this.maxStepsOverride;
    const minK = Math.max(1, Math.ceil(maxK / 2));

    this.startSum = pickValidStartSum(this.nums, minK, maxK);
    this.targets = pickTargetSequence(this.nums, minK, maxK, this.startSum,
        this.maxTargetsOverride);

    if (!this.targets) {
      const urlHint = this.nums.map(n => n.op + n.val).join('');
      this.shadowRoot.innerHTML = `<p>Konfiguracija <code>?num=${urlHint}</code> ne omogoča doseči nobenega cilja v [0..100]. Spremeni parametre.</p>`;
      return;
    }

    const maxTraps = this.maxTrapsOverride !== null ? this.maxTrapsOverride
        : parseInt(
            localStorage.getItem('math-game-max-traps') || '10', 10);

    this.traps = pickTraps(this.nums, this.targets, minK, maxK, this.startSum,
        maxTraps);
    this.initialTraps = [...this.traps]; // Shranimo za reset
    this.achievedTargets = [];
    this.minSteps = calculateOptimalPath(this.targets, this.nums, this.traps,
        this.startSum);

    // Če BFS ne najde poti (teoretično ne bi smelo priti do tega, a za varnost)
    if (this.minSteps === Infinity) {
      this.traps = [];
      this.initialTraps = [];
      this.minSteps = calculateOptimalPath(this.targets, this.nums, [],
          this.startSum);
    }

    this.sum = this.startSum;
    this.clicks = 0;
    this.sound = sound;

    // Naloži nastavitve iz localStorage ali določi privzete
    const savedActive = localStorage.getItem('math-game-show-active');

    // Počistimo stare ključe, ki niso več v uporabi
    localStorage.removeItem('math-game-max-steps');
    localStorage.removeItem('math-game-max-traps');
    localStorage.removeItem('math-game-max-targets');
    if (savedActive !== null) {
      this.showActiveIndicator = savedActive === 'true';
    } else {
      const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints
          > 0) || (navigator.msMaxTouchPoints > 0);
      this.showActiveIndicator = !isTouch;
    }

    this.render();
  }

  _attachEventListeners() {
    this.addEventListener('change-game-type', () => {
      // Ob spremembi igre preprosto osvežimo stran brez parametrov, 
      // da ensureNumsInURL prebere nov tip in pravilni step
      location.href = location.pathname;
    });

    this.addEventListener('stars-earned', (e) => {
      this.sessionStars += e.detail.stars;
      const scoreEl = document.querySelector('session-score');
      if (scoreEl) {
        scoreEl.setAttribute('value', this.sessionStars);
        scoreEl.bump();
      }
    });

    this.addEventListener('settings-changed', () => {
      // Ponastavitev igre ob spremembi drsnikov v nastavitvah (ko se modal zapre)
      location.reload();
    });

    this.shadowRoot.addEventListener('add', (e) => this.onAdd(e.detail.value));
    this.shadowRoot.addEventListener('confirm', () => this.onConfirm());
    this.shadowRoot.addEventListener('toggle-sound', (e) => {
      const enabled = e.detail?.enabled ?? true;
      this.sound.setEnabled(enabled);
      if (enabled) {
        this.sound.click();
      }
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

    this.shadowRoot.addEventListener('next-level', (e) => {
      const params = new URLSearchParams(location.search);
      const stepInUrl = params.get('step');

      // Če nam dogodek poda konkretne parametre, jih uporabimo
      if (e.detail && e.detail.step !== undefined) {
        params.set('step', e.detail.step);
        if (e.detail.num) {
          params.set('num', e.detail.num);
        } else {
          params.delete('num');
        }
        const newUrl = `${location.pathname}?${params.toString()}`;
        history.pushState({}, '', newUrl);
        this.initGame(params);
        return;
      }

      if (stepInUrl !== null) {
        const nextStep = parseInt(stepInUrl, 10) + 1;
        params.set('step', nextStep);
        // Odstranimo num, da se bo v ensureNumsInURL naložil nov combo za ta step
        params.delete('num');

        const newUrl = `${location.pathname}?${params.toString()}`;
        history.pushState({}, '', newUrl);
        this.initGame(params);
        return;
      }
      location.reload();
    });
    this.shadowRoot.addEventListener('replay-game', () => {
      const params = new URLSearchParams(location.search);
      this.initGame(params);
    });
    this.shadowRoot.addEventListener('reset-game', () => {
      this.onReset();
    });

    this.shadowRoot.addEventListener('trap-triggered', (e) => {
      const index = e.detail.index;
      this.traps = this.traps.filter(t => t !== index);
      // Preverimo, če je mačka stopila na past (in ne le čez njo)
      // V naši trenutni logiki se trap-triggered sproži le za celico kjer mačka 
      // dejansko je v tistem mikro-koraku animacije. 
      // Če je končni rezultat (this.sum) enak indexu pasti, potem je mačka stopila na past.
      if (this.sum === index) {
         this.sound.nope();
         const resultModal = document.createElement('result-modal');
         this.shadowRoot.appendChild(resultModal);
         resultModal.show(false);
      }
    });
  }

  render() {
    if (this.error) {
      this.shadowRoot.innerHTML = `
        <style>
          .error-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
            background: var(--bg);
            color: var(--neg-ink);
            padding: 20px;
            text-align: center;
          }
          h2 { color: var(--neg-bg); }
          .btn-home {
             padding: 10px 20px;
             background: var(--primary);
             color: white;
             border-radius: var(--radius-sm);
             text-decoration: none;
             margin-top: 20px;
          }
        </style>
        <div class="error-container">
          <h2>⚠️ Napaka</h2>
          <p>${this.error}</p>
          <a href="type.html" class="btn-home">Nazaj na izbiro</a>
        </div>
      `;
      return;
    }

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

          background: linear-gradient(
              135deg,
              color-mix(in oklab, var(--card), var(--bubble) 12%) 0%,
              color-mix(in oklab, var(--card), var(--bg) 10%) 50%,
              color-mix(in oklab, var(--card), var(--accent) 8%) 100%
          );

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

        .section-target {
          flex: 0 0 auto;
        }

        .section-grid {
          flex: 1;
          min-height: 0;
          overflow: hidden;
        }

        .section-steps {
          flex: 0 0 auto;
        }

        .section-controls {
          flex: 0 0 auto;
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
      </div>
    `;

    this.targetEl = this.shadowRoot.querySelector('target-display');
    this.gridEl = this.shadowRoot.querySelector('score-grid');
    this.stepsEl = this.shadowRoot.querySelector('step-indicator');
    this.ctrlEl = this.shadowRoot.querySelector('controls-bar');
    
    // Nastavimo cilje PREDEN bi setValue lahko karkoli izrisal
    this.targetEl.setTargets(this.targets, this.achievedTargets);
    this.settingsTrigger = {
      click: () => {
        const modal = document.createElement('settings-modal');
        modal.setSound(this.sound.enabled);
        modal.setActiveIndicator(this.showActiveIndicator);
        this.shadowRoot.appendChild(modal);
        modal.show();
      }
    };
    this.resetTrigger = {onclick: null};

    this.gridEl.setValue(this.sum, false);
    this.gridEl.setTraps(this.traps);
    this.stepsEl.setSteps(this.minSteps, this.targets.length);
    this.stepsEl.update(this.clicks, this.minSteps);
    this.ctrlEl.setNums(this.nums);
    this.ctrlEl.setShowActive(this.showActiveIndicator);
  }


  onAdd(step) {
    let nextSum = this.sum;
    const oldSum = this.sum;
    let isValid = true;

    if (step.op === 'p') {
      nextSum += step.val;
    } else if (step.op === 'm') {
      nextSum -= step.val;
    } else if (step.op === 't') {
      nextSum *= step.val;
    } else if (step.op === 's') {
      if (this.sum % step.val !== 0) {
        isValid = false;
        // Za izračun vizualne napake (če bi hoteli prikazati ne-celo število, 
        // a raje samo končamo igro)
        nextSum = this.sum / step.val; 
      } else {
        nextSum /= step.val;
      }
    }

    // Preverjanje meja in celosti
    if (!isValid || nextSum < 0 || nextSum > 100) {
      this.sound.nope();
      this.gridEl.flash();
      this.ctrlEl.flashAny();
      
      const resultModal = document.createElement('result-modal');
      this.shadowRoot.appendChild(resultModal);
      resultModal.show(false, 0, 3, this.sessionStars);
      return;
    }

    this.sum = nextSum;
    this.clicks += 1;

    // Preverjanje preostalih korakov (zvezdic)
    const starsLeft = this.stepsEl.getStarsLeft(this.clicks, this.minSteps);
    if (starsLeft < 0) {
      this.sound.nope();
      const resultModal = document.createElement('result-modal');
      this.shadowRoot.appendChild(resultModal);
      resultModal.show(false, 0, 3, this.sessionStars);
      return;
    }

    // Preostanek logike se zgodi v ScoreGrid animaciji in preko dogodka trap-triggered
    this.gridEl.setValue(this.sum);
    this.stepsEl.update(this.clicks, this.minSteps);
    this.sound.click();
  }

  onReset() {
    this.sessionStars = 0;
    const scoreEl = document.querySelector('session-score');
    if (scoreEl) {
      scoreEl.setAttribute('value', 0);
    }

    this.sum = this.startSum || 1;
    this.clicks = 0;
    this.achievedTargets = [];
    this.traps = [...(this.initialTraps || [])];
    this.gridEl.setValue(this.sum, false);
    this.gridEl.setTraps(this.traps);
    this.targetEl.setTargets(this.targets, this.achievedTargets);
    this.stepsEl.update(this.clicks, this.minSteps);
    this.sound.click();
  }

  async onConfirm() {
    let found = false;
    this.targets.forEach((t, i) => {
      if (this.sum === t && !this.achievedTargets.includes(i)) {
        this.achievedTargets.push(i);
        found = true;
      }
    });

    if (found) {
      this.targetEl.setTargets(this.targets, this.achievedTargets);

      if (this.achievedTargets.length === this.targets.length) {
        // Vsi cilji doseženi
        // Mucek veselje
        if (this.gridEl && this.gridEl.cat) {
          this.gridEl.cat.cheer();
        }

        const stars = this.stepsEl.getStarsLeft(this.clicks, this.minSteps);
        const maxStars = this.stepsEl.stars ? this.stepsEl.stars.length : 3;
        const resultModal = document.createElement('result-modal');
        this.shadowRoot.appendChild(resultModal);

        this.sound.victory(stars);
        await resultModal.show(true, stars, maxStars, this.sessionStars);
      } else {
        // Le vmesni cilj
        if (this.gridEl && this.gridEl.cat) {
          this.gridEl.cat.cheer();
        }
        this.sound.victory(1);
      }
      return;
    }

    // Če ni bil dosežen noben (nov) cilj
    if (this.achievedTargets.length < this.targets.length) {
      this.sound.nope();
      this.ctrlEl.flashEquals();
      
      // Game Over ob napačni potrditvi
      const resultModal = document.createElement('result-modal');
      this.shadowRoot.appendChild(resultModal);
      resultModal.show(false, 0, 3, this.sessionStars);
      return;
    }
  }
}

customElements.define('math-game', MathGame);
export default MathGame;
