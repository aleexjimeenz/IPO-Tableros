export class TableroView {
  constructor() {
    this.tableroElement = document.getElementById('tablero');
    this.modalInstrucciones = document.getElementById('modal-instrucciones');
    this.modalVictoria = document.getElementById('modal-victoria');
    this.btnCerrarModal = document.getElementById('btn-cerrar-modal');
    this.btnEntendido = document.getElementById('btn-entendido');
    this.btnInstrucciones = document.getElementById('btn-instrucciones');
    this.btnVictoriaReiniciar = document.getElementById('btn-victoria-reiniciar');
    this.selectDimension = document.getElementById('select-dimension');
    this.selectTamano = document.getElementById('select-tamano');
    this.selectTema = document.getElementById('select-tema');
    this.btnNuevoJuego = document.getElementById('btn-nuevo-juego');
  }

  renderTablero(grid, dimension, tamanoFicha, temaAspecto) {
    this.tableroElement.innerHTML = '';
    this.tableroElement.style.gridTemplateColumns = `repeat(${dimension}, 1fr)`;
    this.tableroElement.dataset.tamano = tamanoFicha;
    this.tableroElement.dataset.tema = temaAspecto;

    const sizePx = Math.min(480, Math.max(300, dimension * 90));
    this.tableroElement.style.width = `${sizePx}px`;
    this.tableroElement.style.height = `${sizePx}px`;

    grid.forEach((celdaData, index) => {
      const celda = document.createElement('div');
      celda.classList.add('celda');
      celda.dataset.index = index;

      const ficha = document.createElement('div');
      ficha.classList.add('ficha');
      ficha.setAttribute('draggable', 'true');
      ficha.dataset.index = index;
      ficha.dataset.tipo = celdaData.tipo;

      celda.appendChild(ficha);
      this.tableroElement.appendChild(celda);
    });
  }

  mostrarInstrucciones() {
    this.modalInstrucciones.classList.remove('hidden');
    this.modalInstrucciones.setAttribute('aria-hidden', 'false');
  }

  ocultarInstrucciones() {
    this.modalInstrucciones.classList.add('hidden');
    this.modalInstrucciones.setAttribute('aria-hidden', 'true');
  }

  mostrarVictoria() {
    this.modalVictoria.classList.remove('hidden');
    this.modalVictoria.setAttribute('aria-hidden', 'false');
  }

  ocultarVictoria() {
    this.modalVictoria.classList.add('hidden');
    this.modalVictoria.setAttribute('aria-hidden', 'true');
  }

  marcarArrastreInicio(fichaElement) {
    fichaElement.classList.add('dragging');
  }

  desmarcarArrastreFin(fichaElement) {
    if (fichaElement) fichaElement.classList.remove('dragging');
  }

  marcarCeldaSobre(celdaElement) {
    celdaElement.classList.add('drag-over');
  }

  desmarcarCeldaSobre(celdaElement) {
    celdaElement.classList.remove('drag-over');
  }
}