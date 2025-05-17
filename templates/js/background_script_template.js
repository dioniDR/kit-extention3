// Background script para la extensión
console.log("Background script inicializado");

// Escuchar a la instalación o actualización de la extensión
chrome.runtime.onInstalled.addListener(() => {
    console.log('Kit de Herramientas Web instalado o actualizado');
});

// Escuchar mensajes desde el popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Mensaje recibido en background script:', message);
    return true; // Mantener el canal abierto para respuesta asíncrona
});
