def generar_popup_html(config):
    """Genera el archivo popup.html a partir de plantillas"""
    from config.config import EXTENSION_DIR, BASE_DIR
    import os
    import time
    
    # Rutas de directorios
    css_dir = os.path.join(EXTENSION_DIR, "css")
    if not os.path.exists(css_dir):
        os.makedirs(css_dir)
    
    # Ruta base para las plantillas (ahora en el directorio raíz)
    template_dir = os.path.join(BASE_DIR, "templates", "extension")
    
    # Copiar CSS si no existe
    css_dest = os.path.join(css_dir, "popup.css")
    if not os.path.exists(css_dest):
        css_src = os.path.join(template_dir, "popup.css")
        with open(css_src, 'r', encoding='utf-8') as f_src:
            with open(css_dest, 'w', encoding='utf-8') as f_dest:
                f_dest.write(f_src.read())
    
    # Leer la plantilla principal
    with open(os.path.join(template_dir, "popup_template.html"), 'r', encoding='utf-8') as f:
        popup_template = f.read()
    
    # Leer la plantilla de componente
    with open(os.path.join(template_dir, "component_template.html"), 'r', encoding='utf-8') as f:
        component_template = f.read()
    
    # Resto del código igual...
