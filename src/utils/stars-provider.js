/**
 * StarsProvider.js
 * Centralizirana logika za upravljanje z zvezdicami.
 * Deluje kot posrednik (hub) med komponentami in localStorage.
 * Temelji na dogodkih za zagotavljanje sinhronizacije.
 */

const STORAGE_KEY = 'math-game-total-stars';
const RECORDS_KEY = 'math-game-records';

export const StarsProvider = {
  /**
   * Inicializacija providerja - postavi poslušalce dogodkov.
   */
  init() {
    // Poslušamo zahteve za dodajanje zvezdic
    document.addEventListener('stars-request-add', (e) => {
      const amount = parseInt(e.detail.amount, 10) || 0;
      this.addStars(amount);
    });

    // Poslušamo zahteve za porabo zvezdic
    document.addEventListener('stars-request-spend', (e) => {
      const amount = parseInt(e.detail.amount, 10) || 0;
      this.spendStars(amount);
    });

    // Poslušamo zahteve za shranjevanje rekordov
    document.addEventListener('record-request-save', (e) => {
      const { gameId, score } = e.detail;
      if (gameId && score !== undefined) {
        this.saveRecord(gameId, score);
      }
    });

    // Sprožimo začetni dogodek, da se komponente lahko sinhronizirajo ob nalaganju
    this._broadcast();
    
    console.log('StarsProvider initialized');
  },

  /**
   * Vrne trenutno število zvezdic.
   */
  getTotalStars() {
    return parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10);
  },

  /**
   * Doda zvezdice v storage in obvesti okolico.
   */
  addStars(amount) {
    if (amount <= 0) return;
    const current = this.getTotalStars();
    const newTotal = current + amount;
    localStorage.setItem(STORAGE_KEY, newTotal);
    this._broadcast();
  },

  /**
   * Odšteje zvezdice iz storage in obvesti okolico.
   */
  spendStars(amount) {
    if (amount <= 0) return;
    const current = this.getTotalStars();
    if (current >= amount) {
      const newTotal = current - amount;
      localStorage.setItem(STORAGE_KEY, newTotal);
      this._broadcast();
      return true;
    }
    return false;
  },

  /**
   * Vrne vse rekorde.
   */
  getRecords() {
    try {
      return JSON.parse(localStorage.getItem(RECORDS_KEY) || '{}');
    } catch (e) {
      return {};
    }
  },

  /**
   * Vrne rekord za določeno igro.
   */
  getRecord(gameId) {
    const records = this.getRecords();
    return records[gameId] || 0;
  },

  /**
   * Shrani rekord za določeno igro, če je boljši od obstoječega.
   */
  saveRecord(gameId, score) {
    const records = this.getRecords();
    const currentRecord = records[gameId] || 0;
    if (score > currentRecord) {
      records[gameId] = score;
      localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
      
      // Obvestimo o novem rekordu
      document.dispatchEvent(new CustomEvent('record-updated', {
        detail: { gameId, score },
        bubbles: true,
        composed: true
      }));
      return true;
    }
    return false;
  },

  /**
   * Oddaja dogodek o spremembi stanja zvezdic.
   */
  _broadcast() {
    const total = this.getTotalStars();
    document.dispatchEvent(new CustomEvent('stars-updated', {
      detail: { totalStars: total },
      bubbles: true,
      composed: true
    }));
  }
};

// Samodejna inicializacija ob uvozu, če smo v brskalniku
if (typeof window !== 'undefined') {
  StarsProvider.init();
}
