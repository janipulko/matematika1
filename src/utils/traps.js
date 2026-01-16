
export const TRAPS = {
  tnt: {
    trap: `
      <rect x="3" y="4" width="18" height="16" rx="2" ry="2"
            fill="#FF0000" 
            stroke="#000000" stroke-width="1.5"
            vector-effect="non-scaling-stroke"/>
      <rect x="3" y="9" width="18" height="6"
            fill="#FFFFFF" 
            stroke="#000000" stroke-width="1.2"
            vector-effect="non-scaling-stroke"/>
      <path d="M7 4 V9 M7 15 V20" 
            fill="none" stroke="#000000" stroke-width="1" 
            opacity="0.5" vector-effect="non-scaling-stroke"/>
      <path d="M12 4 V9 M12 15 V20" 
            fill="none" stroke="#000000" stroke-width="1" 
            opacity="0.5" vector-effect="non-scaling-stroke"/>
      <path d="M17 4 V9 M17 15 V20" 
            fill="none" stroke="#000000" stroke-width="1" 
            opacity="0.5" vector-effect="non-scaling-stroke"/>
      <g fill="#000000">
        <g transform="translate(6,10)">
          <rect x="0" y="0" width="1" height="1"/><rect x="1" y="0" width="1" height="1"/><rect x="2" y="0" width="1" height="1"/>
          <rect x="1" y="1" width="1" height="1"/><rect x="1" y="2" width="1" height="1"/><rect x="1" y="3" width="1" height="1"/>
        </g>
        <g transform="translate(10,10)">
          <rect x="0" y="0" width="1" height="1"/><rect x="0" y="1" width="1" height="1"/><rect x="0" y="2" width="1" height="1"/><rect x="0" y="3" width="1" height="1"/>
          <rect x="1" y="0" width="1" height="1"/><rect x="1" y="1" width="1" height="1"/>
          <rect x="2" y="2" width="1" height="1"/><rect x="2" y="3" width="1" height="1"/>
          <rect x="3" y="0" width="1" height="1"/><rect x="3" y="1" width="1" height="1"/><rect x="3" y="2" width="1" height="1"/><rect x="3" y="3" width="1" height="1"/>
        </g>
        <g transform="translate(15,10)">
          <rect x="0" y="0" width="1" height="1"/><rect x="1" y="0" width="1" height="1"/><rect x="2" y="0" width="1" height="1"/>
          <rect x="1" y="1" width="1" height="1"/><rect x="1" y="2" width="1" height="1"/><rect x="1" y="3" width="1" height="1"/>
        </g>
      </g>
    `,
    trigger: `
      <defs>
        <linearGradient id="trapGrad" x1="0%" y1="0%" x2="100%">
          <stop offset="0%" stop-color="#ff8a00" />
          <stop offset="100%" stop-color="#ff0033" />
        </linearGradient>
      </defs>
      <g style="transform-origin: center bottom; animation: trapExplode 0.6s cubic-bezier(.2,.9,.2,1.1) both;">
        <path
          d="M12 2.2 l1.6 3.5 3.9-0.6 -2.5 3.0 2.8 2.3 -3.9 0.7 1.4 3.6 -3.3-2.0 -3.3 2.0 1.4-3.6 -3.9-0.7 2.8-2.3 -2.5-3.0 3.9 0.6z"
          fill="url(#trapGrad)"
          stroke="#000000"
          stroke-width="1"
          stroke-linejoin="round"
        />
        <path
          d="M12 6.2 l0.9 2.0 2.2-0.3 -1.4 1.7 1.6 1.3 -2.3 0.4 0.8 2.1 -1.9-1.2 -1.9 1.2 0.8-2.1 -2.3-0.4 1.6-1.3 -1.4-1.7 2.2 0.3z"
          fill="rgba(255,255,255,0.25)"
        />
      </g>
    `
  },

  poop: {
    // >>> Skalirano in centrirano v 24×24, brez opacity, z obrisom.
    trap: `
   
 
<g style="transform-origin: center bottom;">
  <!-- Osnovna masa -->
  <path d="M6 18
           c-1.7 0-3-1.3-3-3
           c0-1.3 0.9-2.5 2.2-2.9
           c0.2-1.9 1.6-3.4 3.5-3.9
           c-0.3-0.4-0.5-0.9-0.5-1.5
           c0-1.7 1.5-3 3.3-3
           c1.6 0 2.9 0.9 3.3 2.2
           c0.1 0.3 0.1 0.7 0 1
           c-0.1 0.3-0.3 0.6-0.5 0.8
           c1.7 0.4 3 1.9 3.2 3.7
           c1.4 0.3 2.5 1.6 2.5 3.1
           c0 1.7-1.3 3-3 3
           H6 z"
        fill="#873509"
        stroke="#000000" stroke-width="0.6" stroke-linejoin="round"
        vector-effect="non-scaling-stroke"/>

  <!-- Zgornji del (temnejši kontrast) -->
  <path d="M9.2 10.2
           c1.3-0.8 3.3-0.8 4.6 0
           c0.6 0.4 1 1 1.1 1.6
           c0.9 0.2 1.6 0.9 1.6 1.8
           c0 1-0.9 1.8-2 1.8
           H9.5
           c-1.1 0-2-0.8-2-1.8
           c0-0.9 0.7-1.6 1.6-1.8
           c0.1-0.6 0.5-1.2 1.1-1.6 z"
        fill="#AF6B3D"/>
</g>


    `,
    trigger: `

<defs>
  <linearGradient id="trapGradSplash" x1="0%" y1="0%" x2="100%">
    <stop offset="0%" stop-color="#873509"/>
    <stop offset="100%" stop-color="#AF6B3D"/>
  </linearGradient>
</defs>

<g style="transform-origin: center bottom; animation: trapExplode 0.6s cubic-bezier(.2,.9,.2,1.1) both;">
  <!-- SPLASH – osnovna oblika, polnjena z dvo-barvnim gradientom -->
  <path d="M6.4 16.4
           C4.9 16.1 4.2 14.8 4.8 13.6
           C5.2 12.8 6.1 12.2 7.1 12.0
           C6.6 11.0 7.0 9.9 8.1 9.3
           C9.0 8.8 10.1 8.8 10.9 9.1
           C11.1 8.4 11.9 7.8 13.0 7.7
           C14.4 7.5 15.6 8.3 15.8 9.5
           C16.5 9.2 17.4 9.2 18.1 9.8
           C18.9 10.5 18.9 11.7 18.2 12.5
           C19.3 13.1 19.8 14.4 19.2 15.5
           C18.6 16.7 17.1 17.2 15.8 16.9
           C15.2 17.9 14.0 18.5 12.7 18.4
           C11.5 18.3 10.5 17.6 10.0 16.8
           C9.1 17.5 7.7 17.3 6.4 16.4 z"
        fill="url(#trapGradSplash)"
        stroke="#000000" stroke-width="0.6" stroke-linejoin="round"
        vector-effect="non-scaling-stroke"/>

  <!-- SPLASH – zgornji sloj (svetlejši “sheen” za volumen) -->
  <path d="M7.9 15.1
           C7.1 14.9 6.7 14.1 7.0 13.5
           C7.3 13.0 7.9 12.6 8.5 12.5
           C8.2 11.8 8.6 11.1 9.3 10.7
           C9.9 10.3 10.7 10.3 11.3 10.5
           C11.5 10.0 12.0 9.6 12.7 9.6
           C13.6 9.5 14.3 10.0 14.4 10.7
           C14.9 10.5 15.5 10.5 16.0 10.9
           C16.5 11.3 16.5 12.0 16.0 12.5
           C16.7 12.9 17.0 13.8 16.6 14.5
           C16.2 15.2 15.2 15.5 14.4 15.3
           C14.0 16.0 13.1 16.4 12.3 16.3
           C11.5 16.2 10.9 15.8 10.6 15.3
           C10.0 15.7 9.1 15.6 7.9 15.1 z"
        fill="rgba(255,255,255,0.22)"/>
</g>

`
  }
};
