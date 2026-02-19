import {applyPalette} from "../utils/palettes.js";
import './CustomNumberInput.js';



const stepsSlider = document.getElementById('steps-slider');
const trapsSlider = document.getElementById('traps-slider');
const targetsSlider = document.getElementById('targets-slider');

stepsSlider.oninput = () => document.getElementById('steps-val').textContent = stepsSlider.value;
trapsSlider.oninput = () => document.getElementById('traps-val').textContent = trapsSlider.value;
targetsSlider.oninput = () => document.getElementById(
    'targets-val').textContent = targetsSlider.value;

document.getElementById('play-btn').onclick = () => {
  const i1 = document.getElementById('in1').value;
  const i2 = document.getElementById('in2').value;
  const i3 = document.getElementById('in3').value;
  const i4 = document.getElementById('in4').value;

  const basicNums = [i1, i2, i3, i4].filter(v => v !== '').join('');

  if (!basicNums) {
    alert('Izberi vsaj eno številko!');
    return;
  }

  const steps = parseInt(stepsSlider.value, 10);
  const traps = parseInt(trapsSlider.value, 10);
  const targets = parseInt(targetsSlider.value, 10);

  // Sestavi polni niz parametrov
  // p1m3st5tr10go5
  const fullCombo = `${basicNums}st${steps}tr${traps}go${targets}`;

  // Shrani v Moje igre (kot niz)
  const myGames = JSON.parse(localStorage.getItem('math-game-my-games') || '[]');

  // Preveri če že obstaja
  const exists = myGames.some(
      g => (typeof g === 'string' ? g === fullCombo : g.num === basicNums && g.steps === steps
          && g.traps === traps && g.targets === targets));

  if (!exists) {
    myGames.push(fullCombo);
    localStorage.setItem('math-game-my-games', JSON.stringify(myGames));
  }

  // Preusmerimo na igro s parametri
  window.location.href = `play.html?num=${fullCombo}`;
};

applyPalette();