import { Injectable } from "@angular/core";
import { Producto } from "../models/producto";

@Injectable({
    providedIn:'root'
})

export class CarritoService{
    eliminarProducto(index: number) {
        if (index >= 0 && index < this.carrito.length) {
            this.carrito.splice(index, 1);
        }
    }
    private carrito:Producto[]=[];
    agregarProducto(producto:Producto){
        this.carrito.push(producto)
    }

    obtenerCarrito():Producto[]{
        return this.carrito
    }

    generarXML(): string {
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<recibo>\n';
        this.carrito.forEach((producto) => {
            xml += ` <producto id="${producto.id}" >\n`;
            xml += `  <nombre>${producto.nombre}</nombre>\n`;
            xml += ` </producto>\n`;
        });
        xml += '</recibo>';
        return xml;
    }

}