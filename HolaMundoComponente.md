# Crear un Componente "Hola Mundo"

Este documento explica cómo crear un componente básico "Hola Mundo" para la aplicación. Este componente será un ejemplo simple que puedes usar como base para desarrollar componentes más complejos.

## Pasos para Crear el Componente

### 1. Crear el Archivo del Componente

1. Navega a la carpeta `componentes/` dentro del proyecto.
2. Crea un archivo llamado `hola-mundo.js`.
3. Abre el archivo y define el componente con el siguiente código:

   ```javascript
   class HolaMundo extends HTMLElement {
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
               <p>¡Hola, Mundo!</p>
           `;
       }
   }

   customElements.define('hola-mundo', HolaMundo);
   ```

4. Guarda el archivo.

### 2. Probar el Componente

1. Asegúrate de que el archivo `hola-mundo.js` esté en la carpeta `componentes/`.
2. Ejecuta la aplicación con el siguiente comando:
   ```bash
   python app.py
   ```
3. Abre [http://localhost:8000](http://localhost:8000) en tu navegador.
4. El componente `hola-mundo` debería aparecer en la lista de componentes disponibles.

### 3. Insertar el Componente en una Página HTML

Para probar el componente manualmente, puedes incluirlo en una página HTML:

1. Crea un archivo `index.html` en cualquier ubicación.
2. Incluye el siguiente contenido:

   ```html
   <!DOCTYPE html>
   <html lang="es">
   <head>
       <meta charset="UTF-8">
       <meta name="viewport" content="width=device-width, initial-scale=1.0">
       <title>Prueba de Hola Mundo</title>
       <script src="componentes/hola-mundo.js" defer></script>
   </head>
   <body>
       <h1>Prueba de Componente Hola Mundo</h1>
       <hola-mundo></hola-mundo>
   </body>
   </html>
   ```

3. Abre el archivo `index.html` en un navegador para ver el componente en acción.

## Notas

- Asegúrate de que el nombre del componente siga el formato `kebab-case` (por ejemplo, `hola-mundo`).
- Puedes personalizar el estilo y contenido del componente modificando el código en `hola-mundo.js`.
- Este ejemplo utiliza el Shadow DOM para encapsular el estilo y evitar conflictos con otros elementos de la página.