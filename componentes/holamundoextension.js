/**
 * HolaMundoExtension - Componente web simple
 * Este componente es compatible con el nuevo enfoque basado en HTML directos
 */
(function() {
  console.log('HolaMundoExtension: Iniciando carga del componente');

  // No es necesario utilizar Web Components ni Shadow DOM
  // El content-script recrea este componente usando HTML directos
  // Esta definición solo sirve para mantener la compatibilidad
  
  class HolaMundoExtension extends HTMLElement {
    constructor() {
      super();
      console.log('HolaMundoExtension: Constructor iniciado');
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: block;
            font-family: Arial, sans-serif;
          }
          p {
            font-size: 20px;
            color: #4CAF50;
            margin: 20px 0;
          }
          button {
            padding: 8px 16px;
            background: blue;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          }
        </style>
        <p>¡Hola, Mundo desde la extensión!</p>
        <button>Haz clic aquí</button>
      `;
      
      // Agregar evento al botón
      this.shadowRoot.querySelector('button').addEventListener('click', () => {
        alert('¡Botón funcionando correctamente!');
        console.log('Botón presionado en HolaMundoExtension');
      });
      
      console.log('HolaMundoExtension: Constructor completado');
    }
    
    connectedCallback() {
      console.log('HolaMundoExtension: Conectado al DOM');
    }
  }

  // Registro del componente
  try {
    customElements.define('hola-mundo-extension', HolaMundoExtension);
    console.log('HolaMundoExtension: Componente registrado correctamente');
  } catch (error) {
    console.warn('HolaMundoExtension: Error al registrar componente - puede ser ignorado seguramente:', error);
  }
})();
