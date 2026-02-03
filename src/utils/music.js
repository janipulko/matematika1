// =========================================================
//  Matematični Glasbeni Generator - "Algoritemski Odmev"
//  Struktura: Bas (Okt 2), Melodija (Okt 3/4) + 2x Odmev
// =========================================================

const LOUDNESS = 0.50;
const audio = new (window.AudioContext || window.webkitAudioContext)();

const master = audio.createGain();
master.gain.value = 0.25 * LOUDNESS;
master.connect(audio.destination);

const dryBus = audio.createGain();
dryBus.gain.value = 0.9 * LOUDNESS;
dryBus.connect(master);

// ---- Reverb za prostor ----
function makeImpulse(ctx, seconds = 3.5, decay = 4.0) {
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

const reverb = audio.createConvolver();
reverb.buffer = makeImpulse(audio);
const reverbGain = audio.createGain();
reverbGain.gain.value = 0.25 * LOUDNESS;
reverb.connect(reverbGain).connect(master);

const sendReverb = audio.createGain();
sendReverb.gain.value = 0.4 * LOUDNESS;
sendReverb.connect(reverb);

// -------------------------------------
// KONSTANTE
// -------------------------------------
const baseFreq = 32.7032; // C1

const NOTE_COEF = {
  "C": 1, "C#": 1.059, "D": 1.122, "D#": 1.189, "E": 1.260, "F": 1.335,
  "F#": 1.414, "G": 1.498, "G#": 1.587, "A": 1.682, "A#": 1.782, "B": 1.888
};

const CHORD_COEFFICIENTS = {
  "C": [1, 1.26, 1.498, 1.888],
  "F": [1.335, 1.682, 1, 1.26],
  "G": [1.498, 1.888, 1.122, 1.414],
  "Am": [1.682, 1, 1.26, 1.498],
  "Dm": [1.122, 1.335, 1.682, 1]
};

const CHORD_PROGRESSIONS = {
  "C": ["G", "F", "Am"],
  "G": ["C", "Am"],
  "F": ["C", "G"],
  "Am": ["F", "Dm", "G"],
  "Dm": ["G", "C"]
};

// -------------------------------------
// INSTRUMENT
// -------------------------------------
function play(freq, duration = 1.2, velocity = 0.5, isBass = false) {
  if (audio.state === "suspended") {
    audio.resume();
  }

  const vca = audio.createGain();
  const vcf = audio.createBiquadFilter();
  vcf.type = "lowpass";
  vcf.frequency.setValueAtTime(isBass ? 500 : freq * 2.2, audio.currentTime);

  const t = audio.currentTime;
  vca.gain.setValueAtTime(0.0001, t);
  vca.gain.linearRampToValueAtTime(velocity * LOUDNESS, t + 0.02);
  vca.gain.exponentialRampToValueAtTime(0.0001, t + duration);

  const osc = audio.createOscillator();
  osc.type = "triangle";
  osc.frequency.value = freq;

  osc.connect(vcf);
  vcf.connect(vca).connect(dryBus);
  vca.connect(sendReverb);

  osc.start();
  osc.stop(t + duration);
}

// -------------------------------------
// GENERATOR Z ZGODOVINO ZA ODMEV
// -------------------------------------
let step = 0;
let timer = null;
let currentChord = "C";
let history = []; // Shranjevanje prejšnjih not: [zadnja, predzadnja]

function getRootFreq(chord) {
  return (NOTE_COEF[chord.replace("m", "")] || 1) * baseFreq;
}

function getDominantFreq(chord) {
  return getRootFreq(chord) * 1.498;
}

function startMusic() {
  if (timer) {
    return;
  }
  if (audio.state === "suspended") {
    audio.resume();
  }

  timer = setInterval(() => {
    const stepInCycle = step % 16;

    // 1. Menjava akorda
    if (stepInCycle === 0) {
      currentChord = CHORD_PROGRESSIONS[currentChord][Math.floor(
          Math.random() * CHORD_PROGRESSIONS[currentChord].length)];
    }

    // 2. BAS (Oktava 2)
    if (stepInCycle === 0) {
      play(getRootFreq(currentChord) * 4, 3.5, 0.7, true);
    } else if (stepInCycle === 8) {
      play(getDominantFreq(currentChord) * 4, 3.5, 0.6, true);
    }

    // 3. ODMEV (Igranje zgodovine)
    if (history.length > 0) {
      // Predzadnja nota (najtišja)
      if (history.length > 1) {
        play(history[1], 1.0, 0.12, false);
      }
      // Zadnja nota (srednje tiha)
      play(history[0], 1.2, 0.25, false);
    }

    // 4. NOVA NOTA (Melodija Oktava 3/4)
    const chordNotes = CHORD_COEFFICIENTS[currentChord];
    let nextFreq;
    const coef = chordNotes[Math.floor(Math.random() * chordNotes.length)];
    const octave = Math.random() > 0.5 ? 8 : 16;
    nextFreq = coef * baseFreq * octave;

    // Preprečimo takojšnjo ponovitev iste note za novo noto
    if (history.length > 0 && nextFreq === history[0]) {
      const alternativeCoef = chordNotes[(chordNotes.indexOf(coef) + 1)
      % chordNotes.length];
      nextFreq = alternativeCoef * baseFreq * octave;
    }

    const dynamicVel = 0.4 + 0.3 * Math.sin(step * 0.2);
    play(nextFreq, 1.5, dynamicVel, false);

    // Posodobitev zgodovine (shiftamo zaporedje)
    history.unshift(nextFreq);
    if (history.length > 2) {
      history.pop();
    }

    step++;
  }, 350);
}

window.addEventListener('click', () => {
  startMusic();
});