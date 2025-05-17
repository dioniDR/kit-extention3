#!/usr/bin/env python3
"""
Script para convertir todos los SVG en default_icons/ a PNG en extension/images/
"""

import os
import subprocess
import sys

# Definir directorios
DEFAULT_ICONS_DIR = "default_icons"
EXTENSION_IMAGES_DIR = "extension/images"

def convert_with_inkscape(svg_path, png_path, size):
    """Convierte SVG a PNG usando Inkscape."""
    try:
        # Verificar si Inkscape está instalado
        result = subprocess.run(["which", "inkscape"], capture_output=True, text=True)
        if result.returncode != 0:
            return False
        
        # Usar Inkscape para la conversión
        cmd = ["inkscape", 
               "--export-filename=" + png_path,
               "-w", str(size),
               "-h", str(size),
               svg_path]
        subprocess.run(cmd, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        return True
    except Exception as e:
        print(f"Error al usar Inkscape: {e}")
        return False

def convert_with_cairosvg(svg_path, png_path, size):
    """Convierte SVG a PNG usando cairosvg."""
    try:
        import cairosvg
        with open(svg_path, 'rb') as svg_file:
            svg_data = svg_file.read()
        png_data = cairosvg.svg2png(bytestring=svg_data, 
                                   output_width=size, 
                                   output_height=size)
        with open(png_path, 'wb') as png_file:
            png_file.write(png_data)
        return True
    except ImportError:
        print("cairosvg no está instalado.")
        return False
    except Exception as e:
        print(f"Error con cairosvg: {e}")
        return False

def convert_with_imagemagick(svg_path, png_path, size):
    """Convierte SVG a PNG usando ImageMagick."""
    try:
        # Verificar si ImageMagick está instalado
        result = subprocess.run(["which", "convert"], capture_output=True, text=True)
        if result.returncode != 0:
            return False
        
        # Usar ImageMagick para la conversión
        cmd = ["convert", 
               "-background", "none",
               "-size", f"{size}x{size}",
               svg_path, 
               png_path]
        subprocess.run(cmd, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        return True
    except Exception as e:
        print(f"Error al usar ImageMagick: {e}")
        return False

def convert_svg_to_png(svg_path, png_path, size):
    """Intenta convertir SVG a PNG usando varios métodos."""
    # Método 1: Inkscape
    if convert_with_inkscape(svg_path, png_path, size):
        return True
    
    # Método 2: cairosvg
    if convert_with_cairosvg(svg_path, png_path, size):
        return True
    
    # Método 3: ImageMagick
    if convert_with_imagemagick(svg_path, png_path, size):
        return True
    
    return False

def main():
    """Función principal."""
    print("Generando iconos PNG desde SVG...")
    
    # Asegurarse de que el directorio destino existe
    os.makedirs(EXTENSION_IMAGES_DIR, exist_ok=True)
    
    # Verificar que los archivos SVG existen
    svg_files = {
        16: os.path.join(DEFAULT_ICONS_DIR, "icon16.svg"),
        48: os.path.join(DEFAULT_ICONS_DIR, "icon48.svg"),
        128: os.path.join(DEFAULT_ICONS_DIR, "icon128.svg"),
    }
    
    for size, svg_path in svg_files.items():
        if not os.path.exists(svg_path):
            print(f"Error: No se encontró el archivo {svg_path}")
            continue
        
        png_path = os.path.join(EXTENSION_IMAGES_DIR, f"icon{size}.png")
        print(f"Convirtiendo {svg_path} a {png_path}...")
        
        if convert_svg_to_png(svg_path, png_path, size):
            print(f"✅ Generado: icon{size}.png")
        else:
            print(f"❌ Error: No se pudo convertir icon{size}.svg")
            print("Intenta instalar Inkscape, cairosvg o ImageMagick.")
    
    # Verificar que tenemos todos los iconos necesarios
    icons_present = all(os.path.exists(os.path.join(EXTENSION_IMAGES_DIR, f"icon{size}.png")) 
                        for size in [16, 48, 128])
    
    if icons_present:
        print("\n✅ Todos los iconos se han generado correctamente.")
    else:
        print("\n⚠️ No se pudieron generar todos los iconos.")
        print("Intenta instalar una de estas herramientas:")
        print("  - Inkscape: sudo apt-get install inkscape")
        print("  - cairosvg: pip install cairosvg")
        print("  - ImageMagick: sudo apt-get install imagemagick")
    
    print("\nUna vez que tengas todos los iconos, ejecuta: python app.py")

if __name__ == "__main__":
    main()
