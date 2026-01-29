export const TRAPS = {
  trap: {
    trap: `


 <defs>
    <!-- Osnovni vertikalni gradient (svetlejši zgoraj, temnejši spodaj) -->
    <linearGradient id="trapGradJaw_static_v2" x1="0" y1="10" x2="0" y2="18" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#ECEFF1"/>
      <stop offset="100%" stop-color="#90A4AE"/>
    </linearGradient>

    <!-- Sheen (svetlejši pas zgoraj) -->
    <linearGradient id="trapGradJawSheen_static_v2" x1="0" y1="10" x2="0" y2="18" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.65"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </linearGradient>
  </defs>

  <g id="trapJaw">
    <!-- ===== Osnovni zobati trak (manj zob, višje konice) ===== -->
    <path
      fill="url(#trapGradJaw_static_v2)"
      stroke="#263238"
      stroke-width="0.6"
      vector-effect="non-scaling-stroke"
      stroke-linejoin="round"
      stroke-linecap="round"
      d="M3 15
         L5 11.6 L7 15
         L9 11.6 L11 15
         L13 11.6 L15 15
         L17 11.6 L19 15
         L21 11.6 L21 17
         L3 17 Z"/>

    <!-- ===== Svetlejši zgornji pas (sheen / highlight) ===== -->
    <path
      fill="url(#trapGradJawSheen_static_v2)"
      stroke="#263238"
      stroke-width="0.6"
      vector-effect="non-scaling-stroke"
      stroke-linejoin="round"
      stroke-linecap="round"
      opacity="0.85"
      d="M3 15
         L5 11.6 L7 15
         L9 11.6 L11 15
         L13 11.6 L15 15
         L17 11.6 L19 15
         L21 11.6 L21 16
         L3 16 Z"/>
  </g>


    `,
    trigger: `
     

 <defs>
    <!-- Temni gradient za osnovni sloj (črna -> temno siva) -->
    <linearGradient id="trapGradShards" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#000000"/>
      <stop offset="100%" stop-color="#222222"/>
    </linearGradient>

    <!-- Svetlejši gradient za “sheen” (nizek opacity) -->
    <linearGradient id="trapGradSheen" x1="1" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0.0"/>
    </linearGradient>

    <style>
      /* Globalni keyframes: kratka eksplozija z rahlim prehodom in razpadom */
      @keyframes trapExplode {
        0%   { transform: translate(0,0) scale(0.85) rotate(0deg); opacity: 0; }
        12%  { transform: translate(0,0) scale(1.00) rotate(0deg); opacity: 1; }
        100% { transform: translate(0,0) scale(1.00) rotate(0deg); opacity: 0; }
      }

      /* Osnovna nastavitev za celotno skupino – eksplozija */
      g.trap-explode {
        transform-origin: center center;
        animation: trapExplode 0.6s cubic-bezier(.2,.9,.2,1.1) both;
      }

      /* Vsak drobec (shard) ima lasten mikro-gib (SAMO NA <g>!), brez transformacij v pathih */
      /* Harmonično razmetani v vse smeri, z rahlo varianco in zamikom */
      @keyframes move-s1 { 100% { transform: translate(-6px,-5px) rotate(-18deg); } }
      @keyframes move-s2 { 100% { transform: translate( 5px,-6px) rotate( 22deg); } }
      @keyframes move-s3 { 100% { transform: translate(-4px, 6px) rotate(-14deg); } }
      @keyframes move-s4 { 100% { transform: translate( 6px, 5px) rotate( 18deg); } }
      @keyframes move-s5 { 100% { transform: translate(-7px, 2px) rotate(-28deg); } }
      @keyframes move-s6 { 100% { transform: translate( 2px,-7px) rotate( 16deg); } }
      @keyframes move-s7 { 100% { transform: translate( 0px, 7px) rotate( -8deg); } }
      @keyframes move-s8 { 100% { transform: translate( 7px, 0px) rotate( 24deg); } }
      @keyframes move-s9 { 100% { transform: translate(-5px, 0px) rotate(-20deg); } }
      @keyframes move-s10{ 100% { transform: translate( 0px,-5px) rotate( 12deg); } }

      /* Časi, da eksplozija deluje organsko (pri vseh ostane ≤ 0.6s skupno) */
      g.s1  { animation: move-s1 0.6s cubic-bezier(.2,.9,.2,1.1) both; }
      g.s2  { animation: move-s2 0.6s cubic-bezier(.2,.9,.2,1.1) both; }
      g.s3  { animation: move-s3 0.6s cubic-bezier(.2,.9,.2,1.1) both; }
      g.s4  { animation: move-s4 0.6s cubic-bezier(.2,.9,.2,1.1) both; }
      g.s5  { animation: move-s5 0.6s cubic-bezier(.2,.9,.2,1.1) both; }
      g.s6  { animation: move-s6 0.6s cubic-bezier(.2,.9,.2,1.1) both; }
      g.s7  { animation: move-s7 0.6s cubic-bezier(.2,.9,.2,1.1) both; }
      g.s8  { animation: move-s8 0.6s cubic-bezier(.2,.9,.2,1.1) both; }
      g.s9  { animation: move-s9 0.6s cubic-bezier(.2,.9,.2,1.1) both; }
      g.s10 { animation: move-s10 0.6s cubic-bezier(.2,.9,.2,1.1) both; }

      /* Voljaven standard stroke-a */
      .trap-stroke {
        stroke: #111;
        stroke-width: 0.6;
        vector-effect: non-scaling-stroke;
      }
    </style>
  </defs>

  <!-- Glavna skupina: tu je samo 1 animacija (opacity/pop), drobci imajo svoje mikro-gibe v lastnih <g> -->
  <g class="trap-explode" style="transform-origin: center center; animation: trapExplode 0.6s cubic-bezier(.2,.9,.2,1.1) both;">

    <!-- BLOK DROBTIN — vsak shard je lasten <g> (animacija je samo na <g>, pathi brez transformacij) -->
    <!-- Vsak shard ima 2 sloja: base (temen) + sheen (svetlejši) -->

    <!-- s1 -->
    <g class="s1">
      <path class="trap-stroke" fill="url(#trapGradShards)"
            d="M11.0 11.5 L11.8 10.9 L12.3 11.6 L11.4 12.1 Z"/>
      <path class="trap-stroke" fill="url(#trapGradSheen)"
            d="M11.1 11.4 L11.6 11.1 L11.9 11.5 L11.5 11.7 Z"/>
    </g>

    <!-- s2 -->
    <g class="s2">
      <path class="trap-stroke" fill="url(#trapGradShards)"
            d="M12.2 11.1 L13.0 10.6 L13.5 11.2 L12.6 11.7 Z"/>
      <path class="trap-stroke" fill="url(#trapGradSheen)"
            d="M12.3 11.0 L12.8 10.8 L13.1 11.1 L12.7 11.3 Z"/>
    </g>

    <!-- s3 -->
    <g class="s3">
      <path class="trap-stroke" fill="url(#trapGradShards)"
            d="M11.4 12.6 L12.0 12.0 L12.6 12.4 L12.0 13.0 Z"/>
      <path class="trap-stroke" fill="url(#trapGradSheen)"
            d="M11.6 12.4 L11.9 12.2 L12.2 12.4 L11.9 12.7 Z"/>
    </g>

    <!-- s4 -->
    <g class="s4">
      <path class="trap-stroke" fill="url(#trapGradShards)"
            d="M12.9 12.2 L13.8 11.8 L14.0 12.6 L13.1 13.0 Z"/>
      <path class="trap-stroke" fill="url(#trapGradSheen)"
            d="M13.0 12.1 L13.5 11.9 L13.6 12.3 L13.2 12.5 Z"/>
    </g>

    <!-- s5 -->
    <g class="s5">
      <path class="trap-stroke" fill="url(#trapGradShards)"
            d="M10.6 12.0 L11.2 11.3 L11.6 12.0 L11.0 12.6 Z"/>
      <path class="trap-stroke" fill="url(#trapGradSheen)"
            d="M10.8 11.8 L11.0 11.6 L11.3 12.0 L11.0 12.2 Z"/>
    </g>

    <!-- s6 -->
    <g class="s6">
      <path class="trap-stroke" fill="url(#trapGradShards)"
            d="M12.0 10.4 L12.7 10.0 L12.9 10.6 L12.2 11.0 Z"/>
      <path class="trap-stroke" fill="url(#trapGradSheen)"
            d="M12.1 10.3 L12.5 10.1 L12.6 10.4 L12.2 10.6 Z"/>
    </g>

    <!-- s7 -->
    <g class="s7">
      <path class="trap-stroke" fill="url(#trapGradShards)"
            d="M11.7 13.2 L12.4 12.9 L12.6 13.6 L11.9 13.9 Z"/>
      <path class="trap-stroke" fill="url(#trapGradSheen)"
            d="M11.8 13.1 L12.2 13.0 L12.3 13.3 L12.0 13.5 Z"/>
    </g>

    <!-- s8 -->
    <g class="s8">
      <path class="trap-stroke" fill="url(#trapGradShards)"
            d="M13.3 11.3 L14.1 10.9 L14.3 11.6 L13.5 12.0 Z"/>
      <path class="trap-stroke" fill="url(#trapGradSheen)"
            d="M13.4 11.2 L13.8 11.0 L13.9 11.4 L13.5 11.6 Z"/>
    </g>

    <!-- s9 -->
    <g class="s9">
      <path class="trap-stroke" fill="url(#trapGradShards)"
            d="M10.2 11.6 L10.9 11.2 L11.0 11.8 L10.4 12.1 Z"/>
      <path class="trap-stroke" fill="url(#trapGradSheen)"
            d="M10.3 11.5 L10.6 11.3 L10.7 11.6 L10.4 11.8 Z"/>
    </g>

    <!-- s10 -->
    <g class="s10">
      <path class="trap-stroke" fill="url(#trapGradShards)"
            d="M11.6 10.8 L12.3 10.4 L12.5 11.0 L11.8 11.3 Z"/>
      <path class="trap-stroke" fill="url(#trapGradSheen)"
            d="M11.7 10.7 L12.1 10.5 L12.2 10.8 L11.9 11.0 Z"/>
    </g>

    <!-- Dodatni drobni prah (mehkejši občutek eksplozije) -->
    <g class="s2">
      <path class="trap-stroke" fill="#111"
            d="M12.8 12.8 L13.0 12.6 L13.2 12.8 L13.0 13.0 Z"/>
    </g>
    <g class="s5">
      <path class="trap-stroke" fill="#111"
            d="M11.0 10.8 L11.2 10.7 L11.3 10.9 L11.1 11.0 Z"/>
    </g>
    <g class="s7">
      <path class="trap-stroke" fill="#111"
            d="M12.0 13.6 L12.2 13.5 L12.3 13.7 L12.1 13.8 Z"/>
    </g>

  </g>


    `
  },
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
