/**
 * Componente Simple que cambia colores y muestra alertas
 */
class SimpleComponent extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
      <div style="padding: 15px; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <h3 style="margin-top: 0; color: #333;">Componente Simple</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          <button id="alertBtn" style="background: #e74c3c; color: white; border: none; padding: 8px; border-radius: 4px; cursor: pointer;">
            Mostrar Alerta
          </button>
          <button id="colorBtn" style="background: #2ecc71; color: white; border: none; padding: 8px; border-radius: 4px; cursor: pointer;">
            Cambiar Color
          </button>
        </div>
        <div style="margin-top: 10px;">
          <label for="colorPicker">Color:</label>
          <input type="color" id="colorPicker" value="#3498db">
        </div>
        <div id="status" style="margin-top: 10px; padding: 8px; background: #f8f9fa; border-left: 3px solid #3498db; font-size: 14px;">
          Listo para usar
        </div>
      </div>
    `;
    
    this._setupEvents();
  }
  
  _setupEvents() {
    const alertBtn = this.querySelector('#alertBtn');
    const colorBtn = this.querySelector('#colorBtn');
    const colorPicker = this.querySelector('#colorPicker');
    const status = this.querySelector('#status');
    
    if (alertBtn) {
      alertBtn.addEventListener('click', () => {
        alert('¡Hola desde el componente simple!');
        status.textContent = 'Alerta mostrada';
      });
    }
    
    if (colorBtn && colorPicker) {
      colorBtn.addEventListener('click', () => {
        document.body.style.backgroundColor = colorPicker.value;
        status.textContent = `Color cambiado a ${colorPicker.value}`;
      });
    }
  }
}

customElements.define('simple-component', SimpleComponent);
