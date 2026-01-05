class Sound {
  constructor() {
    this.enabled = true;
    this.ctx = null;
    this.master = null;
  }

  _ensure() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.12;
      this.master.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  beep({ freq = 440, dur = 0.08, type = 'sine', gain = 0.12, attack = 0.002, release = 0.04 } = {}) {
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
    this.beep({ freq: base, dur: 0.03, type: 'sine', gain: 0.08 });
    setTimeout(() => this.beep({ freq: base * 1.5, dur: 0.03, type: 'sine', gain: 0.07 }), 40);
    setTimeout(() => this.beep({ freq: base * 2.0, dur: 0.04, type: 'sine', gain: 0.06 }), 80);
  }

  ok() {
    const base = 523.25; // C5
    this.beep({ freq: base, dur: 0.12, type: 'triangle', gain: 0.12 });
    setTimeout(() => this.beep({ freq: base * 1.5, dur: 0.12, type: 'triangle', gain: 0.10 }), 100);
    setTimeout(() => this.beep({ freq: base * 2.0, dur: 0.15, type: 'triangle', gain: 0.08 }), 200);
  }

  nope() {
    this.beep({ freq: 220, dur: 0.09, type: 'sawtooth', gain: 0.10 });
  }
}

export const sound = new Sound();
