// Script de contenido mejorado - inserción directa en la página

console.log("🟢 Content script inicializado - v2");

// Detectar cuando se recibe un mensaje desde el popup
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    console.log("🟢 Mensaje recibido:", message);
    
    if (message.action === "insertComponent") {
        // Esta es la función que se llama cuando se presiona el botón en el popup
        console.log("🟢 Intentando insertar componente:", message.tagName, message.scriptSrc);
        
        // Intentar insertar de manera segura
        insertComponentSafe(message.tagName, message.scriptSrc)
            .then(() => {
                console.log("🟢 Componente insertado con éxito");
                sendResponse({success: true});
            })
            .catch(error => {
                console.error("🔴 Error al insertar componente:", error);
                sendResponse({success: false, error: error.message});
            });
        
        return true; // Mantener el canal abierto para la respuesta asíncrona
    }
});

// Función para insertar un componente de manera segura
async function insertComponentSafe(tagName, scriptSrc) {
    try {
        console.log("🟢 Iniciando inserción segura de:", tagName);
        
        // PASO 1: Inyectar el script directamente
        const scriptUrl = chrome.runtime.getURL(`js/components/${scriptSrc}`);
        console.log("🟢 URL del script:", scriptUrl);
        
        // Obtener el contenido del script
        const response = await fetch(scriptUrl);
        if (!response.ok) {
            throw new Error(`No se pudo cargar el script: ${response.status}`);
        }
        
        const scriptContent = await response.text();
        console.log(`🟢 Contenido del script obtenido (${scriptContent.length} bytes)`);
        
        // PASO 2: Inyectar el contenido del script en la página
        const script = document.createElement('script');
        script.textContent = scriptContent;
        document.head.appendChild(script);
        console.log("🟢 Script inyectado en la página");
        
        // Esperar un momento para que el script se cargue
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // PASO 3: Crear un elemento wrapper para el componente
        const container = document.createElement('div');
        container.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 10000;
            background-color: white;
            border: 2px solid #4285f4;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            padding: 16px;
            width: 300px;
        `;
        
        // Añadir una barra de título
        const header = document.createElement('div');
        header.style.cssText = `
            background-color: #4285f4;
            color: white;
            padding: 8px;
            margin: -16px -16px 16px -16px;
            border-radius: 6px 6px 0 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: move;
        `;
        
        const title = document.createElement('span');
        title.textContent = tagName;
        title.style.fontWeight = 'bold';
        
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
            console.log("🟢 Componente cerrado");
        });
        
        header.appendChild(title);
        header.appendChild(closeBtn);
        container.appendChild(header);
        
        // PASO 4: Crear el componente mediante JavaScript
        console.log("🟢 Creando componente:", tagName);
        
        // Inyectar código para crear el componente
        const injectScript = document.createElement('script');
        injectScript.textContent = `
            console.log("🟣 Script de inyección ejecutándose");
            try {
                const newComponent = document.createElement("${tagName}");
                const containerId = "component-container-" + Math.random().toString(36).substring(2, 9);
                newComponent.id = "injected-component-" + Math.random().toString(36).substring(2, 9);
                document.getElementById('${container.id}').appendChild(newComponent);
                console.log("🟣 Componente creado:", newComponent.id);
            } catch (err) {
                console.error("🔴 Error al crear componente:", err);
            }
        `;
        
        // Asignar un ID al contenedor
        container.id = "component-container-" + Math.random().toString(36).substring(2, 9);
        
        // Añadir el contenedor al body
        document.body.appendChild(container);
        
        // Crear el componente directamente (alternativa si el script no funciona)
        try {
            const component = document.createElement(tagName);
            container.appendChild(component);
            console.log("🟢 Componente insertado directamente");
        } catch (err) {
            console.warn("🟡 No se pudo insertar directamente, intentando con script:", err);
            document.head.appendChild(injectScript);
            injectScript.remove();
        }
        
        // Hacer el componente arrastrable
        makeDraggable(container, header);
        
        return true;
    } catch (error) {
        console.error("🔴 Error completo:", error);
        throw error;
    }
}

// Función para hacer un elemento arrastrable
function makeDraggable(element, handle) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    handle.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // Obtener la posición del cursor al inicio
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // Llamar a función cuando el cursor se mueva
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // Calcular la nueva posición
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // Establecer la nueva posición del elemento
        element.style.top = (element.offsetTop - pos2) + "px";
        element.style.left = (element.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        // Detener el movimiento cuando se suelta el mouse
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

// Diagnóstico del entorno
(function() {
    console.log("🟢 Diagnóstico de entorno:");
    console.log(`- URL: ${window.location.href}`);
    console.log(`- customElements disponible: ${!!window.customElements}`);
    console.log(`- Shadow DOM disponible: ${!!HTMLElement.prototype.attachShadow}`);
    console.log(`- Navegador: ${navigator.userAgent}`);
    
    // Verificar políticas de seguridad
    const meta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    if (meta) {
        console.warn("⚠️ CSP detectada, podría afectar la inserción:", meta.content);
    }
})();

console.log("🟢 Content script completamente cargado");
