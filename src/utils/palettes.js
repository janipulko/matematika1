export const PALETTES = {

// 1. CVETOČE ČEŠNJE (Sakura Night) - Japonski mir, kontrast rjavega lesa in nežnih cvetov
  sakura_night: {
    id: 'sakura_night',
    name: 'Japonski vrt',
    type: 'dark',
    colors: {
      '--bg': '#2D1E1E',       // Temen lesni ton
      '--card': '#1C1212',     // Globoka snov drevesa
      '--ink': '#FFF0F5',      // Nežna bela (cvetni lističi)
      '--primary': '#FFB7C5',  // Sakura rožnata
      '--primary-d': '#E098A7',
      '--accent': '#A7D08C',   // Mlado zeleno listje
      '--muted': '#8D7B7B',    // Megla pod goro Fuji
      '--bubble': '#3D2B2B'
    }
  },

  // 2. DŽUNGLA (Amazonia) - Globoke zelene plasti in eksotični ptiči
  amazon_jungle: {
    id: 'amazon_jungle',
    name: 'Skrita džungla',
    type: 'dark',
    colors: {
      '--bg': '#0B1A13',       // Globoka senca krošenj
      '--card': '#050F0A',     // Srce gozda
      '--ink': '#E8F5E9',      // Svetloba, ki prodre skozi liste
      '--primary': '#4CAF50',  // Živo zelena
      '--primary-d': '#388E3C',
      '--accent': '#FFC107',   // Kljun eksotične ptice (zlato)
      '--muted': '#4E6B5E',    // Mah in lišaji
      '--bubble': '#142E22'
    }
  },

  // 3. SONČNI ZAHOD (Cyber Sunset) - Prehod iz ognjene v vijolično nebo
  sunset_horizon: {
    id: 'sunset_horizon',
    name: 'Zadnji žarek',
    type: 'dark',
    colors: {
      '--bg': '#2D033B',       // Večerno nebo
      '--card': '#16001E',     // Silhueta obzorja
      '--ink': '#FFE5E5',      // Odsev na oblakih
      '--primary': '#FF6000',  // Sončni ogenj
      '--primary-d': '#D35400',
      '--accent': '#FFD700',   // Zadnji zlat sij
      '--muted': '#810CA1',    // Somrak
      '--bubble': '#410B53'
    }
  },

  // 4. MESTO PONOČI (Neon Metropolis) - Hladno steklo in utripajoči neon
  neon_city: {
    id: 'neon_city',
    name: 'Neon klic',
    type: 'dark',
    colors: {
      '--bg': '#0D1117',       // Temen asfalt
      '--card': '#010409',     // Steklo nebotičnika
      '--ink': '#F0F6FC',      // Digitalni zasloni
      '--primary': '#58A6FF',  // Modri neon
      '--primary-d': '#1F6FEB',
      '--accent': '#FF007F',   // Rožnata reklama
      '--muted': '#484F58',    // Megla nad mestom
      '--bubble': '#161B22'
    }
  },

  // 5. SLADKARIJE (Candy Factory) - Pasteli, ki spominjajo na lizike in sladkorno peno
  candy_land: {
    id: 'candy_land',
    name: 'Sladki svet',
    type: 'dark',
    colors: {
      '--bg': '#4D2A4F',       // Borovničev žele
      '--card': '#311D3F',     // Čokoladni preliv
      '--ink': '#FFFFFF',      // Sladkor v prahu
      '--primary': '#FF85B3',  // Žvečilni gumi rožnata
      '--primary-d': '#E06A9A',
      '--accent': '#7FD1B9',   // Meta bonbon
      '--muted': '#A29BB7',    // Sladkorna pena
      '--bubble': '#603663'
    }
  },

  // 6. LUNAPARK (Carnival Night) - Energija, luči in veselje pod luno
  carnival_night: {
    id: 'carnival_night',
    name: 'Lunapark',
    type: 'dark',
    colors: {
      '--bg': '#1A1A40',       // Globoko modro nebo
      '--card': '#11112D',     // Konstrukcija vrtiljaka
      '--ink': '#FFF9C4',      // Svetloba žarnic
      '--primary': '#F44336',  // Šotorsko rdeča
      '--primary-d': '#C62828',
      '--accent': '#FFEB3B',   // Zlata vstopnica
      '--muted': '#7986CB',    // Nočni sij
      '--bubble': '#27275C'
    }
  },

  // 7. POLARNI SIJ (Aurora Borealis) - Ples magičnih barv na severu
  aurora_night: {
    id: 'aurora_night',
    name: 'Polarni ples',
    type: 'dark',
    colors: {
      '--bg': '#011627',       // Arktična noč
      '--card': '#010C16',     // Ledeni ocean
      '--ink': '#E0FBFC',      // Sneg pod luno
      '--primary': '#2EC4B6',  // Aurora turkizna
      '--primary-d': '#249B91',
      '--accent': '#9B5DE5',   // Vijolično valovanje
      '--muted': '#415A77',    // Temne skale
      '--bubble': '#022C44'
    }
  },

  // 8. PUŠČAVSKI SOMRAK (Sahara Twilight) - Topel pesek in ohlajajoče nebo
  sahara_twilight: {
    id: 'sahara_twilight',
    name: 'Peščeni mir',
    type: 'dark',
    colors: {
      '--bg': '#432818',       // Globok rjav pesek
      '--card': '#2E1A0F',     // Podzemna jama v puščavi
      '--ink': '#FFE6A7',      // Svetloba zvezd na sipinah
      '--primary': '#BB9457',  // Barva sipin
      '--primary-d': '#997B46',
      '--accent': '#6F1D1B',   // Kanček puščavske rože
      '--muted': '#99582A',    // Suha trava
      '--bubble': '#5A371F'
    }
  },

  starry_dark: {
    id: 'starry_dark',
    name: 'Noč zvezdna',
    type: 'dark',
    colors: {
      '--bg': '#4A4E6D',
      '--card': '#22223B',
      '--ink': '#F9FFC6',
      '--primary': '#FFC2D1',     // svetlejša rožnata (dvignjen kontrast)
      '--primary-d': '#FFA6BE',
      '--accent': '#9A8C98',
      '--muted': '#C9ADA7',
      '--bubble': '#414461'
    }
  },
  material: {
    id: 'material',
    name: 'Material Dark',
    type: 'dark',
    colors: {
      '--bg': '#121212',
      '--card': '#1E1E1E',
      '--ink': '#E0E0E0',
      '--primary': '#BB86FC',
      '--primary-d': '#9965F4',
      '--accent': '#03DAC6',
      '--muted': '#9E9E9E',
      '--bubble': '#2C2C2C'
    }
  },
  ocean_night: {
    id: 'ocean_night',
    name: 'Ocean Night',
    type: 'dark',
    colors: {
      '--bg': '#003F53',
      '--card': '#002B39',
      '--ink': '#F0F0F0',
      '--primary': '#00B4D8',
      '--primary-d': '#0096B4',
      '--accent': '#48CAE4',
      '--muted': '#90E0EF',
      '--bubble': '#004E66'
    }
  },
  blackberry: {
    id: 'blackberry',
    name: 'Blackberry friendly',
    type: 'dark',
    colors: {
      '--bg': '#121212',
      '--card': '#1A1A1A',
      '--ink': '#E0E0E0',
      '--primary': '#8AB4F8',     // svetla modra namesto pretemne
      '--primary-d': '#669DF6',
      '--accent': '#CF6679',
      '--muted': '#757575',
      '--bubble': '#212121'
    }
  },
  dark_vibrant: {
    id: 'dark_vibrant',
    name: 'Temna pisana',
    type: 'dark',
    colors: {
      '--bg': '#211951',
      '--card': '#150E36',
      '--ink': '#FFFFFF',
      '--primary': '#74E291',
      '--primary-d': '#5AC275',
      '--accent': '#F7E987',
      '--muted': '#A5A5A5',
      '--bubble': '#2A2066'
    }
  },
  autumn_night: {
    id: 'autumn_night',
    name: 'Nočna jesen',
    type: 'dark',
    colors: {
      '--bg': '#402B3A',
      '--card': '#2E1F2A',
      '--ink': '#F8F4EC',
      '--primary': '#FF9BD2',
      '--primary-d': '#E07FB4',
      '--accent': '#D63484',
      '--muted': '#A0909B',
      '--bubble': '#4F3648'
    }
  },
  stellar: {
    id: 'stellar',
    name: 'Zvezdni dan',
    type: 'dark',
    colors: {
      '--bg': '#280274',
      '--card': '#1C0152',
      '--ink': '#E9F6FF',
      '--primary': '#FDE767',
      '--primary-d': '#D9C557',
      '--accent': '#FF90BC',
      '--muted': '#9186B1',
      '--bubble': '#350394'
    }
  },
  cold_night: {
    id: 'cold_night',
    name: 'Hladna noč',
    type: 'dark',
    colors: {
      '--bg': '#0C359E',
      '--card': '#08256E',
      '--ink': '#FFF67E',
      '--primary': '#FFB5DA',
      '--primary-d': '#E09BBF',
      '--accent': '#EE99C2',
      '--muted': '#8EA2D9',
      '--bubble': '#1044CC'
    }
  }
};

