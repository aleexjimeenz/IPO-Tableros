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

    // Gestión completa del ciclo de eventos Drag & Drop API[cite: 12, 13]
    const tablero = this.view.tableroElement;

    // Evento dragstart: establece información a transferir con dataTransfer[cite: 12, 15, 16]
    tablero.addEventListener('dragstart', (e) => {
      const ficha = e.target.closest('canvas.ficha');
      if (!ficha) return;

      this.origenIndex = parseInt(ficha.dataset.index, 10);
      e.dataTransfer.setData('text/plain', this.origenIndex.toString()); // Transferencia MIME text/plain[cite: 16]
      e.dataTransfer.effectAllowed = 'move';
      this.view.marcarArrastreInicio(ficha);
    });

    // Evento dragend: cancelación o fin del arrastre[cite: 12, 13]
    tablero.addEventListener('dragend', (e) => {
      const ficha = e.target.closest('canvas.ficha');
      this.view.desmarcarArrastreFin(ficha);
      this.origenIndex = null;
    });

    // Evento dragover: preventDefault() OBLIGATORIO para permitir el soltado (drop)[cite: 13, 14, 15]
    tablero.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    });

    // Evento dragenter: entrada en zona destino[cite: 12, 13, 14]
    tablero.addEventListener('dragenter', (e) => {
      e.preventDefault();
      const celda = e.target.closest('.celda');
      if (celda) this.view.marcarCeldaSobre(celda);
    });

    // Evento dragleave: salida de zona destino[cite: 12, 13, 14]
    tablero.addEventListener('dragleave', (e) => {
      const celda = e.target.closest('.celda');
      if (celda && !celda.contains(e.relatedTarget)) {
        this.view.desmarcarCeldaSobre(celda);
      }
    });

    // Evento drop: recibe la información y evita redirección por defecto del navegador[cite: 12, 13, 14, 16]
    tablero.addEventListener('drop', (e) => {
      e.preventDefault(); // Previene comportamientos automáticos del navegador[cite: 13, 14, 16]
      const celda = e.target.closest('.celda');
      if (!celda) return;

      this.view.desmarcarCeldaSobre(celda);
      const destinoIndex = parseInt(celda.dataset.index, 10);

      // Recuperación mediante dataTransfer[cite: 16]
      const origenTransferido = parseInt(e.dataTransfer.getData('text/plain'), 10);
      const idxOrigen = isNaN(origenTransferido) ? this.origenIndex : origenTransferido;

      if (idxOrigen !== null && idxOrigen !== destinoIndex) {
        const exito = this.model.intercambiarFichas(idxOrigen, destinoIndex);
        if (exito) {
          this.actualizarVista();
          if (this.model.comprobarVictoria()) {
            this.view.iniciarAnimacionVictoria(this.model.temaAspecto);
            setTimeout(() => this.view.mostrarVictoria(), 250);
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