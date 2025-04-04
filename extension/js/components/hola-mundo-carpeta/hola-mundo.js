class HolaMundoCarpeta extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="hola-mundo.css">
            <p>¡Hola, Mundo desde Carpeta!</p>
        `;
    }
}

customElements.define('hola-mundo-carpeta', HolaMundoCarpeta);