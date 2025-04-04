(function () {
    if (customElements.get('hola-mundo-iffe')) return;

    class HolaMundoIIFE extends HTMLElement {
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
                <p>¡Hola, Mundo desde IIFE!</p>
            `;
        }
    }

    customElements.define('hola-mundo-iffe', HolaMundoIIFE);
})();