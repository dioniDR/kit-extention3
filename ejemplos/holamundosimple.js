(function() {
  console.log("🔵 Iniciando holamundosimple.js");

  try {
    class HolaMundoSimple extends HTMLElement {
      constructor() {
        super();
        this._root = this.attachShadow({mode: 'open'});
        this._root.innerHTML = `
          <style>
            div { 
              padding: 20px; 
              background-color: #4285f4; 
              color: white; 
              border-radius: 8px; 
              text-align: center;
            }
            button {
              background: white;
              color: #4285f4;
              border: none;
              padding: 8px 16px;
              border-radius: 4px;
              cursor: pointer;
              margin-top: 10px;
            }
          </style>
          <div>
            <h3>¡Hola Mundo Simple!</h3>
            <button>Mostrar alerta</button>
          </div>
        `;
        
        this._btn = this._root.querySelector('button');
        this._setupEvents();
      }
      
      _setupEvents() {
        console.log("🔵 Configurando eventos");
        this._btn.addEventListener('click', () => {
          console.log("🔵 Botón presionado");
          alert("¡Hola desde el componente web!");
        });
      }
      
      connectedCallback() {
        console.log("🔵 HolaMundoSimple conectado al DOM");
      }
    }
    
    customElements.define('hola-mundo-simple', HolaMundoSimple);
    console.log("🔵 HolaMundoSimple registrado con éxito");
  } catch (err) {
    console.error("🔴 Error en HolaMundoSimple:", err);
  }
})();
