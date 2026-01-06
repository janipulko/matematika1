class Sound {
  constructor() {
    const saved = localStorage.getItem('math-game-sound');
    this.enabled = saved !== null ? saved === 'true' : true;
    this.ctx = null;
    this.master = null;
  }

  setEnabled(enabled) {
    this.enabled = enabled;
    localStorage.setItem('math-game-sound', enabled);
  }

  _ensure() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.3; // Povečano z 0.12
      this.master.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  beep({ freq = 440, dur = 0.08, type = 'sine', gain = 0.3, attack = 0.002, release = 0.04 } = {}) {
    if (!this.enabled) return;
    this._ensure();
    const t0 = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    g.gain.value = 0;
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(gain, t0 + attack);
    g.gain.linearRampToValueAtTime(0.0001, t0 + dur + release);
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    osc.connect(g).connect(this.master);
    osc.start(t0);
    osc.stop(t0 + dur + release + 0.01);
  }

  click() {
    const base = 520;
    this.beep({ freq: base, dur: 0.03, type: 'sine', gain: 0.2 });
    setTimeout(() => this.beep({ freq: base * 1.5, dur: 0.03, type: 'sine', gain: 0.15 }), 40);
    setTimeout(() => this.beep({ freq: base * 2.0, dur: 0.04, type: 'sine', gain: 0.12 }), 80);
  }

  victory(stars = 0) {
    const C0 = 261.63;
    const G = 392.00;
    const C1 = 523.25;
    const G2 = 783.99;
    const C3 = 1046.50;

    const play = (freqs) => {
      freqs.forEach((f, i) => {
        setTimeout(() => {
          this.beep({ freq: f, dur: 0.15, type: 'triangle', gain: 0.25 });
        }, i * 120);
      });
    };

    if (stars === 0) {
      play([C1]);
    } else if (stars === 1) {
      play([C0, C1]);
    } else if (stars === 2) {
      play([C0, G, C1]);
    } else {
      play([C0, G, C1, G2, C3]);
    }
  }

  nope() {
    this.beep({ freq: 220, dur: 0.09, type: 'sawtooth', gain: 0.2 });
  }
}

export const sound = new Sound();
