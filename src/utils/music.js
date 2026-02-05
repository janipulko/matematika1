/**
 * =========================================================
 * ALGORITEMSKI ODMEV - Arhitektura z Basovskimi Vzorci
 * =========================================================
 */

// --- 1. KONSTANTE IN NASTAVITVE ---
const VOLUME_MASTER = 0.50;
const BASE_FREQ = 32.7032; // C1
let currentBpmInterval = 350; // Prvotnih 350ms

// Koeficienti za note (Lestvica)
const NOTE_COEF = {
  "C": 1.000, "C#": 1.059, "D": 1.122, "D#": 1.189, "E": 1.260, "F": 1.335,
  "F#": 1.414, "G": 1.498, "G#": 1.587, "A": 1.682, "A#": 1.782, "B": 1.888
};

const CHORD_DATA = {
  // --- OSNOVNI DIATONIČNI AKORDI (Temelji sistema) ---
  "Cmaj":  [NOTE_COEF["C"], NOTE_COEF["E"], NOTE_COEF["G"]],          // Čisti mir
  "Dm":    [NOTE_COEF["D"], NOTE_COEF["F"], NOTE_COEF["A"]],          // Rahla melanholija
  "Em":    [NOTE_COEF["E"], NOTE_COEF["G"], NOTE_COEF["B"]],          // Introspekcija
  "Fmaj":  [NOTE_COEF["F"], NOTE_COEF["A"], NOTE_COEF["C"]],          // Stabilnost, rast
  "Gmaj":  [NOTE_COEF["G"], NOTE_COEF["B"], NOTE_COEF["D"]],          // Svetloba, težnja k vrnitvi
  "Am":    [NOTE_COEF["A"], NOTE_COEF["C"], NOTE_COEF["E"]],          // Naravni mol, resnost
  "Bdim":  [NOTE_COEF["B"], NOTE_COEF["D"], NOTE_COEF["F"]],          // Nestabilnost, "razpoka"

  // --- SEPTIMNI AKORDI (Večja kompleksnost vzorca) ---
  "Cmaj7": [NOTE_COEF["C"], NOTE_COEF["E"], NOTE_COEF["G"], NOTE_COEF["B"]],
  "Dm7":   [NOTE_COEF["D"], NOTE_COEF["F"], NOTE_COEF["A"], NOTE_COEF["C"]],
  "Em7":   [NOTE_COEF["E"], NOTE_COEF["G"], NOTE_COEF["B"], NOTE_COEF["D"]],
  "Fmaj7": [NOTE_COEF["F"], NOTE_COEF["A"], NOTE_COEF["C"], NOTE_COEF["E"]],
  "G7":    [NOTE_COEF["G"], NOTE_COEF["B"], NOTE_COEF["D"], NOTE_COEF["F"]],
  "Am7":   [NOTE_COEF["A"], NOTE_COEF["C"], NOTE_COEF["E"], NOTE_COEF["G"]],
  "Bm7b5": [NOTE_COEF["B"], NOTE_COEF["D"], NOTE_COEF["F"], NOTE_COEF["A"]], // "Half-diminished"

  // --- DODATNA TEKSTURA (Za tiste posebne trenutke v igri) ---
  "Cadd9": [NOTE_COEF["C"], NOTE_COEF["E"], NOTE_COEF["G"], NOTE_COEF["D"]], // Zelo odprt, otroški zvok
  "Asus4": [NOTE_COEF["A"], NOTE_COEF["D"], NOTE_COEF["E"]],                // Lebdenje, neodločnost
  "Gsus4": [NOTE_COEF["G"], NOTE_COEF["C"], NOTE_COEF["D"]],                // Napetost, ki čaka na razrešitev
  "Fadd9": [NOTE_COEF["F"], NOTE_COEF["A"], NOTE_COEF["C"], NOTE_COEF["G"]], // Zelo moderen, prostoren zvok
  "Am9":   [NOTE_COEF["A"], NOTE_COEF["C"], NOTE_COEF["E"], NOTE_COEF["G"], NOTE_COEF["B"]], // Sanjavo

  // --- "RAZTRGANINE" (Akordi, ki si sposodijo tone izven C-dura za dramo) ---
  "E7":    [NOTE_COEF["E"], NOTE_COEF["G#"], NOTE_COEF["B"], NOTE_COEF["D"]], // Potiska močno proti Am
  "D7":    [NOTE_COEF["D"], NOTE_COEF["F#"], NOTE_COEF["A"], NOTE_COEF["C"]], // Potiska močno proti Gmaj
  "Fm":    [NOTE_COEF["F"], NOTE_COEF["G#"], NOTE_COEF["C"]]                  // "Tragičen" konec (izposojeno iz molla)
};

