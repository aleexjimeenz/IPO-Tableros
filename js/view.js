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

    this.animacionId = null;

    // Paletas cromáticas para dibujar en Canvas 2D según el tema[cite: 4]
    this.paletas = {
      clasico: ['hsl(12, 85%, 58%)', 'hsl(205, 85%, 52%)', 'hsl(145, 75%, 42%)', 'hsl(280, 75%, 60%)', 'hsl(40, 95%, 50%)'],
      neon: ['hsl(320, 100%, 55%)', 'hsl(180, 100%, 45%)', 'hsl(60, 100%, 50%)', 'hsl(270, 100%, 65%)', 'hsl(30, 100%, 55%)'],
      pastel: ['hsl(350, 70%, 75%)', 'hsl(210, 70%, 75%)', 'hsl(150, 60%, 72%)', 'hsl(270, 60%, 80%)', 'hsl(45, 80%, 70%)']
    };
  }

  renderTablero(grid, dimension, tamanoFicha, temaAspecto) {
    if (this.animacionId) {
      cancelAnimationFrame(this.animacionId);
      this.animacionId = null;
    }

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

      // Creación del elemento <canvas> como elemento origen arrastrable[cite: 3, 12]
      const canvasFicha = document.createElement('canvas');
      canvasFicha.classList.add('ficha');
      canvasFicha.setAttribute('draggable', 'true'); // Drag & Drop API[cite: 12]
      canvasFicha.dataset.index = index;             // Atributo data-*[cite: 17]
      canvasFicha.dataset.tipo = celdaData.tipo;

      // Resolución interna del Canvas
      canvasFicha.width = 120;
      canvasFicha.height = 120;

      // Renderizado 2D de la figura geométrica[cite: 3]
      this.dibujarFichaCanvas(canvasFicha, celdaData.tipo, temaAspecto);

      celda.appendChild(canvasFicha);
      this.tableroElement.appendChild(celda);
    });
  }

  // Uso de CanvasRenderingContext2D, rectángulos, caminos y arcos[cite: 3, 4, 5, 6]
  dibujarFichaCanvas(canvas, tipo, tema, pulsoEscala = 1) {
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;

    // Ciclo limpiar-pintar[cite: 7, 8]
    ctx.clearRect(0, 0, w, h);

    const color = (this.paletas[tema] && this.paletas[tema][tipo]) || this.paletas.clasico[tipo];
    ctx.fillStyle = color;
    ctx.strokeStyle = 'rgba(0,0,0,0.2)';
    ctx.lineWidth = 3;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(pulsoEscala, pulsoEscala);
    ctx.translate(-cx, -cy);

    const size = w * 0.75;
    const margin = (w - size) / 2;

    switch (tipo) {
      case 0: // Círculo[cite: 6]
        ctx.beginPath();
        ctx.arc(cx, cy, size / 2, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        break;

      case 1: // Cuadrado / Rectángulo[cite: 4]
        ctx.fillRect(margin, margin, size, size);
        ctx.strokeRect(margin, margin, size, size);
        break;

      case 2: // Triángulo (Camino poligonal)[cite: 5]
        ctx.beginPath();
        ctx.moveTo(cx, margin);
        ctx.lineTo(margin + size, margin + size);
        ctx.lineTo(margin, margin + size);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        break;

      case 3: // Rombo (Camino poligonal)[cite: 5]
        ctx.beginPath();
        ctx.moveTo(cx, margin);
        ctx.lineTo(margin + size, cy);
        ctx.lineTo(cx, margin + size);
        ctx.lineTo(margin, cy);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        break;

      case 4: // Hexágono (Camino poligonal)[cite: 5]
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 3) * i - Math.PI / 6;
          const x = cx + (size / 2) * Math.cos(angle);
          const y = cy + (size / 2) * Math.sin(angle);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        break;
    }

    ctx.restore();
  }

  // Animación de victoria con requestAnimationFrame[cite: 8]
  iniciarAnimacionVictoria(temaAspecto) {
    let tiempoInicio = null;
    const fichas = Array.from(this.tableroElement.querySelectorAll('canvas.ficha'));

    const animar = (timestamp) => {
      if (!tiempoInicio) tiempoInicio = timestamp;
      const transcurrido = (timestamp - tiempoInicio) / 1000;

      fichas.forEach((canvas) => {
        const tipo = parseInt(canvas.dataset.tipo, 10);
        const pulso = 1 + 0.08 * Math.sin(transcurrido * 5 + tipo);
        this.dibujarFichaCanvas(canvas, tipo, temaAspecto, pulso);
      });

      this.animacionId = requestAnimationFrame(animar);
    };

    this.animacionId = requestAnimationFrame(animar);
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

  // Métodos de respuesta visual mediante classList[cite: 14]
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