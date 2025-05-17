// Background script
console.log('Background script iniciado');

// Instalar/actualizar
chrome.runtime.onInstalled.addListener((details) => {
  console.log('Extensión Simple instalada/actualizada:', details.reason);
});

// Escuchar mensajes (si es necesario)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Mensaje recibido en background:', message);
  
  // Aquí podríamos agregar lógica adicional si fuera necesario
  
  return true; // Mantener canal abierto
});
