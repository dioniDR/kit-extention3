// Script del popup mejorado para depuración
document.addEventListener('DOMContentLoaded', function() {
    console.log("🔷 Popup inicializado");
    
    // Encontrar todos los botones de inserción
    const insertButtons = document.querySelectorAll('.insert-btn');
    console.log("🔷 Botones encontrados:", insertButtons.length);
    
    const statusMessage = document.getElementById('status-message');
    
    // Comprobar que los botones se han encontrado
    if (insertButtons.length === 0) {
        mostrarError("No se encontraron componentes disponibles");
        return;
    }
    
    // Agregar eventos a los botones de inserción
    insertButtons.forEach(button => {
        button.addEventListener('click', function() {
            console.log("🔷 Botón presionado");
            
            const componentItem = this.closest('.component-item');
            if (!componentItem) {
                mostrarError("Error: No se pudo encontrar información del componente");
                return;
            }
            
            const tagName = componentItem.dataset.tag;
            const scriptSrc = componentItem.dataset.script;
            
            if (!tagName || !scriptSrc) {
                mostrarError("Error: Información de componente incompleta");
                return;
            }
            
            console.log(`🔷 Componente a insertar: ${tagName} (${scriptSrc})`);
            
            statusMessage.textContent = "Procesando...";
            statusMessage.className = "status-message";
            statusMessage.style.display = "block";
            
            // Intentar insertar directamente
            chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                if (!tabs || tabs.length === 0) {
                    mostrarError("Error: No se pudo obtener la pestaña activa");
                    return;
                }
                
                const activeTab = tabs[0];
                console.log("🔷 Pestaña activa:", activeTab.url);
                
                // Verificar si podemos inyectar en esta pestaña
                try {
                    const url = new URL(activeTab.url);
                    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
                        mostrarError(`No se puede insertar en páginas ${url.protocol}`);
                        return;
                    }
                } catch (e) {
                    console.warn("🔶 Error al verificar URL:", e);
                    // Continuar de todos modos
                }
                
                // Enviar mensaje al content script
                console.log("🔷 Enviando mensaje al content script");
                chrome.tabs.sendMessage(
                    activeTab.id,
                    {
                        action: "insertComponent",
                        tagName: tagName,
                        scriptSrc: scriptSrc
                    },
                    function(response) {
                        if (chrome.runtime.lastError) {
                            console.error("🔴 Error enviando mensaje:", chrome.runtime.lastError);
                            mostrarError("Error de comunicación. Intente recargar la página.");
                            
                            // Intentar cargar el content script manualmente
                            console.log("🔷 Intentando inyectar content script");
                            chrome.scripting.executeScript({
                                target: { tabId: activeTab.id },
                                files: ['js/content-script.js']
                            }).then(() => {
                                console.log("🔷 Content script inyectado manualmente, reintentando");
                                setTimeout(() => {
                                    insertarComponente(activeTab.id, tagName, scriptSrc);
                                }, 500);
                            }).catch(err => {
                                console.error("🔴 Error al inyectar script:", err);
                                mostrarError("No se pudo cargar el script. La página podría tener restricciones.");
                            });
                            
                            return;
                        }
                        
                        console.log("🔷 Respuesta recibida:", response);
                        
                        if (response && response.success) {
                            mostrarExito("Componente insertado correctamente");
                        } else {
                            const errorMsg = response && response.error ? response.error : "Error desconocido";
                            mostrarError(`Error: ${errorMsg}`);
                        }
                    }
                );
            });
        });
    });
    
    // Función auxiliar para insertar componente
    function insertarComponente(tabId, tagName, scriptSrc) {
        chrome.tabs.sendMessage(
            tabId,
            {
                action: "insertComponent",
                tagName: tagName,
                scriptSrc: scriptSrc
            },
            function(response) {
                if (chrome.runtime.lastError) {
                    console.error("🔴 Error en segundo intento:", chrome.runtime.lastError);
                    mostrarError("No se pudo insertar. Intente recargar la página.");
                    return;
                }
                
                if (response && response.success) {
                    mostrarExito("Componente insertado correctamente");
                } else {
                    const errorMsg = response && response.error ? response.error : "Error desconocido";
                    mostrarError(`Error: ${errorMsg}`);
                }
            }
        );
    }
    
    function mostrarExito(mensaje) {
        console.log("🔷 Éxito:", mensaje);
        statusMessage.textContent = mensaje;
        statusMessage.className = "status-message status-success";
        statusMessage.style.display = "block";
    }
    
    function mostrarError(mensaje) {
        console.error("🔴 Error:", mensaje);
        statusMessage.textContent = mensaje;
        statusMessage.className = "status-message status-error";
        statusMessage.style.display = "block";
    }
});
