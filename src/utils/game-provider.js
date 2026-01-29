
export const GameProvider = {
  // Privzeta igra, ki je vedno na voljo
  DEFAULT_GAME: {
    num: 'p10p1',
    steps: 5,
    traps: 30,
    targets: 5,
    title: 'Moja prva igra'
  },

  /**
   * Pridobi vse shranjene igre iz localStorage + privzeto igro.
   */
  getAllGames() {
    const myGamesRaw = JSON.parse(localStorage.getItem('math-game-my-games') || '[]');
    
    // Normalizacija shranjenih iger (nekatere so lahko le nizi, druge objekti)
    const myGames = myGamesRaw.map(game => {
      if (typeof game === 'string') {
        return { num: game, title: 'Shranjena igra' };
      }
      return game;
    });

    // Vedno vrnemo vsaj privzeto igro na začetku, če seznam ni prazen
    // ali pa jo dodamo kot prvo, če uporabnik še nima svojih.
    // Zaenkrat jo bomo dodali na začetek vseh iger.
    return [this.DEFAULT_GAME, ...myGames];
  },

  /**
   * Pretvori objekt igre v URL parameter niz.
   */
  gameToParams(game) {
    const num = game.num;
    const steps = game.steps || 10;
    const traps = game.traps !== undefined ? game.traps : 3;
    const targets = game.targets || 5;
    return `num=${num}&steps=${steps}&traps=${traps}&targets=${targets}`;
  }
};
