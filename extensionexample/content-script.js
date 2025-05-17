// Content script
console.log('Content script de Extensión Simple cargado');

// Escuchar mensajes desde el popup
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  console.log('Mensaje recibido:', message);
  
  if (message.action === 'insertComponent') {
    try {
      // Insertar componente directo sin web components
      insertDirectComponent();
      sendResponse({success: true});
    } catch (error) {
      console.error('Error al insertar componente:', error);
      sendResponse({success: false, error: error.message});
    }
  }
  
  return true; // Mantener canal abierto para respuesta asíncrona
});

// Función para insertar componente directamente
function insertDirectComponent() {
  // 1. Crear un contenedor con estilos garantizados
  const container = document.createElement('div');
  container.style.cssText = `
    position: fixed;
    top: 50px;
    right: 20px;
    width: 300px;
    background: white;
    border: 2px solid #4361ee;
    border-radius: 8px;
    box-shadow: 0 0 15px rgba(0,0,0,0.2);
    font-family: Arial, sans-serif;
    z-index: 9999;
    overflow: hidden;
  `;
  
  // 2. Crear la barra de título
  const header = document.createElement('div');
  header.style.cssText = `
    background: #4361ee;
    color: white;
    padding: 10px 15px;
    font-weight: bold;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: move;
  `;
  
  const title = document.createElement('span');
  title.textContent = 'Componente Simple';
  
  const closeBtn = document.createElement('button');
  closeBtn.textContent = '✕';
  closeBtn.style.cssText = `
    background: none;
    border: none;
    color: white;
    font-size: 16px;
    cursor: pointer;
  `;
  
  closeBtn.addEventListener('click', () => {
    container.remove();
  });
  
  header.appendChild(title);
  header.appendChild(closeBtn);
  
  // 3. Crear el contenido
  const content = document.createElement('div');
  content.style.cssText = `
    padding: 15px;
  `;
  
  content.innerHTML = `
    <div style="
      background-color: #f0f0f0; 
      padding: 15px; 
      margin-bottom: 10px; 
      border-radius: 4px;
      text-align: center;
    ">
      Cambia el color de la página o muestra una alerta
    </div>
    
    <div style="
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-bottom: 10px;
    ">
      <button id="alertBtn" style="
        background: #e74c3c;
        color: white;
        border: none;
        padding: 8px;
        border-radius: 4px;
        cursor: pointer;
      ">Mostrar Alerta</button>
      
      <button id="colorBtn" style="
        background: #2ecc71;
        color: white;
        border: none;
        padding: 8px;
        border-radius: 4px;
        cursor: pointer;
      ">Cambiar Color</button>
    </div>
    
    <div style="margin-top: 10px;">
      <label for="colorPicker">Color:</label>
      <input type="color" id="colorPicker" value="#3498db" style="vertical-align: middle;">
    </div>
    
    <div id="status" style="
      margin-top: 10px;
      padding: 8px;
      background: #f5f7fa;
      border-left: 3px solid #3498db;
      font-size: 14px;
    ">
      Listo para usar
    </div>
  `;
  
  // 4. Ensamblar todo
  container.appendChild(header);
  container.appendChild(content);
  document.body.appendChild(container);
  
  // 5. Añadir funcionalidad
  const alertBtn = content.querySelector('#alertBtn');
  const colorBtn = content.querySelector('#colorBtn');
  const colorPicker = content.querySelector('#colorPicker');
  const status = content.querySelector('#status');
  
  if (alertBtn) {
    alertBtn.addEventListener('click', () => {
      alert('¡Hola desde el componente simple!');
      status.textContent = 'Alerta mostrada';
    });
  }
  
  if (colorBtn && colorPicker) {
    colorBtn.addEventListener('click', () => {
      const color = colorPicker.value;
      document.body.style.backgroundColor = color;
      status.textContent = `Color cambiado a ${color}`;
    });
  }
  
  // 6. Hacer arrastrable
  makeElementDraggable(container, header);
  
  console.log('Componente insertado correctamente');
  return container;
}

// Función para hacer arrastrable
function makeElementDraggable(element, handle) {
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  handle.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    element.style.top = (element.offsetTop - pos2) + "px";
    element.style.left = (element.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}
