export class TableroController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.origenIndex = null;
  }

  init() {
    this.model.inicializarJuego();
    this.actualizarVista();
    this.bindEvents();
  }

  actualizarVista() {
    this.view.renderTablero(
      this.model.grid,
      this.model.dimension,
      this.model.tamanoFicha,
      this.model.temaAspecto
    );
  }

  bindEvents() {
    this.view.selectDimension.addEventListener('change', (e) => {
      this.model.setDimension(e.target.value);
      this.reiniciarJuego();
    });

    this.view.selectTamano.addEventListener('change', (e) => {
      this.model.setTamanoFicha(e.target.value);
      this.actualizarVista();
    });

    this.view.selectTema.addEventListener('change', (e) => {
      this.model.setTemaAspecto(e.target.value);
      this.actualizarVista();
    });

    this.view.btnNuevoJuego.addEventListener('click', () => {
      this.reiniciarJuego();
    });

    this.view.btnInstrucciones.addEventListener('click', () => {
      this.view.mostrarInstrucciones();
    });

    this.view.btnCerrarModal.addEventListener('click', () => {
      this.view.ocultarInstrucciones();
    });

    this.view.btnEntendido.addEventListener('click', () => {
      this.view.ocultarInstrucciones();
    });

    this.view.btnVictoriaReiniciar.addEventListener('click', () => {
      this.view.ocultarVictoria();
      this.reiniciarJuego();
    });

    // API Drag & Drop
    const tablero = this.view.tableroElement;

    tablero.addEventListener('dragstart', (e) => {
      const ficha = e.target.closest('.ficha');
      if (!ficha) return;
      this.origenIndex = parseInt(ficha.dataset.index, 10);
      e.dataTransfer.setData('text/plain', this.origenIndex);
      e.dataTransfer.effectAllowed = 'move';
      this.view.marcarArrastreInicio(ficha);
    });

    tablero.addEventListener('dragend', (e) => {
      const ficha = e.target.closest('.ficha');
      this.view.desmarcarArrastreFin(ficha);
      this.origenIndex = null;
    });

    tablero.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    });

    tablero.addEventListener('dragenter', (e) => {
      e.preventDefault();
      const celda = e.target.closest('.celda');
      if (celda) this.view.marcarCeldaSobre(celda);
    });

    tablero.addEventListener('dragleave', (e) => {
      const celda = e.target.closest('.celda');
      if (celda && !celda.contains(e.relatedTarget)) {
        this.view.desmarcarCeldaSobre(celda);
      }
    });

    tablero.addEventListener('drop', (e) => {
      e.preventDefault();
      const celda = e.target.closest('.celda');
      if (!celda) return;

      this.view.desmarcarCeldaSobre(celda);
      const destinoIndex = parseInt(celda.dataset.index, 10);

      if (this.origenIndex !== null && this.origenIndex !== destinoIndex) {
        const exito = this.model.intercambiarFichas(this.origenIndex, destinoIndex);
        if (exito) {
          this.actualizarVista();
          if (this.model.comprobarVictoria()) {
            setTimeout(() => this.view.mostrarVictoria(), 150);
          }
        }
      }
    });
  }

  reiniciarJuego() {
    this.model.inicializarJuego();
    this.actualizarVista();
  }
}