

import { AVATARS } from '../utils/avatars.js';

class IconCat extends HTMLElement {
  static get observedAttributes() {
    return ['size', 'label', 'type'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    // Root container
    this._wrapper = document.createElement('div');
    this._wrapper.part = 'wrapper';
    this._wrapper.style.display = 'flex';
    this._wrapper.style.alignItems = 'center';
    this._wrapper.style.justifyContent = 'center';
    this._wrapper.style.width = '100%';
    this._wrapper.style.height = '100%';
    this._wrapper.style.position = 'relative';
    this._wrapper.style.overflow = 'visible';

    // Osnovni stil v Shadow DOM
    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: inline-block;
        width: 24px;
        height: 24px;
        box-sizing: border-box;
        overflow: visible;
      }
      svg.avatar-svg {
        width: 100%;
        height: 100%;
        display: block;
        user-select: none;
        overflow: visible;
      }

      /* Animacija veselja */
      .cheer {
        animation: cat-cheer 0.6s cubic-bezier(0.36, 0, 0.66, -0.56) 2;
      }

      @keyframes cat-cheer {
        0%, 100% { transform: translateY(0) scale(1); }
        50% { transform: translateY(-35%) scale(1.1, 0.9); }
      }

      /* Srca */
      .heart {
        position: absolute;
        opacity: 0;
        pointer-events: none;
        z-index: 110;
        color: #ff4081;
        fill: currentColor;
        left: 50%;
        top: 50%;
      }

      .heart-animate {
        animation: heart-burst 0.8s ease-out forwards;
      }

      @keyframes heart-burst {
        0% {
          opacity: 0;
          transform: translate(-50%, -50%) scale(0) translateY(0);
        }
        20% {
          opacity: 1;
        }
        80% {
          opacity: 1;
        }
        100% {
          opacity: 0;
          transform: translate(-50%, -50%) scale(1.2) translateY(-40px) translateX(var(--tx));
        }
      }
    `;

    // Posoda za srčke
    this._heartsContainer = document.createElement('div');
    this._heartsContainer.style.position = 'absolute';
    this._heartsContainer.style.top = '0';
    this._heartsContainer.style.left = '0';
    this._heartsContainer.style.width = '100%';
    this._heartsContainer.style.height = '100%';
    this._heartsContainer.style.pointerEvents = 'none';
    this._heartsContainer.style.overflow = 'visible';
    this._wrapper.appendChild(this._heartsContainer);

    // SVG element
    this._svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this._svg.classList.add('avatar-svg');
    
    // Odstranimo cheer class po končani animaciji
    this._svg.addEventListener('animationend', (e) => {
      if (e.animationName === 'cat-cheer') {
        this._svg.classList.remove('cheer');
      }
    });

    this._wrapper.prepend(this._svg);

    this.shadowRoot.append(style, this._wrapper);
  }

  cheer() {
    this._svg.classList.remove('cheer');
    void this._svg.offsetWidth; // trigger reflow
    this._svg.classList.add('cheer');
    this._spawnHearts();
  }

  _spawnHearts() {
    if (!this._heartsContainer) return;
    this._heartsContainer.innerHTML = '';
    
    const offsets = [-20, 0, 20];
    offsets.forEach(xOffset => {
      const heart = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      heart.setAttribute('viewBox', '0 0 24 24');
      heart.setAttribute('width', '12');
      heart.setAttribute('height', '12');
      heart.classList.add('heart');
      heart.style.setProperty('--tx', `${xOffset}px`);
      
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z');
      heart.appendChild(path);
      
      this._heartsContainer.appendChild(heart);
      
      setTimeout(() => {
        heart.classList.add('heart-animate');
      }, Math.random() * 200);

      setTimeout(() => {
        if (heart.parentNode) heart.remove();
      }, 1200);
    });
  }

  connectedCallback() {
    this._renderAvatar();
    this._applySize();
    this._applyLabel();
  }

  attributeChangedCallback(name, _oldVal, _newVal) {
    switch (name) {
      case 'size':
        this._applySize();
        break;
      case 'label':
        this._applyLabel();
        break;
      case 'type':
        this._renderAvatar();
        break;
    }
  }

  _renderAvatar() {
    const type = this.getAttribute('type') || 'cat';
    const avatar = AVATARS[type] || AVATARS.cat;
    
    this._svg.setAttribute('viewBox', avatar.viewBox);
    this._svg.innerHTML = avatar.content;
  }

  _applySize() {
    const size = parseInt(this.getAttribute('size') || '24', 10);
    this.style.width = `${size}px`;
    this.style.height = `${size}px`;
    if (this._wrapper) {
      this._wrapper.style.width = `${size}px`;
      this._wrapper.style.height = `${size}px`;
    }
    // SVG se samodejno prilagodi preko width: 100% v stilu
  }

  _applyLabel() {
    const label = this.getAttribute('label');
    if (!this._svg) return;
    if (label && label.trim()) {
      this._svg.setAttribute('aria-label', label);
      this._svg.setAttribute('role', 'img');
      this._svg.removeAttribute('aria-hidden');
    } else {
      this._svg.setAttribute('aria-hidden', 'true');
      this._svg.removeAttribute('aria-label');
      this._svg.removeAttribute('role');
    }
  }
}

customElements.define('icon-cat', IconCat);


