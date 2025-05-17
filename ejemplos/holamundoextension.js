/**
 * HolaMundoExtension - Componente web simplificado con auto-diagnóstico
 */
(function() {
  // IIFE para evitar conflictos con el scope global
  
  console.log('🚀 Script de HolaMundoExtension cargando...');
  
  // Verificar si ya existe
  if (customElements.get('hola-mundo-extension')) {
    console.log('⚠️ HolaMundoExtension ya está registrado');
    return;
  }
  
  class HolaMundoExtension extends HTMLElement {
    constructor() {
      super();
      console.log('🏗️ Construyendo HolaMundoExtension');
      this.contador = 0;
      this.attachShadow({ mode: 'open' });
      
      this.render();
      this.setupEvents();
    }
    
    render() {
      this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: block;
            font-family: Arial, sans-serif;
            padding: 15px;
            background: linear-gradient(135deg, #6e8efb, #a777e3);
            border-radius: 8px;
            color: white;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            text-align: center;
          }
          button {
            background-color: white;
            color: #6e8efb;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            font-weight: bold;
            cursor: pointer;
            transition: transform 0.2s;
            margin: 5px;
          }
          button:hover {
            transform: scale(1.05);
          }
          .contador {
            font-size: 20px;
            margin: 10px 0;
          }
        </style>
        <h3>Hola Mundo Extension</h3>
        <div class="contador">Contador: 0</div>
        <button id="alertBtn">Mostrar Alerta</button>
        <button id="contadorBtn">Incrementar</button>
        <button id="diagnosticBtn">Diagnóstico</button>
      `;
    }
    
    setupEvents() {
      // Configurar event listeners con comprobación
      try {
        const alertBtn = this.shadowRoot.getElementById('alertBtn');
        if (alertBtn) {
          alertBtn.addEventListener('click', () => {
            console.log('📢 Botón de alerta presionado');
            alert('¡Hola Mundo desde la extensión!');
          });
        } else {
          console.error('❌ No se encontró el botón de alerta');
        }
        
        const contadorBtn = this.shadowRoot.getElementById('contadorBtn');
        if (contadorBtn) {
          contadorBtn.addEventListener('click', () => {
            this.contador++;
            console.log(`🔢 Contador incrementado a: ${this.contador}`);
            const contadorEl = this.shadowRoot.querySelector('.contador');
            if (contadorEl) {
              contadorEl.textContent = `Contador: ${this.contador}`;
            }
          });
        } else {
          console.error('❌ No se encontró el botón de contador');
        }
        
        const diagnosticBtn = this.shadowRoot.getElementById('diagnosticBtn');
        if (diagnosticBtn) {
          diagnosticBtn.addEventListener('click', () => {
            console.log('🔍 Ejecutando diagnóstico...');
            this.runDiagnostic();
          });
        }
      } catch (error) {
        console.error('❌ Error al configurar eventos:', error);
      }
    }
    
    runDiagnostic() {
      console.group('📊 Diagnóstico de HolaMundoExtension');
      console.log('🌐 Navegador:', navigator.userAgent);
      console.log('📱 Dispositivo:', window.innerWidth + 'x' + window.innerHeight);
      console.log('⚙️ Shadow DOM activo:', !!this.shadowRoot);
      console.log('🔄 Estado del contador:', this.contador);
      
      // Verificar si los botones existen
      const buttons = this.shadowRoot.querySelectorAll('button');
      console.log('🔘 Botones encontrados:', buttons.length);
      
      // Verificar si estamos en un iframe
      const isInIframe = window !== window.top;
      console.log('🖼️ ¿Dentro de un iframe?:', isInIframe);
      
      // Verificar si hay errores de CSP (Content Security Policy)
      if (document.currentScript) {
        console.log('📜 Script cargado correctamente');
      } else {
        console.warn('⚠️ Posible problema con CSP (Content Security Policy)');
      }
      
      console.groupEnd();
    }
    
    connectedCallback() {
      console.log('✅ HolaMundoExtension - Conectado al DOM');
    }
    
    disconnectedCallback() {
      console.log('❌ HolaMundoExtension - Desconectado del DOM');
    }
  }
  
  try {
    // Registrar el componente web
    customElements.define('hola-mundo-extension', HolaMundoExtension);
    console.log('✅ HolaMundoExtension registrado correctamente');
    
    // Comprobar si podemos crear una instancia
    const testInstance = document.createElement('hola-mundo-extension');
    console.log('✅ Instancia de prueba creada:', testInstance instanceof HolaMundoExtension);
  } catch (error) {
    console.error('❌ Error al registrar HolaMundoExtension:', error);
  }
})();
