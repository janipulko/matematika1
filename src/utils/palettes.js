export const PALETTES = {
  // 1. CVETOČE ČEŠNJE (Sakura Night)
  sakura_night: {
    id: 'sakura_night',
    name: 'Japonski vrt',
    base: [0, 20, 15],
    primary: [348, 100, 86],
    accent: [96, 40, 68],
    muted: [0, 7, 52]
  },

  // 2. DŽUNGLA (Amazonia)
  amazon_jungle: {
    id: 'amazon_jungle',
    name: 'Skrita džungla',
    base: [150, 40, 7],
    primary: [122, 39, 49],
    accent: [45, 100, 51],
    muted: [153, 16, 36]
  },

  // 3. SONČNI ZAHOD (Cyber Sunset)
  sunset_horizon: {
    id: 'sunset_horizon',
    name: 'Zadnji žarek',
    base: [287, 90, 12],
    primary: [23, 100, 50],
    accent: [51, 100, 50],
    muted: [287, 86, 34]
  },

  // 4. MESTO PONOČI (Neon Metropolis)
  neon_city: {
    id: 'neon_city',
    name: 'Neon klic',
    base: [215, 27, 7],
    primary: [212, 100, 67],
    accent: [330, 100, 50],
    muted: [213, 10, 31]
  },

  // 5. SLADKARIJE (Candy Factory)
  candy_land: {
    id: 'candy_land',
    name: 'Sladki svet',
    base: [296, 30, 24],
    primary: [338, 100, 76],
    accent: [162, 45, 66],
    muted: [254, 16, 66]
  },

  // 6. LUNAPARK (Carnival Night)
  carnival_night: {
    id: 'carnival_night',
    name: 'Lunapark',
    base: [240, 43, 18],
    primary: [4, 90, 58],
    accent: [54, 100, 62],
    muted: [231, 48, 64]
  },

  // 7. POLARNI SIJ (Aurora Borealis)
  aurora_night: {
    id: 'aurora_night',
    name: 'Polarni ples',
    base: [207, 95, 8],
    primary: [174, 62, 47],
    accent: [266, 75, 63],
    muted: [212, 29, 36]
  },

  // 8. PUŠČAVSKI SOMRAK (Sahara Twilight)
  sahara_twilight: {
    id: 'sahara_twilight',
    name: 'Peščeni mir',
    base: [22, 47, 18],
    primary: [36, 41, 54],
    accent: [1, 61, 27],
    muted: [25, 57, 38]
  },

  // 9. NOČ ZVEZDNA
  starry_dark: {
    id: 'starry_dark',
    name: 'Noč zvezdna',
    base: [232, 19, 36],
    primary: [345, 100, 88],
    accent: [310, 6, 57],
    muted: [11, 24, 72]
  },

  // 10. MATERIAL DARK
  material: {
    id: 'material',
    name: 'Material Dark',
    base: [0, 0, 7],
    primary: [263, 98, 76],
    accent: [174, 97, 43],
    muted: [0, 0, 62]
  },

  // 11. OCEAN NIGHT
  ocean_night: {
    id: 'ocean_night',
    name: 'Ocean Night',
    base: [195, 100, 16],
    primary: [190, 100, 42],
    accent: [190, 75, 59],
    muted: [190, 80, 75]
  },

  // 12. BLACKBERRY
  blackberry: {
    id: 'blackberry',
    name: 'Blackberry friendly',
    base: [0, 0, 7],
    primary: [217, 89, 76],
    accent: [349, 52, 61],
    muted: [0, 0, 46]
  },

  // 13. TEMNA PISANA
  dark_vibrant: {
    id: 'dark_vibrant',
    name: 'Temna pisana',
    base: [248, 53, 21],
    primary: [136, 65, 67],
    accent: [52, 90, 75],
    muted: [0, 0, 65]
  },

  // 14. NOČNA JESEN
  autumn_night: {
    id: 'autumn_night',
    name: 'Nočna jesen',
    base: [311, 20, 21],
    primary: [327, 100, 80],
    accent: [331, 66, 52],
    muted: [318, 7, 59]
  },

  // 15. ZVEZDNI DAN
  stellar: {
    id: 'stellar',
    name: 'Zvezdni dan',
    base: [260, 97, 23],
    primary: [51, 98, 70],
    accent: [336, 100, 78],
    muted: [256, 21, 61]
  },

  // 16. HLADNA NOČ
  cold_night: {
    id: 'cold_night',
    name: 'Hladna noč',
    base: [223, 86, 33],
    primary: [330, 100, 86],
    accent: [331, 69, 77],
    muted: [224, 52, 70]
  }
};

