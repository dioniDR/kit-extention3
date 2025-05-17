// Script del popup
document.addEventListener('DOMContentLoaded', function() {
  // Referencias a elementos del DOM
  const insertBtn = document.getElementById('insertBtn');
  const status = document.getElementById('status');
  
  // Función para mostrar un mensaje de estado
  function showStatus(message, isError = false) {
    status.textContent = message;
    status.className = isError 
      ? 'status status-error' 
      : 'status status-success';
  }
  
  // Evento del botón de inserción
  insertBtn.addEventListener('click', function() {
    // Obtener la pestaña activa
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      if (!tabs || tabs.length === 0) {
        showStatus('Error: No se pudo obtener la pestaña activa', true);
        return;
      }
      
      const tab = tabs[0];
      
      // Enviar mensaje al content script
      chrome.tabs.sendMessage(
        tab.id, 
        {action: 'insertComponent'}, 
        function(response) {
          if (chrome.runtime.lastError) {
            console.error('Error:', chrome.runtime.lastError);
            showStatus('Error de comunicación con la página. Recarga la página e intenta de nuevo.', true);
            return;
          }
          
          if (response && response.success) {
            showStatus('Componente insertado correctamente');
          } else {
            const errorMsg = response && response.error ? response.error : 'Error desconocido';
            showStatus(`Error: ${errorMsg}`, true);
          }
        }
      );
    });
  });
});
