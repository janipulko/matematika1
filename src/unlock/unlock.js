import { applyPalette } from '../utils/palettes.js';

document.addEventListener('DOMContentLoaded', () => {
  applyPalette();
  
  // Poslušamo posodobitve zvezdic za celo stran (ne le shadow DOM)
  document.addEventListener('stars-updated', (e) => {
    const badge = document.querySelector('.stars-badge span');
    if (badge) {
      badge.textContent = e.detail.totalStars;
    }
  });
  
  // Prvotna inicializacija zvezdic, če so že na voljo v localStorage
  const savedStars = localStorage.getItem('math-game-total-stars');
  if (savedStars) {
    const badge = document.querySelector('.stars-badge span');
    if (badge) {
      badge.textContent = savedStars;
    }
  }
});
