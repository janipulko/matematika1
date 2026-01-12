

export const PALETTES = {
  // SVETLE PALETE
  candy: {
    id: 'candy',
    name: 'Candy Land',
    type: 'light',
    colors: {
      '--bg': '#FFB6C1',
      '--card': '#FFFFFF',
      '--ink': '#34495E',
      '--primary': '#6A1B9A',     // temnejša vijolična (kontrastno)
      '--primary-d': '#4A148C',   // hover/active še temnejši
      '--accent': '#FFD54F',
      '--muted': '#7F8C8D',
      '--bubble': '#FADBD8'
    }
  },
  ocean: {
    id: 'ocean',
    name: 'Ocean Adventure',
    type: 'light',
    colors: {
      '--bg': '#00B4D8',
      '--card': '#FFFFFF',
      '--ink': '#112D4E',
      '--primary': '#002F6C',     // globlja modra za visoko kontrastnost
      '--primary-d': '#00224F',
      '--accent': '#FFD54F',
      '--muted': '#3F72AF',
      '--bubble': '#CAF0F8'
    }
  },
  forest: {
    id: 'forest',
    name: 'Forest Friends',
    type: 'light',
    colors: {
      '--bg': '#A3D9A5',
      '--card': '#FFFFFF',
      '--ink': '#334D3A',
      '--primary': '#0B4F6C',     // temen teal (bolj kontrasten kot rumeni odtenki)
      '--primary-d': '#083B52',
      '--accent': '#66BB6A',
      '--muted': '#4E6E5D',
      '--bubble': '#E8F5E9'
    }
  },
  rainbow: {
    id: 'rainbow',
    name: 'Rainbow Dreams',
    type: 'light',
    colors: {
      '--bg': '#FFD1DC',
      '--card': '#FFFFFF',
      '--ink': '#2C3E50',
      '--primary': '#0D47A1',     // material blue 900 (visok kontrast)
      '--primary-d': '#0A3780',
      '--accent': '#F7DC6F',
      '--muted': '#7D8387',
      '--bubble': '#EBDEF0'
    }
  },
  fresh: {
    id: 'fresh',
    name: 'Sveže živahno',
    type: 'light',
    colors: {
      '--bg': '#C6EBC5',
      '--card': '#FFFFFF',
      '--ink': '#22313F',
      '--primary': '#1E3A8A',     // indigo 700 (močnejši kontrast)
      '--primary-d': '#162D6A',
      '--accent': '#A1EEBD',
      '--muted': '#5D6D7E',
      '--bubble': '#F2FFE9'
    }
  },
  summer: {
    id: 'summer',
    name: 'Poletni žarek',
    type: 'light',
    colors: {
      '--bg': '#FFF455',
      '--card': '#FFFFFF',
      '--ink': '#2C3E50',
      '--primary': '#2B6EA6',     // precej temen (varno nad pragom)
      '--primary-d': '#1F537D',
      '--accent': '#FFC470',
      '--muted': '#5D6D7E',
      '--bubble': '#FFFFE0'
    }
  },
  cute: {
    id: 'cute',
    name: 'Srčkana vesela',
    type: 'light',
    colors: {
      '--bg': '#FFEAA7',
      '--card': '#FFFFFF',
      '--ink': '#1B2631',
      '--primary': '#A84300',     // temna oranžna (ne več pastelna)
      '--primary-d': '#8E3B00',
      '--accent': '#81ECEC',
      '--muted': '#566573',
      '--bubble': '#FFF9E1'
    }
  },
  fruit: {
    id: 'fruit',
    name: 'Mirna sadna',
    type: 'light',
    colors: {
      '--bg': '#F9F07A',
      '--card': '#FFFFFF',
      '--ink': '#1C2833',
      '--primary': '#255E6B',     // temen teal za kontrast na svetlo rumenem
      '--primary-d': '#1D4A54',
      '--accent': '#FF9F66',
      '--muted': '#5D6D7E',
      '--bubble': '#FEFDEB'
    }
  },

  // TEMNE PALETE
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
  if (!palette) return;

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
