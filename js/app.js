import { TableroModel } from './model.js';
import { TableroView } from './view.js';
import { TableroController } from './controller.js';

document.addEventListener('DOMContentLoaded', () => {
  const model = new TableroModel();
  const view = new TableroView();
  const controller = new TableroController(model, view);
  controller.init();
});