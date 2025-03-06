import { Injectable } from '@angular/core';
import { Producto } from '../models/producto';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private productos:Producto[]=[
    new Producto(1, 'Nike Jordan 1 Mid - Vela/Sombrío apagado/Blanco/Rojo gimnasio', 3199, 'assets/tenis1.jpg'),
    new Producto(2, 'Air Jordan 1 Low -  Ratán/Vela/Camuflaje del desierto', 2899, 'assets/tenis2.jpg'),
    new Producto(3, 'Nike Court Vision Low Next Nature - Vela/Blanco/Naranja seguridad', 1799, 'assets/tenis3.jpg'),
    new Producto(4, 'Nike Blazer Mid 77 Vintage - Blanco/Blanco cumbre/Vela/Azul royal intenso', 2499, 'assets/tenis4.jpg'),
  ];
  
  obtenerProducto():Producto[]{
     return this.productos;
  }
}