// Content script optimizado para inserción directa de componentes
console.log("🟢 Content script del Kit de Herramientas Web inicializado");

// Escuchar mensajes desde el popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("🟢 Mensaje recibido:", message);
    
    if (message.action === "insertComponent") {
        // Insertar componente con enfoque directo
        insertDirectComponent(message.tagName, message.scriptSrc)
            .then(() => {
                console.log("🟢 Componente insertado correctamente");
                sendResponse({success: true});
            })
            .catch(error => {
                console.error("🔴 Error al insertar componente:", error);
                sendResponse({success: false, error: error.message});
            });
        
        return true; // Mantener canal abierto
    }
});

// Función para insertar componente directamente
async function insertDirectComponent(tagName, scriptSrc) {
    console.log(`🟢 Insertando ${tagName} con enfoque directo`);
    
    try {
        // 1. Crear un contenedor con estilos garantizados
        const container = document.createElement('div');
        container.className = 'web-component-container';
        container.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            width: 350px;
            background: white;
            border: 2px solid #4361ee;
            border-radius: 8px;
            box-shadow: 0 0 15px rgba(0,0,0,0.2);
            font-family: Arial, sans-serif;
            z-index: 9999;
            overflow: hidden;
        `;
        
        // 2. Crear barra de título
        const header = document.createElement('div');
        header.style.cssText = `
            background: #4361ee;
            color: white;
            padding: 10px 15px;
            font-weight: bold;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: move;
        `;
        
        const title = document.createElement('span');
        title.textContent = tagName;
        
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
        });
        
        header.appendChild(title);
        header.appendChild(closeBtn);
        
        // 3. Crear contenido según el tipo de componente
        const content = document.createElement('div');
        content.style.cssText = `
            padding: 15px;
        `;
        
        // Seleccionar el contenido según el tipo de componente
        if (scriptSrc === 'api-consola.js') {
            createApiConsoleContent(content);
        } else if (scriptSrc === 'chat-capture.js') {
            createChatCaptureContent(content);
        } else if (scriptSrc === 'holamundoextension.js') {
            createHolaMundoContent(content);
        } else {
            // Componente genérico
            createGenericContent(content, tagName);
        }
        
        // 4. Ensamblar todo
        container.appendChild(header);
        container.appendChild(content);
        document.body.appendChild(container);
        
        // 5. Hacer el componente arrastrable
        makeElementDraggable(container, header);
        
        return true;
    } catch (error) {
        console.error('🔴 Error completo:', error);
        throw error;
    }
}

// Funciones para crear diferentes tipos de contenido
function createApiConsoleContent(container) {
    container.innerHTML = `
        <div style="background-color: #282c34; color: #abb2bf; border-radius: 8px; overflow: hidden; margin-bottom: 15px;">
            <div style="background-color: #21252b; padding: 10px 15px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #181a1f;">
                <h3 style="font-weight: bold; font-size: 14px; color: #e5c07b; margin: 0;">API Console</h3>
                <div>
                    <button id="fetchBtn" style="background-color: #4d78cc; color: white; border: none; border-radius: 4px; padding: 4px 8px; font-size: 12px; cursor: pointer; margin-right: 5px;">Obtener Ventas</button>
                    <button id="clearBtn" style="background-color: #e06c75; color: white; border: none; border-radius: 4px; padding: 4px 8px; font-size: 12px; cursor: pointer;">Limpiar</button>
                </div>
            </div>
            <div style="padding: 15px; font-size: 13px; max-height: 200px; overflow-y: auto;">
                <div style="background-color: #2c313a; padding: 10px; border-radius: 4px; margin-bottom: 15px; line-height: 1.4;">
                    <p>Ejecuta <span style="color: #61afef; font-weight: bold;">getDataFromAPI()</span> para obtener datos.</p>
                    <p style="color: #7f848e; font-style: italic;">// También puedes usar el botón "Obtener Ventas" arriba.</p>
                </div>
                <div id="apiLogs"></div>
            </div>
        </div>
    `;
    
    // Añadir funcionalidad
    const fetchBtn = container.querySelector('#fetchBtn');
    const clearBtn = container.querySelector('#clearBtn');
    const logsContainer = container.querySelector('#apiLogs');
    let logs = [];
    
    // Función para actualizar los logs
    function updateLogs() {
        logsContainer.innerHTML = '';
        logs.forEach(log => {
            const commandDiv = document.createElement('div');
            commandDiv.style.cssText = 'color: #98c379; margin-bottom: 5px;';
            commandDiv.innerHTML = `> ${log.command}`;
            
            const resultDiv = document.createElement('div');
            resultDiv.style.cssText = `color: ${log.error ? '#e06c75' : '#abb2bf'}; margin-bottom: 15px; white-space: pre-wrap; word-break: break-all;`;
            resultDiv.textContent = log.result;
            
            logsContainer.appendChild(commandDiv);
            logsContainer.appendChild(resultDiv);
        });
    }
    
    // Función para añadir un log
    function addLog(command, result, isError = false) {
        logs.push({
            command,
            result,
            error: isError
        });
        updateLogs();
    }
    
    // Registrar función global
    window.getDataFromAPI = async () => {
        try {
            addLog("getDataFromAPI()", "Obteniendo datos simulados...");
            
            // Simular un retraso de red
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Datos simulados
            const mockData = [
                { id: 1, producto: "Widget A", ventas: 240, fecha: "2023-01-15" },
                { id: 2, producto: "Widget B", ventas: 180, fecha: "2023-01-16" },
                { id: 3, producto: "Widget C", ventas: 320, fecha: "2023-01-17" }
            ];
            
            addLog("getDataFromAPI()", JSON.stringify(mockData, null, 2));
            console.log("Datos obtenidos:", mockData);
            
            return mockData;
        } catch (error) {
            const errorMsg = `Error al obtener datos: ${error.message}`;
            addLog("getDataFromAPI()", errorMsg, true);
            console.error(errorMsg);
            return null;
        }
    };
    
    // Configurar eventos
    if (fetchBtn) {
        fetchBtn.addEventListener('click', () => {
            getDataFromAPI();
        });
    }
    
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            logs = [];
            updateLogs();
        });
    }
    
    console.log("API Console: Componente creado");
}

function createChatCaptureContent(container) {
    container.innerHTML = `
        <div style="background: white; padding: 15px; border-radius: 8px; font-family: sans-serif; font-size: 13px;">
            <strong style="display: block; margin-bottom: 10px;">📋 Preguntas:</strong>
            <input type="text" placeholder="Buscar pregunta..." style="width: 100%; padding: 6px; margin-bottom: 10px; box-sizing: border-box;">
            <ul id="preguntas-list" style="list-style: none; padding: 0; margin: 10px 0 0 0;">
                <li style="margin: 5px 0;"><a href="#" style="color: #333; text-decoration: none; padding: 4px 6px; display: block;">🔹 No hay preguntas detectadas</a></li>
            </ul>
            <button id="copiarBtn" style="margin-top: 10px; width: 100%; padding: 6px; background: #4361ee; color: white; border: none; border-radius: 4px; cursor: pointer;">📄 Copiar preguntas</button>
        </div>
    `;
    
    // Añadir funcionalidad
    const preguntasList = container.querySelector('#preguntas-list');
    const input = container.querySelector('input');
    const copiarBtn = container.querySelector('#copiarBtn');
    let preguntas = [];
    
    // Función para detectar preguntas en la página
    function detectarPreguntas() {
        // En una implementación real, buscaríamos preguntas en el DOM
        // Para este ejemplo, simulamos algunas preguntas
        preguntas = [
            "¿Cómo puedo crear un componente web?",
            "¿Qué son los Web Components?",
            "¿Por qué usar CSS inline en lugar de Shadow DOM?"
        ];
        
        actualizarListaPreguntas();
    }
    
    // Función para actualizar la lista de preguntas
    function actualizarListaPreguntas() {
        preguntasList.innerHTML = '';
        
        const filtro = input?.value?.toLowerCase() || '';
        
        const preguntasFiltradas = preguntas.filter(p => 
            p.toLowerCase().includes(filtro)
        );
        
        if (preguntasFiltradas.length === 0) {
            preguntasList.innerHTML = `<li style="margin: 5px 0;"><a href="#" style="color: #999; text-decoration: none; padding: 4px 6px; display: block;">No hay preguntas que coincidan</a></li>`;
            return;
        }
        
        preguntasFiltradas.forEach((pregunta, index) => {
            const li = document.createElement('li');
            li.style.cssText = 'margin: 5px 0;';
            
            const a = document.createElement('a');
            a.href = '#';
            a.style.cssText = 'color: #333; text-decoration: none; padding: 4px 6px; display: block;';
            a.textContent = `🔹 ${pregunta}`;
            a.dataset.index = index;
            
            a.addEventListener('click', (e) => {
                e.preventDefault();
                alert(`Navegando a la pregunta: ${pregunta}`);
            });
            
            li.appendChild(a);
            preguntasList.appendChild(li);
        });
    }
    
    // Configurar eventos
    if (input) {
        input.addEventListener('input', actualizarListaPreguntas);
    }
    
    if (copiarBtn) {
        copiarBtn.addEventListener('click', () => {
            const texto = preguntas.join('\n');
            navigator.clipboard.writeText(texto)
                .then(() => {
                    copiarBtn.textContent = '✅ Copiado al portapapeles';
                    setTimeout(() => {
                        copiarBtn.textContent = '📄 Copiar preguntas';
                    }, 2000);
                })
                .catch(err => {
                    console.error('Error al copiar: ', err);
                    copiarBtn.textContent = '❌ Error al copiar';
                    setTimeout(() => {
                        copiarBtn.textContent = '📄 Copiar preguntas';
                    }, 2000);
                });
        });
    }
    
    // Detectar preguntas inicialmente
    setTimeout(detectarPreguntas, 500);
    
    console.log("Chat Capture: Componente creado");
}

function createHolaMundoContent(container) {
    container.innerHTML = `
        <div style="text-align: center; padding: 20px;">
            <div style="
                font-size: 20px;
                color: #4CAF50;
                font-family: Arial, sans-serif;
                margin-bottom: 20px;
            ">¡Hola, Mundo!</div>
            
            <div id="contador" style="
                font-size: 3rem;
                font-weight: bold;
                color: #2c3e50;
                margin: 15px 0;
                min-width: 100px;
                text-align: center;
            ">0</div>
            
            <div style="display: flex; gap: 10px; justify-content: center; margin-top: 10px;">
                <button id="decrementBtn" style="
                    background-color: #e74c3c;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    padding: 8px 16px;
                    font-size: 1.2rem;
                    cursor: pointer;
                ">-</button>
                
                <button id="incrementBtn" style="
                    background-color: #2ecc71;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    padding: 8px 16px;
                    font-size: 1.2rem;
                    cursor: pointer;
                ">+</button>
            </div>
            
            <button id="resetBtn" style="
                background-color: #3498db;
                color: white;
                border: none;
                border-radius: 4px;
                padding: 8px 16px;
                font-size: 1.2rem;
                cursor: pointer;
                margin-top: 10px;
                width: 100%;
            ">Reset</button>
        </div>
    `;
    
    // Añadir funcionalidad
    const contadorEl = container.querySelector('#contador');
    const decrementBtn = container.querySelector('#decrementBtn');
    const incrementBtn = container.querySelector('#incrementBtn');
    const resetBtn = container.querySelector('#resetBtn');
    let contador = 0;
    
    // Función para actualizar el contador
    function actualizarContador() {
        if (contadorEl) {
            contadorEl.textContent = contador;
        }
    }
    
    // Configurar eventos
    if (decrementBtn) {
        decrementBtn.addEventListener('click', () => {
            contador--;
            actualizarContador();
            console.log(`Contador decrementado a: ${contador}`);
        });
    }
    
    if (incrementBtn) {
        incrementBtn.addEventListener('click', () => {
            contador++;
            actualizarContador();
            console.log(`Contador incrementado a: ${contador}`);
        });
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            contador = 0;
            actualizarContador();
            console.log("Contador reiniciado");
        });
    }
    
    console.log("Hola Mundo: Componente creado");
}

function createGenericContent(container, tagName) {
    container.innerHTML = `
        <div style="padding: 15px; text-align: center;">
            <h3 style="margin-top: 0; color: #333; margin-bottom: 15px;">${tagName}</h3>
            
            <div style="
                background-color: #f5f7fa;
                border: 2px dashed #ccc;
                padding: 20px;
                margin-bottom: 15px;
                border-radius: 8px;
                color: #555;
            ">
                Componente genérico
            </div>
            
            <button id="alertBtn" style="
                background-color: #4361ee;
                color: white;
                border: none;
                border-radius: 4px;
                padding: 10px;
                width: 100%;
                cursor: pointer;
                font-size: 14px;
            ">Mostrar alerta</button>
            
            <div id="status" style="
                margin-top: 15px;
                padding: 10px;
                background-color: #f8f9fa;
                border-left: 3px solid #4361ee;
                text-align: left;
                font-size: 14px;
            ">
                Componente listo para usar
            </div>
        </div>
    `;
    
    // Añadir funcionalidad
    const alertBtn = container.querySelector('#alertBtn');
    const status = container.querySelector('#status');
    
    if (alertBtn) {
        alertBtn.addEventListener('click', () => {
            alert(`¡Hola desde el componente ${tagName}!`);
            
            if (status) {
                status.textContent = 'Alerta mostrada';
            }
        });
    }
    
    console.log(`Componente genérico ${tagName} creado`);
}

// Función para hacer un elemento arrastrable
function makeElementDraggable(element, handle) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    handle.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        element.style.top = (element.offsetTop - pos2) + "px";
        element.style.left = (element.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

console.log("🟢 Content script completamente cargado");
