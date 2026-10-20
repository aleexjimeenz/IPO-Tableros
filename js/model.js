export class TableroModel {
  constructor() {
    this.dimension = 4;
    this.tamanoFicha = 'mediana';
    this.temaAspecto = 'clasico';
    this.numTipos = 5;
    this.grid = [];
  }

  inicializarJuego() {
    this.grid = [];
    const filasTipos = [];

    for (let r = 0; r < this.dimension; r++) {
      filasTipos.push(r % this.numTipos);
    }

    for (let r = 0; r < this.dimension; r++) {
      const tipo = filasTipos[r];
      for (let c = 0; c < this.dimension; c++) {
        this.grid.push({ id: `ficha-${r}-${c}`, tipo: tipo });
      }
    }

    this.mezclarTablero();
    if (this.comprobarVictoria()) {
      this.mezclarTablero();
    }
  }

  mezclarTablero() {
    for (let i = this.grid.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.grid[i], this.grid[j]] = [this.grid[j], this.grid[i]];
    }
  }

  intercambiarFichas(origenIndex, destinoIndex) {
    if (
      origenIndex < 0 ||
      origenIndex >= this.grid.length ||
      destinoIndex < 0 ||
      destinoIndex >= this.grid.length
    ) {
      return false;
    }

    [this.grid[origenIndex], this.grid[destinoIndex]] = [
      this.grid[destinoIndex],
      this.grid[origenIndex]
    ];
    return true;
  }

  comprobarVictoria() {
    const N = this.dimension;
    for (let r = 0; r < N; r++) {
      const primerTipo = this.grid[r * N].tipo;
      for (let c = 1; c < N; c++) {
        if (this.grid[r * N + c].tipo !== primerTipo) {
          return false;
        }
      }
    }
    return true;
  }

  setDimension(dim) {
    this.dimension = parseInt(dim, 10);
  }

  setTamanoFicha(tam) {
    this.tamanoFicha = tam;
  }

  setTemaAspecto(tema) {
    this.temaAspecto = tema;
  }
}