function getRandomKey() {
  const keys = Object.keys(PALETTES);
  return keys[Math.floor(Math.random() * keys.length)];
}

export function applyRandomPalette() {
  applyPaletteByKey(getRandomKey())
}

export function applyPalette() {
  const paletteId = localStorage.getItem('math-game-palette');
  const key = paletteId || getRandomKey();
  applyPaletteByKey(key);
}

export function applyPaletteByKey(key) {
  const p = PALETTES[key];
  if (!p) return;

  const root = document.documentElement;
  const [bh, bs, bl] = p.base;
  const [ph, ps, pl] = p.primary;
  const [ah, as, al] = p.accent;
  const [mh, ms, ml] = p.muted;

  const colors = {
    '--bg': `hsla(${bh}, ${bs}%, ${bl}%, 1)`,
    '--card': `hsla(${bh}, ${bs + 5}%, ${bl - 5}%, 1)`,
    '--bubble': `hsla(${bh}, ${bs}%, ${bl + 10}%, 1)`,
    '--bubble-2': `hsla(${bh}, ${bs -10}%, ${bl - 6}%, 0.7)`,
    '--ink': `hsla(${ph}, 20%, 95%, 1)`,
    
    '--primary': `hsla(${ph}, ${ps}%, ${pl}%, 1)`,
    '--primary-d': `hsla(${ph}, ${ps}%, ${pl - 15}%, 1)`,
    '--on-primary': pl > 70 ? '#000000' : '#ffffff',

    '--accent': `hsla(${ah}, ${as}%, ${al}%, 1)`,
    '--on-accent': al > 70 ? '#000000' : '#ffffff',

    '--muted': `hsla(${mh}, ${ms}%, ${ml}%, 1)`,

    // Operacije - prilagojene s saturacijo palete
    '--pos-bg': `hsla(140, ${Math.min(ps, 40)}%, 90%, 1)`,
    '--pos-ink': `hsla(140, ${Math.min(ps, 60)}%, 25%, 1)`,
    '--neg-bg': `hsla(0, ${Math.min(ps, 50)}%, 90%, 1)`,
    '--neg-ink': `hsla(0, ${Math.min(ps, 60)}%, 30%, 1)`,
    '--mul-bg': `hsla(210, ${Math.min(ps, 50)}%, 90%, 1)`,
    '--mul-ink': `hsla(210, ${Math.min(ps, 70)}%, 35%, 1)`,
    '--div-bg': `hsla(50, ${Math.min(ps, 60)}%, 90%, 1)`,
    '--div-ink': `hsla(50, ${Math.min(ps, 80)}%, 30%, 1)`,

    '--grid-fill': `hsla(${ph}, ${ps}%, ${pl}%, 0.4)`,
    '--grid-stroke': `hsla(${mh}, ${ms}%, ${ml}%, 0.6)`,
    '--radius': 'clamp(4px, 1vh, 10px)',
    '--radius-sm': 'clamp(3px, 0.8vh, 7px)'
  };

  for (const [prop, val] of Object.entries(colors)) {
    root.style.setProperty(prop, val);
  }

  localStorage.setItem('math-game-palette', key);
}



