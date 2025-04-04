/**
 * API-Console - Componente web para interactuar con APIs desde la consola
 * Este componente inyecta una función global que permite hacer llamadas a la API
 */
(function() {
  // Verificar si ya existe el componente
  if (customElements.get('api-console')) {
    console.log('El componente API Console ya está registrado');
    return;
  }
  
  console.log('Registrando componente API Console...');
  
  class APIConsole extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.apiUrl = 'http://localhost:8001/api';
      this.logs = [];
    }

    connectedCallback() {
      console.log('API Console conectado al DOM');
      this.render();
      this.setupEventListeners();
      this.registerGlobalFunctions();
    }

    render() {
      const style = `
        <style>
          :host {
            display: block;
            font-family: 'Consolas', monospace;
          }
          
          .console-container {
            background-color: #282c34;
            color: #abb2bf;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            overflow: hidden;
            max-width: 600px;
            margin: 20px;
          }
          
          .header {
            background-color: #21252b;
            padding: 10px 15px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid #181a1f;
          }
          
          .title {
            font-weight: bold;
            font-size: 14px;
            color: #e5c07b;
            margin: 0;
          }
          
          .controls {
            display: flex;
            gap: 10px;
          }
          
          .button {
            background-color: #4d78cc;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 4px 8px;
            font-size: 12px;
            cursor: pointer;
          }
          
          .button:hover {
            background-color: #5b8ae8;
          }
          
          .clear-btn {
            background-color: #e06c75;
          }
          
          .content {
            padding: 15px;
            font-size: 13px;
            max-height: 300px;
            overflow-y: auto;
          }
          
          .command {
            color: #98c379;
            margin-bottom: 5px;
          }
          
          .command::before {
            content: "> ";
            color: #e5c07b;
          }
          
          .result {
            color: #abb2bf;
            margin-bottom: 15px;
            white-space: pre-wrap;
            word-break: break-all;
          }
          
          .error {
            color: #e06c75;
          }
          
          .instruction {
            background-color: #2c313a;
            padding: 10px;
            border-radius: 4px;
            margin-bottom: 15px;
            line-height: 1.4;
          }
          
          .function-name {
            color: #61afef;
            font-weight: bold;
          }
          
          .comment {
            color: #7f848e;
            font-style: italic;
          }
        </style>
      `;

      // Generar el historial de logs
      let logsHTML = '';
      for (const log of this.logs) {
        logsHTML += `
          <div class="command">${log.command}</div>
          <div class="result ${log.error ? 'error' : ''}">${log.result}</div>
        `;
      }

      this.shadowRoot.innerHTML = `
        ${style}
        <div class="console-container">
          <div class="header">
            <h3 class="title">API Console</h3>
            <div class="controls">
              <button class="button fetch-btn">Obtener Ventas</button>
              <button class="button clear-btn">Limpiar</button>
            </div>
          </div>
          
          <div class="content">
            <div class="instruction">
              <p>Ejecuta <span class="function-name">window.fetchVentas()</span> en la consola del navegador para obtener los datos de ventas.</p>
              <p class="comment">// También puedes usar el botón "Obtener Ventas" arriba.</p>
            </div>
            ${logsHTML}
          </div>
        </div>
      `;
    }

    setupEventListeners() {
      const fetchBtn = this.shadowRoot.querySelector('.fetch-btn');
      const clearBtn = this.shadowRoot.querySelector('.clear-btn');
      
      if (fetchBtn) {
        fetchBtn.addEventListener('click', () => {
          this.fetchVentas();
        });
      }
      
      if (clearBtn) {
        clearBtn.addEventListener('click', () => {
          this.logs = [];
          this.render();
        });
      }
    }

    registerGlobalFunctions() {
      // Registrar la función global fetchVentas
      window.fetchVentas = async () => {
        try {
          console.log("Obteniendo datos de ventas desde", this.apiUrl + "/ventas");
          
          const response = await fetch(this.apiUrl + "/ventas");
          
          if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
          }
          
          const data = await response.json();
          
          // Registrar en el componente y en la consola
          this.addLog("window.fetchVentas()", JSON.stringify(data, null, 2));
          
          // Mostrar en la consola del navegador en formato bonito
          console.log("Datos de ventas obtenidos:", data);
          
          return data;
        } catch (error) {
          const errorMsg = `Error al obtener datos: ${error.message}`;
          this.addLog("window.fetchVentas()", errorMsg, true);
          console.error(errorMsg);
          return null;
        }
      };
      
      // Función auxiliar para información
      window.helpApiConsole = () => {
        console.log(`
          API Console - Funciones disponibles:
          
          window.fetchVentas()
            - Obtiene datos de ventas desde ${this.apiUrl}/ventas
            - Retorna: Array de objetos con datos de ventas
            
          window.helpApiConsole()
            - Muestra este mensaje de ayuda
        `);
      };
      
      console.log("Funciones registradas: window.fetchVentas() y window.helpApiConsole()");
    }

    async fetchVentas() {
      // Solo llama a la función global que ya registramos
      return window.fetchVentas();
    }
    
    addLog(command, result, isError = false) {
      this.logs.push({
        command,
        result,
        error: isError
      });
      this.render();
      this.setupEventListeners();
    }
  }
  
  // Registrar el componente personalizado
  try {
    customElements.define('api-console', APIConsole);
    console.log('Componente API Console registrado correctamente');
  } catch (error) {
    console.error('Error al registrar componente API Console:', error);
  }
})();