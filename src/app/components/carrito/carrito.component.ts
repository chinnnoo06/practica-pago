import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarritoService } from '../../services/carrito.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css'],
})
export class CarritoComponent {
  carrito: any[] = [];
  recibo: string = ''; 
  subtotal: number = 0;
  iva: number = 0;
  total: number = 0;

  constructor(private carritoService: CarritoService, private router: Router) {}

  ngOnInit() {
    this.actualizarCarrito();
  }

  // Modificación de eliminarProducto para reducir la cantidad
  eliminarProducto(index: number) {
    const producto = this.carrito[index];
    if (producto.cantidad > 1) {
      // Si la cantidad es mayor a 1, reducimos la cantidad
      producto.cantidad -= 1;
    } else {
      // Si la cantidad es 1, eliminamos el producto
      this.carritoService.eliminarProducto(index);
    }
    this.actualizarCarrito(); // Actualizamos el carrito
  }

  generarXML() {
    this.recibo = this.carritoService.generarXML(); // Genera y almacena el XML
    this.actualizarCarrito(); // Actualizamos el carrito para reflejar los cambios
  }
  

  descargarXML() {
    if (!this.recibo) return; // No descargar si el recibo no está generado

    const blob = new Blob([this.recibo], { type: 'application/xml' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'recibo.xml'; 
    link.click();
  }

  actualizarCarrito() {
    this.carrito = this.carritoService.obtenerCarrito();
    this.subtotal = this.carritoService.calcularSubtotal();
    this.iva = this.carritoService.calcularIVA();
    this.total = this.carritoService.calcularTotal();
  }

  regresar(): void {
    this.router.navigate(['/productos']);
  }
}
