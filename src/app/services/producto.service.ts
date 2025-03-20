import { Injectable } from '@angular/core';
import { Producto } from '../models/producto';
@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  
  private productosIniciales: Producto[] = [
    new Producto(1, 'Nike Jordan 1 Mid - Vela/Sombrío apagado/Blanco/Rojo gimnasio', 3199, 'assets/tenis1.jpg', 0),
    new Producto(2, 'Air Jordan 1 Low -  Ratán/Vela/Camuflaje del desierto', 2899, 'assets/tenis2.jpg', 0),
    new Producto(3, 'Nike Court Vision Low Next Nature - Vela/Blanco/Naranja seguridad', 1799, 'assets/tenis3.jpg', 0),
    new Producto(4, 'Nike Blazer Mid 77 Vintage - Blanco/Blanco cumbre/Vela/Azul royal intenso', 2499, 'assets/tenis4.jpg', 0),
    new Producto(5, 'Nike Air Force 1 07 - Blanco/Blanco', 3199, 'assets/tenis5.jpg', 0),
    new Producto(6, 'Air Jordan 1 Mid -  Blanco/Blanco/Blanco', 2899, 'assets/tenis6.jpg', 0),
    new Producto(7, 'Nike Air Force 1 07 LV8 - Azul marino militar/Marrón claro goma/Blanco cumbre', 1959, 'assets/tenis7.jpg', 0),
    new Producto(8, 'Tenis Campus 00s - Grey Three / Carbon / Off White', 2299, 'assets/tenis8.jpg', 0),
    new Producto(9, 'Tenis Grand Court Alpha - Collegiate Green / Better Scarlet / Off White', 1599, 'assets/tenis9.jpg', 0),
    new Producto(10, 'Tenis Busenitz Vulc II - Legend Ink / Olive Strata / Gold Metallic', 1549, 'assets/tenis10.jpg', 0),
    new Producto(11, 'Tenis Rivalry Lux Low Agave - Off White / Linen Green / Cloud White', 2199, 'assets/tenis11.jpg', 0),
    new Producto(12, 'Tenis Forum Low CL Agave - Linen Green / Ivory / Cream White', 2199, 'assets/tenis12.jpg', 0),
    new Producto(13, 'Tenis Campus 00s - Preloved Bronze / Preloved Bronze / Gum', 2199, 'assets/tenis13.jpg', 0),
    new Producto(14, 'Tenis Samba OG - Earth Strata / Wonder White / Magic Beige', 2299, 'assets/tenis14.jpg', 0),
  ];

  constructor() {
    this.cargarProductosEnLocalStorage(); // Cargar productos al iniciar
  }

  // Guardar un XML de ejemplo en localStorage si no existe uno
  private cargarProductosEnLocalStorage(): void {
    let productosGuardados = localStorage.getItem('productos');
    
    if (!productosGuardados) {
      // Si no hay productos guardados, guardamos un XML de ejemplo
      const productosXML = this.convertirProductosAXML(this.productosIniciales);  // Convierte los productos iniciales a XML
      localStorage.setItem('productos', productosXML);  // Guardamos el XML en localStorage
    }
  }

  // Convertir productos a XML
  private convertirProductosAXML(productos: Producto[]): string {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<productos>\n';
    productos.forEach(producto => {
      xml += `  <producto>\n`;
      xml += `    <id>${producto.id}</id>\n`;
      xml += `    <nombre>${this.escapeXML(producto.nombre)}</nombre>\n`;
      xml += `    <precio>${producto.precio}</precio>\n`;
      xml += `    <imagen>${this.escapeXML(producto.imagen)}</imagen>\n`;
      xml += `  </producto>\n`;
    });
    xml += '</productos>';
  

    return xml;
  }

  private escapeXML(str: string): string {
    return str.replace(/[&<>"']/g, (char) => {
      const charMap: any = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&apos;',
      };
      return charMap[char] || char;
    });
  }

  // Convertir XML a productos
  private convertirXMLAProducto(xmlString: string): Producto[] {
    console.log("XML a analizar:", xmlString);  // Imprimir el XML antes de analizarlo
    
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "application/xml");
  
    // Verificar si hubo errores en la conversión
    const parseError = xmlDoc.querySelector('parsererror');
    if (parseError) {
      console.error('Error en el formato XML:', parseError);
      return [];  // Retornar un arreglo vacío si el XML es inválido
    }

    const productosNodeList = xmlDoc.getElementsByTagName("producto");
    let productos: Producto[] = [];
    
    Array.from(productosNodeList).forEach(productoNode => {
      const id = parseInt(productoNode.getElementsByTagName("id")[0].textContent || "0");
      const nombre = productoNode.getElementsByTagName("nombre")[0].textContent || "";
      const precio = parseFloat(productoNode.getElementsByTagName("precio")[0].textContent || "0");
      const imagen = productoNode.getElementsByTagName("imagen")[0].textContent || "";;
      
      productos.push(new Producto(id, nombre, precio, imagen, 0));
    });
  
    return productos;
  }

  // Obtener los productos desde localStorage (como XML)
  obtenerProducto(): Producto[] {
    const productosGuardados = localStorage.getItem('productos');
    if (productosGuardados) {
      try {
        return this.convertirXMLAProducto(productosGuardados); // Convertimos el XML de nuevo a productos
      } catch (error) {
        console.error('Error al analizar XML:', error);
        return [];
      }
    } else {
      return [];
    }
  }

  // Método para actualizar un producto en localStorage (como XML)
  actualizarProducto(producto: Producto): void {
    let productos = this.obtenerProducto();
    const index = productos.findIndex(p => p.id === producto.id);
    if (index !== -1) {
      productos[index] = producto;  // Actualizamos el producto
      localStorage.setItem('productos', this.convertirProductosAXML(productos));  // Guardamos el XML actualizado en localStorage
    }
  }

}
