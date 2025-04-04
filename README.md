# Web Components Toolkit

Un sistema dinámico para desarrollar componentes web, probarlos en tiempo real, y automáticamente generar una extensión de navegador que los contenga.

## Características

- 🔄 **Detección automática** de componentes web
- 🌐 **Servidor de desarrollo** para probar componentes
- 🧩 **Generación automática** de extensión de navegador
- 🔍 **Análisis de código** para identificar etiquetas de componentes
- 🐳 **Compatible con Docker** para desarrollo consistente

## Requisitos

- Python 3.8 o superior
- pip para instalar dependencias
- Docker y Docker Compose (opcional)
- Navegador Chrome/Edge/Brave para usar la extensión

## Inicio rápido

### Instalación tradicional

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/web-components-toolkit.git
   cd web-components-toolkit
   ```

2. Crear un entorno virtual e instalar dependencias:
   ```bash
   python -m venv venv
   source venv/bin/activate  # En Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. Iniciar el servidor:
   ```bash
   python app.py
   ```

4. Visitar [http://localhost:8000](http://localhost:8000) en tu navegador

### Usando Docker

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/web-components-toolkit.git
   cd web-components-toolkit
   ```

2. Iniciar con Docker Compose:
   ```bash
   docker-compose up -d
   ```

3. Visitar [http://localhost:8000](http://localhost:8000) en tu navegador

## Cómo Configurar y Ejecutar la Aplicación

Después de clonar el repositorio, sigue estos pasos para configurar el entorno y ejecutar la aplicación:

### 1. Crear un Entorno Virtual de Python

1. Asegúrate de tener Python 3.8 o superior instalado en tu sistema.
2. Navega al directorio raíz del proyecto:
   ```bash
   cd kitextention3
   ```
3. Crea un entorno virtual:
   ```bash
   python -m venv venv
   ```
4. Activa el entorno virtual:
   - En Linux/MacOS:
     ```bash
     source venv/bin/activate
     ```
   - En Windows:
     ```bash
     venv\Scripts\activate
     ```

### 2. Instalar Dependencias

Con el entorno virtual activado, instala las dependencias necesarias:
```bash
pip install -r requirements.txt
```

### 3. Ejecutar la Aplicación

Inicia la aplicación ejecutando el siguiente comando:
```bash
python app.py
```

Esto iniciará un servidor local en `http://localhost:8000`. Puedes abrir esta URL en tu navegador para interactuar con la aplicación.

### 4. Probar la Extensión

1. Navega a la carpeta `extension/` generada por la aplicación.
2. Sigue las instrucciones para cargar la extensión en tu navegador (Chrome/Edge/Brave) en modo desarrollador.

# Guía para Crear Componentes en la Aplicación

Esta guía describe cómo crear y gestionar componentes para la aplicación, ya sea desde un único archivo o desde una carpeta que contenga múltiples archivos relacionados (como JavaScript y CSS).

## Estructura de Componentes

Los componentes deben ubicarse en la carpeta `componentes/` dentro del proyecto. Cada componente puede ser:

1. **Un único archivo JavaScript**: 
   - Ejemplo: `mi-componente.js`
   - Este archivo debe definir un Web Component utilizando `customElements.define`.

2. **Una carpeta de componente**:
   - Ejemplo: `mi-componente/`
   - Contiene:
     - `mi-componente.js`: Archivo principal del componente.
     - `mi-componente.css`: Estilos asociados al componente.

## Pasos para Crear un Componente

### 1. Crear un Componente Simple (Archivo Único)

1. Navega a la carpeta `componentes/`.
2. Crea un archivo JavaScript, por ejemplo, `mi-componente.js`.
3. Define tu Web Component en el archivo:

   ```javascript
   class MiComponente extends HTMLElement {
       constructor() {
           super();
           this.attachShadow({ mode: 'open' });
           this.shadowRoot.innerHTML = `<p>Hola, soy un componente!</p>`;
       }
   }

   customElements.define('mi-componente', MiComponente);
   ```

4. Guarda el archivo.

### 2. Crear un Componente Complejo (Carpeta con Archivos Múltiples)

1. Navega a la carpeta `componentes/`.
2. Crea una nueva carpeta con el nombre del componente, por ejemplo, `mi-componente/`.
3. Dentro de la carpeta, crea los siguientes archivos:
   - `mi-componente.js`: Define el Web Component.
   - `mi-componente.css`: Contiene los estilos del componente.

4. En el archivo `mi-componente.js`, importa el archivo CSS:

   ```javascript
   class MiComponente extends HTMLElement {
       constructor() {
           super();
           this.attachShadow({ mode: 'open' });
           this.shadowRoot.innerHTML = `
               <link rel="stylesheet" href="mi-componente.css">
               <p>Hola, soy un componente con estilos!</p>
           `;
       }
   }

   customElements.define('mi-componente', MiComponente);
   ```

5. Guarda los archivos.

## Cómo Funciona la Aplicación con los Componentes

1. **Detección Automática**:
   - La aplicación detecta automáticamente los archivos en la carpeta `componentes/`.
   - Si es un archivo único, se copia directamente a `extension/js/components/`.
   - Si es una carpeta, se copian todos los archivos relacionados (como `.js` y `.css`) a sus respectivas carpetas en la extensión.

2. **Generación de Archivos de Extensión**:
   - La función `generar_extension_files` se encarga de procesar los componentes y generar los archivos necesarios para la extensión.
   - Los archivos `.js` se colocan en `extension/js/components/`.
   - Los archivos `.css` se colocan en `extension/css/components/`.

3. **Eliminación de Componentes**:
   - Si un componente se elimina de la carpeta `componentes/`, la aplicación lo detecta y elimina los archivos correspondientes de la extensión.

## Notas Importantes

- Asegúrate de que cada componente tenga un nombre único para evitar conflictos.
- Los nombres de los componentes deben seguir el formato `kebab-case` (por ejemplo, `mi-componente`).
- Si un componente depende de otros recursos (como imágenes), asegúrate de incluirlos en la carpeta del componente.

## Ejemplo de Estructura

```
componentes/
├── mi-componente.js
├── otro-componente/
│   ├── otro-componente.js
│   └── otro-componente.css
```

Con esta estructura, la aplicación generará los archivos necesarios en la carpeta `extension/` para que la extensión funcione correctamente.
