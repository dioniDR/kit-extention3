class HolaMundoClase extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                p {
                    font-size: 20px;
                    color: #4CAF50;
                    font-family: Arial, sans-serif;
                }
            </style>
            <p>¡Hola, Mundo desde Clase!</p>
        `;
    }
}

customElements.define('hola-mundo-clase', HolaMundoClase);