// --- 2. UNAPREJ PRIPRAVLJENE BAS LINIJE (8 korakov) ---
// t1 = tonika nizka, t2 = tonika visoka, m = mediana (3.), d = dominanta (5.)
const BASS_LINES = [
  ["t1", "", "t2", "", "t1", "", "t2", ""],   // Tvoj prvi vzorec (diha)
  ["t1", "", "", "", "t1", "", "", ""],   // Minimal (samo na 1 in 5)
  ["t1", "", "t2", "", "", "d", "", ""],   // Odprt prostor
  ["t1", "", "", "m", "d", "", "", ""],   // Sinkopiran prehod
  ["t1", "t1", "", "", "d", "", "t2", ""],   // Dvojni udarec na začetku
  ["t1", "", "m", "", "t1", "", "d", ""],   // Melodičen, a zračen
  ["t1", "", "", "d", "t1", "t1", "", ""],   // Odmevni bas
  ["t1", "", "d", "", "t2", "", "", "m"]    // Skoki v globino
];

// --- 3. UNAPREJ PRIPRAVLJENE DINAMIKE (Akordi) ---
const DYNAMICS_SETS = [
  // --- OSNOVNI IN STABILNI (Začetek igre, varno okolje) ---
  ["Cmaj7", "Am7", "Dm7", "G7"],       // Klasični krog (Jazz standard vibe)
  ["Cmaj7", "Em7", "Fmaj7", "G7"],     // Naraščajoča stabilnost
  ["Cmaj7", "Fmaj7", "Cmaj7", "G7"],   // Zelo varno in domače

  // --- RAZISKOVALNI IN SANJAVI (Ko otrok razmišlja ali gradi vzorec) ---
  ["Fmaj7", "Bbmaj7", "Em7", "Am7"],   // Nežna melanholija z razširitvijo
  ["Cadd9", "Fadd9", "Cadd9", "Gsus4"],// Moderen, prostoren in "pameten" zvok
  ["Fmaj7", "G7", "Em7", "Am7"],       // Stopnišče (Sentimentalno raziskovanje)
  ["Am9", "Dm7", "G7", "Cmaj7"],       // Globoko razmišljanje (Zelo prostoren zvok)

  // --- NAPETI IN DRAMATIČNI (Srečanje z "zaprto ploščo" ali izzivom) ---
  ["Am7", "Em7", "Fmaj7", "E7"],       // Dramatičen obrat proti Am (skrivnost)
  ["Dm7", "G7", "Cmaj7", "Fmaj7"],     // Klasični krog kvint (matematična dovršenost)
  ["Am7", "D7", "G7", "Cmaj7"],        // Močan logični premik (Sekundarna dominanta)
  ["Bdim", "E7", "Am7", "D7"],         // Visoka napetost, iskanje izhoda iz kaosa

  // --- ČUSTVENI IN RELEVANTNI (Trenutki spoznanja ali preboja) ---
  ["Fmaj7", "Fm", "Cmaj7", "Cmaj7"],   // "Spust v globino" (Fm doda čustveno težo)
  ["Cmaj7", "G7", "Am7", "Fmaj7"],     // "Pop" progresija (Energija, veselje)
  ["Asus4", "Am", "Gsus4", "Gmaj"],    // Lebdenje, ki se končno postavi na tla
  ["Cadd9", "Em7", "Am7", "Fadd9"]     // Svetla prihodnost, odprto obzorje
];