export function applyPalette(paletteId) {
  const palette = PALETTES[paletteId];
  if (!palette) {
    return;
  }

  const root = document.documentElement;
  Object.entries(palette.colors).forEach(([property, value]) => {
    root.style.setProperty(property, value);
  });

  // Prilagodi barve operacij glede na tip palete za optimalen kontrast
  if (palette.type === 'dark') {
    root.style.setProperty('--pos-bg', '#1B5E20');
    root.style.setProperty('--pos-ink', '#C8E6C9');
    root.style.setProperty('--neg-bg', '#B71C1C');
    root.style.setProperty('--neg-ink', '#FFCDD2');
    root.style.setProperty('--mul-bg', '#01579B');
    root.style.setProperty('--mul-ink', '#E1F5FE');
    root.style.setProperty('--div-bg', '#E65100');
    root.style.setProperty('--div-ink', '#FFF3E0');

    root.style.setProperty('--on-primary', '#000000');
    root.style.setProperty('--on-accent', '#000000');

    root.style.setProperty('--grid-fill', palette.colors['--primary']);
    root.style.setProperty('--grid-stroke', 'rgba(255,255,255,0.1)');
  } else {
    root.style.setProperty('--pos-bg', '#C8E6C9');
    root.style.setProperty('--pos-ink', '#194d23');
    root.style.setProperty('--neg-bg', '#FFCDD2');
    root.style.setProperty('--neg-ink', '#7a1c1c');
    root.style.setProperty('--mul-bg', '#E1F5FE');
    root.style.setProperty('--mul-ink', '#01579B');
    root.style.setProperty('--div-bg', '#FFF3E0');
    root.style.setProperty('--div-ink', '#E65100');

    root.style.setProperty('--on-primary', '#FFFFFF');
    root.style.setProperty('--on-accent', '#000000');

    root.style.setProperty('--grid-fill', '#FFE082');
    root.style.setProperty('--grid-stroke', '#dfe7ef');
  }

  // Posebni popravki za določene palete za zagotavljanje kontrasta
  if (paletteId === 'material') {
    root.style.setProperty('--on-primary', '#000000');
  } else if (paletteId === 'ocean_night') {
    root.style.setProperty('--on-primary', '#FFFFFF');
  } else if (paletteId === 'blackberry') {
    root.style.setProperty('--on-primary', '#FFFFFF');
  } else if (paletteId === 'dark_vibrant') {
    root.style.setProperty('--on-primary', '#000000');
  } else if (paletteId === 'autumn_night') {
    root.style.setProperty('--on-primary', '#000000');
  } else if (paletteId === 'stellar') {
    root.style.setProperty('--on-primary', '#000000');
  } else if (paletteId === 'cold_night') {
    root.style.setProperty('--on-primary', '#000000');
  } else if (paletteId === 'starry_dark') {
    root.style.setProperty('--on-primary', '#000000');
  }

  localStorage.setItem('math-game-palette', paletteId);
}
