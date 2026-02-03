
import { sound } from '../utils/soundManager.js';

class CountdownTimer extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.timeLeft = 60;
    this.maxTime = 60;
    this.timerId = null;
    this.lastTick = 0;
    this.nextTickTime = 0; // Namesto nextTickThreshold
    this.tickCount = 0;
  }

  static get observedAttributes() {
    return ['initial-time', 'current-time'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'initial-time' && newValue !== oldValue) {
      this.maxTime = parseFloat(newValue) || 60;
      if (this.getAttribute('current-time') === null) {
        this.timeLeft = this.maxTime;
      }
      this.updateBar();
    }
    if (name === 'current-time' && newValue !== oldValue) {
      this.timeLeft = parseFloat(newValue);
      this.updateBar();
    }
  }

  connectedCallback() {
    this.render();
    this.start();
  }

  disconnectedCallback() {
    this.stop();
  }

  start() {
    this.stop();
    this.lastTick = performance.now();
    this.nextTickTime = this.timeLeft;
    
    const tick = (now) => {
      const delta = (now - this.lastTick) / 1000;
      this.lastTick = now;
      
      this.timeLeft -= delta;
      
      // Izračun intervala tiktakanja
      let interval = 1;
      const ratio = this.timeLeft / this.maxTime;
      
      if (this.timeLeft <= 5) {
        interval = 0.25; // 4/sekundo
      } else if (ratio <= 0.25) {
        interval = 0.5;  // 2/sekundo
      } else if (ratio <= 0.5) {
        interval = 1 / 1.5; // 1.5/sekundo (približno 0.66s)
      }

      // Tiktakanje
      if (this.timeLeft <= this.nextTickTime) {
        if (this.tickCount % 2 === 0) {
          sound.tick();
        } else {
          sound.tock();
        }
        this.tickCount++;
        // Naslednji tick je za 'interval' sekund manj od trenutnega cilja
        this.nextTickTime -= interval;
        
        // Če smo preveč zaostali (npr. zaradi bonusa), ulovimo čas
        if (this.nextTickTime < this.timeLeft - interval) {
          this.nextTickTime = this.timeLeft;
        }
      }
      
      if (this.timeLeft <= 0) {
        this.timeLeft = 0;
        this.updateBar();
        this.stop();
        this.dispatchEvent(new CustomEvent('timeout', {
          bubbles: true,
          composed: true
        }));
        return;
      }

      this.updateBar();
      this.timerId = requestAnimationFrame(tick);
    };
    this.timerId = requestAnimationFrame(tick);
  }

  stop() {
    if (this.timerId) {
      cancelAnimationFrame(this.timerId);
      this.timerId = null;
    }
  }

  reset() {
    this.timeLeft = this.maxTime;
    this.nextTickTime = this.timeLeft;
    this.tickCount = 0;
    this.updateBar();
    this.start();
  }

  addBonus(seconds = 3) {
    this.timeLeft = Math.min(this.timeLeft + seconds, this.maxTime);
    this.nextTickTime = this.timeLeft;
    this.updateBar();
  }

  updateBar() {
    if (!this.shadowRoot) return;
    const bar = this.shadowRoot.querySelector('.timer-bar');
    if (!bar) return;

    const percentage = Math.max(0, (this.timeLeft / this.maxTime) * 100);
    const isLowTime = this.timeLeft <= 5;

    bar.style.width = `${percentage}%`;
    bar.style.background = isLowTime ? 'var(--neg-bg, #e53935)' : 'var(--primary, #26c6da)';
    
    const spark = this.shadowRoot.querySelector('.spark-container');
    if (spark) {
      spark.style.left = `${percentage}%`;
      // Skrijemo iskre, ko čas poteče
      spark.style.display = percentage <= 0 ? 'none' : 'block';
    }

    if (isLowTime) {
      bar.classList.add('low-time');
    } else {
      bar.classList.remove('low-time');
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          height: 100%;
          box-sizing: border-box;
          padding: 5px 0;
        }
        .timer-container {
          width: 100%;
          height: 10px;
          background: var(--bubble, #e0f7fa);
          border-radius: var(--radius-sm, 5px);
          position: relative;
          /* overflow: visible, ker želimo videti iskre, ki morda gledajo ven */
        }
        .timer-bar {
          height: 100%;
          width: 100%;
          background: var(--primary, #26c6da);
          border-radius: var(--radius-sm, 5px);
          transition: background-color 0.3s ease;
          will-change: width;
        }
        .spark-container {
          position: absolute;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 30px;
          height: 30px;
          pointer-events: none;
          will-change: left;
        }
        .low-time {
          animation: pulse 1s infinite;
        }
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.7; }
          100% { opacity: 1; }
        }
        
        /* Animacija isker */
        .spark-svg {
          width: 100%;
          height: 100%;
        }
        .particle {
          fill: #FFD700;
          animation: fly 0.6s infinite ease-out;
        }
        .p1 { animation-delay: 0s; }
        .p2 { animation-delay: 0.2s; }
        .p3 { animation-delay: 0.4s; }
        
        @keyframes fly {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(var(--dx), var(--dy)) scale(0); opacity: 0; }
        }
      </style>
      <div class="timer-container">
        <div class="timer-bar"></div>
        <div class="spark-container">
          <svg class="spark-svg" viewBox="0 0 100 100">
            <!-- Glavno gorenje/jedro -->
            <circle cx="50" cy="50" r="10" fill="#FFAB00">
               <animate attributeName="r" values="8;12;8" dur="0.5s" repeatCount="indefinite" />
            </circle>
            <!-- Iskre -->
            <circle class="particle p1" cx="50" cy="50" r="3" style="--dx:-20px; --dy:-15px;" />
            <circle class="particle p2" cx="50" cy="50" r="4" style="--dx:15px; --dy:-20px;" />
            <circle class="particle p3" cx="50" cy="50" r="2" style="--dx:10px; --dy:15px;" />
            <circle class="particle p1" cx="50" cy="50" r="3" style="--dx:-10px; --dy:20px;" />
          </svg>
        </div>
      </div>
    `;
    this.updateBar();
  }
}

customElements.define('countdown-timer', CountdownTimer);
