class IconTnt extends HTMLElement {
  static get observedAttributes() {
    return ['size', 'fill', 'accent', 'stroke', 'stroke-width', 'label',
      'variant'];
  }

  constructor() {
    super();
    this._root = this.attachShadow({mode: 'open'});
    this._size = 24;
    this._fill = '#FF0000';    // čista rdeča
    this._accent = '#FFFFFF';  // čista bela
    this._stroke = '#000000';  // črna
    this._strokeWidth = 1.5;
    this._label = 'Ikona TNT zabojčka';
    this._variant = 'default';
  }

  connectedCallback() {
    // Inicializacija iz atributov (če podani)
    if (this.hasAttribute('size')) {
      this._size = this._asNumber(
          this.getAttribute('size'), 24);
    }
    if (this.hasAttribute('fill')) {
      this._fill = this.getAttribute('fill')
          || this._fill;
    }
    if (this.hasAttribute('accent')) {
      this._accent = this.getAttribute('accent')
          || this._accent;
    }
    if (this.hasAttribute('stroke')) {
      this._stroke = this.getAttribute('stroke')
          || this._stroke;
    }
    if (this.hasAttribute('stroke-width')) {
      this._strokeWidth = this._asNumber(
          this.getAttribute('stroke-width'), 1.5);
    }
    if (this.hasAttribute('label')) {
      this._label = this.getAttribute('label')
          || this._label;
    }
    if (this.hasAttribute('variant')) {
      this._variant = this.getAttribute(
          'variant') || 'default';
    }

    this._render();
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (oldVal === newVal) {
      return;
    }
    switch (name) {
      case 'size':
        this._size = this._asNumber(newVal, 24);
        break;
      case 'fill':
        this._fill = newVal || '#FF0000';
        break;
      case 'accent':
        this._accent = newVal || '#FFFFFF';
        break;
      case 'stroke':
        this._stroke = newVal || '#000000';
        break;
      case 'stroke-width':
        this._strokeWidth = this._asNumber(newVal, 1.5);
        break;
      case 'label':
        this._label = newVal || 'Ikona TNT zabojčka';
        break;
      case 'variant':
        this._variant = newVal || 'default';
        break;
    }
    this._render();
  }

  _asNumber(val, fallback) {
    const n = Number(val);
    return Number.isFinite(n) ? n : fallback;
  }

  _resolveTheme() {
    // Če želiš imeti notranje “teme”, jih lahko določiš tukaj po variantah
    // in preglasijo notranje privzete barve, razen če so atributi eksplicitno podani.
    // Trenutno samo default (brez sprememb). Primer:
    switch (this._variant) {
      case 'danger':
        return {fill: '#D32F2F', accent: '#FFCDD2', stroke: '#B71C1C'};
      case 'warning':
        return {fill: '#F57C00', accent: '#FFE0B2', stroke: '#E65100'};
      case 'muted':
        return {fill: '#9E9E9E', accent: '#E0E0E0', stroke: '#616161'};
      default:
        return null;
    }
  }

  _render() {
    let fill = this._fill;
    let accent = this._accent;
    let stroke = this._stroke;
    const strokeWidth = this._strokeWidth;
    const label = this._label;
    const size = this._size;

    // Če je variant nastavljen, lahko privzete barve preglasimo,
    // a spoštujemo eksplicitne atribute (ti imajo prednost).
    const theme = this._resolveTheme();
    if (theme) {
      if (!this.hasAttribute('fill')) {
        fill = theme.fill;
      }
      if (!this.hasAttribute('accent')) {
        accent = theme.accent;
      }
      if (!this.hasAttribute('stroke')) {
        stroke = theme.stroke;
      }
    }

    this._root.innerHTML = `
      <style>
        :host {
          display: inline-block;
          width: ${size}px;
          height: ${size}px;
          line-height: 0;
        }
        svg {
          width: 100%;
          height: 100%;
          display: block;
        }
      </style>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24"
        role="img" aria-label="${label}"
      >
        <!-- Škatla (osnovno polnilo) -->
        <rect x="3" y="4" width="18" height="16" rx="2" ry="2"
              fill="${fill}" 
              stroke="${stroke}" stroke-width="${strokeWidth}"
              vector-effect="non-scaling-stroke"/>

        <!-- Horizontalni trak (višina 6 px: y=9..15) -->
        <rect x="3" y="9" width="18" height="6"
              fill="${accent}" 
              stroke="${stroke}" stroke-width="1.2"
              vector-effect="non-scaling-stroke"/>

        <!-- Dekorativne navpične letve (ne prečkajo pasu) -->
        <path d="M7 4 V9 M7 15 V20" 
              fill="none" stroke="${stroke}" stroke-width="1" 
              opacity="0.5" vector-effect="non-scaling-stroke"/>
        <path d="M12 4 V9 M12 15 V20" 
              fill="none" stroke="${stroke}" stroke-width="1" 
              opacity="0.5" vector-effect="non-scaling-stroke"/>
        <path d="M17 4 V9 M17 15 V20" 
              fill="none" stroke="${stroke}" stroke-width="1" 
              opacity="0.5" vector-effect="non-scaling-stroke"/>

        <!-- Napis “TNT” v pixel-art slogu, centriran v traku -->
        <g fill="${stroke}">
          <!-- Levi T -->
          <g transform="translate(6,10)">
            <rect x="0" y="0" width="1" height="1"/>
            <rect x="1" y="0" width="1" height="1"/>
            <rect x="2" y="0" width="1" height="1"/>
            <rect x="1" y="1" width="1" height="1"/>
            <rect x="1" y="2" width="1" height="1"/>
            <rect x="1" y="3" width="1" height="1"/>
          </g>
          <!-- N -->
          <g transform="translate(10,10)">
            <rect x="0" y="0" width="1" height="1"/>
            <rect x="0" y="1" width="1" height="1"/>
            <rect x="0" y="2" width="1" height="1"/>
            <rect x="0" y="3" width="1" height="1"/>
            <rect x="1" y="0" width="1" height="1"/>
            <rect x="1" y="1" width="1" height="1"/>
            <rect x="2" y="2" width="1" height="1"/>
            <rect x="2" y="3" width="1" height="1"/>
            <rect x="3" y="0" width="1" height="1"/>
            <rect x="3" y="1" width="1" height="1"/>
            <rect x="3" y="2" width="1" height="1"/>
            <rect x="3" y="3" width="1" height="1"/>
          </g>
          <!-- Desni T -->
          <g transform="translate(15,10)">
            <rect x="0" y="0" width="1" height="1"/>
            <rect x="1" y="0" width="1" height="1"/>
            <rect x="2" y="0" width="1" height="1"/>
            <rect x="1" y="1" width="1" height="1"/>
            <rect x="1" y="2" width="1" height="1"/>
            <rect x="1" y="3" width="1" height="1"/>
          </g>
        </g>

        <!-- Tenka notranja senca -->
        <rect x="3.6" y="4.6" width="16.8" height="14.8" rx="1.4" ry="1.4"
              fill="none" stroke="${stroke}" stroke-width="0.6" opacity="0.2"
              vector-effect="non-scaling-stroke"/>
      </svg>
    `;
  }
}

customElements.define('icon-tnt', IconTnt);