// --- 4. STANJE SISTEMA ---
let audioCtx = null;
let audioGraph = null;
let playbackTimer = null;

let stepCounter = 0;
let cycleCounter = 0;
let currentSetIndex = 0;
let currentBassLineIndex = Math.floor(Math.random() * BASS_LINES.length); // Kateri vzorec basa trenutno igramo
let melodyHistory = [];

/**
 * --- 5. AVDIO JEDRO ---
 */
function initAudio() {
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  const masterGain = audioCtx.createGain();
  const dryBus = audioCtx.createGain();
  const reverbBus = audioCtx.createGain();
  const reverbSend = audioCtx.createGain();
  const reverbNode = audioCtx.createConvolver();

  masterGain.gain.value = 0.25 * VOLUME_MASTER;
  dryBus.gain.value = 0.9 * VOLUME_MASTER;
  reverbBus.gain.value = 0.3 * VOLUME_MASTER;
  reverbSend.gain.value = 0.45 * VOLUME_MASTER;

  reverbNode.buffer = createReverbImpulse(audioCtx, 4.0, 5.0);

  masterGain.connect(audioCtx.destination);
  dryBus.connect(masterGain);
  reverbBus.connect(masterGain);
  reverbSend.connect(reverbNode);
  reverbNode.connect(reverbBus);

  audioGraph = {dryBus, reverbSend};
}

function createReverbImpulse(ctx, seconds, decay) {
  const rate = ctx.sampleRate;
  const length = rate * seconds;
  const impulse = ctx.createBuffer(2, length, rate);
  for (let ch = 0; ch < 2; ch++) {
    const data = impulse.getChannelData(ch);
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
    }
  }
  return impulse;
}

function playNote(freq, duration, velocity, type = "triangle") {
  if (!audioGraph) {
    return;
  }
  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const vca = audioCtx.createGain();
  const vcf = audioCtx.createBiquadFilter();

  vcf.type = "lowpass";
  vcf.frequency.setValueAtTime(type === "sine" ? 350 : freq * 1.8, now);

  vca.gain.setValueAtTime(0.0001, now);
  vca.gain.linearRampToValueAtTime(velocity * VOLUME_MASTER, now + 0.03);
  vca.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);

  osc.connect(vcf);
  vcf.connect(vca);
  vca.connect(audioGraph.dryBus);
  vca.connect(audioGraph.reverbSend);

  osc.start(now);
  osc.stop(now + duration);
}

/**
 * --- 6. PREVAJALNIK BASOVSKIH SIMBOLOV ---
 * Pretvori t, m, d v dejanske frekvence glede na akord.
 */
/**
 * --- POSODOBLJEN PREVAJALNIK BASOVSKIH SIMBOLOV ---
 * Zagotavlja, da so vse note (m, d) v najnižji možni oktavi glede na t1.
 */
