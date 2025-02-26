import { Injectable } from '@angular/core';
import { Producto } from '../models/producto';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private productos:Producto[]=[
    new Producto (1,'laptop',1200,'assets/laptop.jpg'),
    new Producto (2,'smartphone',800,'assets/smartphone.jpg'),
    new Producto (3,'Tablet',600,'assets/tablet.jpg'),
  ];
  obtenerProducto():Producto[]{
     return this.productos;
  }
  
}
