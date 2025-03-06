import { Injectable } from "@angular/core";
import { Producto } from "../models/producto";

@Injectable({
    providedIn:'root'
})

export class CarritoService {
    private carrito: Producto[] = [];

    agregarProducto(producto: Producto) {
        this.carrito.push(producto);
    }

    obtenerCarrito(): Producto[] {
        return this.carrito;
    }

    eliminarProducto(index: number) {
        if (index >= 0 && index < this.carrito.length) {
            this.carrito.splice(index, 1);
        }
    }

    calcularSubtotal(): number {
        return this.carrito.reduce((total, producto) => total + producto.precio, 0);
    }

    calcularIVA(): number {
        const subtotal = this.calcularSubtotal();
        return subtotal * 0.16; // Asumiendo un IVA del 16%
    }

    calcularTotal(): number {
        return this.calcularSubtotal() + this.calcularIVA();
    }

    generarXML(): string {
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<recibo>\n';
        
        // Añadir productos al XML
        this.carrito.forEach((producto) => {
            xml += ` <producto id="${producto.id}" >\n`;
            xml += `  <nombre>${producto.nombre}</nombre>\n`;
            xml += `  <precio>${producto.precio}</precio>\n`;
            xml += ` </producto>\n`;
        });

        // Añadir subtotal, IVA y total al XML
        const subtotal = this.calcularSubtotal();
        const iva = this.calcularIVA();
        const total = this.calcularTotal();

        xml += ` <tienda>Gracias por comprar en ChinoSneakers</tienda>\n`;
        xml += ` <subtotal>${subtotal.toFixed(2)}</subtotal>\n`;
        xml += ` <iva>${iva.toFixed(2)}</iva>\n`;
        xml += ` <total>${total.toFixed(2)}</total>\n`;

        xml += '</recibo>';
        return xml;
    }
}