function getBassFreq(symbol, chordName) {
  if (symbol === "") {
    return null;
  }

  const rootSymbol = chordName.match(/^[A-G]#?/)[0];
  const t1 = NOTE_COEF[rootSymbol] * BASE_FREQ * 2; // Naša referenčna nizka tonika (C2)
  const chordCoefs = CHORD_DATA[chordName];

  let freq;
  switch (symbol) {
    case "t1":
      return t1;
    case "t2":
      return t1 * 2; // Oktavo višje (C3)
    case "m":
      freq = t1 * chordCoefs[1]; // Izračunamo osnovno m
      // Če je m višja od t1, jo spustimo za oktavo, da gre "pod" toniko
      while (freq >= t1 * 1.5) {
        freq /= 2;
      }
      return freq;
    case "d":
      freq = t1 * 1.498; // Izračunamo osnovno d (kvinta)
      // Če je dominanta previsoka, jo prestavimo oktavo nižje (kvarta spodaj)
      if (freq > t1 * 1.2) {
        freq /= 2;
      }
      return freq;
    default:
      return null;
  }
}

/**
 * --- 7. LOGIKA PROCESIRANJA ---
 */
function processStep() {
  const stepInCycle = stepCounter % 32;
  const stepInMeasure = stepCounter % 8;
  const chordIndex = Math.floor(stepInCycle / 8);

  const currentSet = DYNAMICS_SETS[currentSetIndex];
  const currentChord = currentSet[chordIndex];

  // Menjava dinamike in bas linije na vsake 4 cikle (128 korakov)
  if (stepInCycle === 0 && stepCounter > 0) {
    cycleCounter++;
    if (cycleCounter >= 4) {
      cycleCounter = 0;
      currentSetIndex = (currentSetIndex + 1) % DYNAMICS_SETS.length;
      currentBassLineIndex = Math.floor(Math.random() * BASS_LINES.length);
      console.log("Struktura: Nova dinamika in bas vzorec.");
    }
  }

  // --- BAS LINIJA ---
  const currentLine = BASS_LINES[currentBassLineIndex];
  const bassSymbol = currentLine[stepInMeasure];
  const bFreq = getBassFreq(bassSymbol, currentChord);

  if (bFreq) {
    // Poudarek na prvem udarcu takta
    const bVel = (stepInMeasure === 0) ? 0.8 : 0.6;
    playNote(bFreq, 0.6, bVel, "sine");
  }

  // --- MELODIJA IN ODMEV ---
  if (melodyHistory.length > 0) {
    playNote(melodyHistory[0], 1.0, 0.12); // Rahlejši odmev
  }

  const possibleNotes = CHORD_DATA[currentChord];
  const coef = possibleNotes[Math.floor(Math.random() * possibleNotes.length)];
  const octave = Math.random() > 0.6 ? 16 : 8;
  const mFreq = coef * BASE_FREQ * octave;

  const melVel = 0.2 + 0.3 * Math.abs(Math.sin(stepCounter * 0.2));
  playNote(mFreq, 1.4, melVel, "triangle");

  melodyHistory[0] = mFreq;
  stepCounter++;
}

/**
 * --- 8. KONTROLA ---
 */
/**
 * --- 7. NADZOR PREDVAJANJA (Continuous Play) ---
 */
/**
 * --- 7. NADZOR PREDVAJANJA (Continuous Play with Drift) ---
 */
function startContinuousMusic() {
  if (!audioCtx) initAudio();
  if (audioCtx.state === "suspended") audioCtx.resume();

  // Če glasba že igra, ne naredimo ničesar
  if (playbackTimer) return;

  console.log("Glasba se je začela in bo igrala neprekinjeno.");
  runTick(); // Zaženemo prvo iteracijo
}

function runTick() {
  processStep(); // Izvede trenutni korak (zvok, logika)

  // --- LOGIKA DRIFTA ---
  // Vsakih 32 korakov rahlo spremenimo tempo za bolj naraven občutek
  if (stepCounter % 32 === 0) {
    const drift = (Math.random() - 0.5) * 4; // +/- 2ms
    currentBpmInterval += drift;

    // Varnostne meje, da tempo ne pobegne v ekstreme
    currentBpmInterval = Math.max(300, Math.min(400, currentBpmInterval));
  }

  // Rekurzivni klic: namesto fiksnega intervala,
  // se naslednji korak določi na podlagi trenutnega BPM_INTERVAL
  playbackTimer = setTimeout(runTick, currentBpmInterval);
}

// Sprožitev na prvi klik uporabnika
window.addEventListener('click', startContinuousMusic, { once: true });