import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarritoService } from '../../services/carrito.service';
import { Router } from '@angular/router';

declare var paypal: any;

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css'],
})
export class CarritoComponent implements AfterViewInit, OnDestroy {
  carrito: any[] = [];
  recibo: string = ''; 
  subtotal: number = 0;
  iva: number = 0;
  total: number = 0;
  private paypalButton: any;

  constructor(private carritoService: CarritoService, private router: Router) {}

  ngOnInit() {
    this.actualizarCarrito();
  }

  ngAfterViewInit() {
    // No cargamos el botón aquí, lo haremos cuando se genere el recibo
  }

  ngOnDestroy() {
    if (this.paypalButton) {
      this.paypalButton.close();
    }
  }

  private loadPayPalButton() {
    // ... (código anterior igual)
  
    try {
      let paymentDetails: any = null;
      let totalPago = 0; // Variable para guardar el total
  
      this.paypalButton = paypal.Buttons({
        style: {
          shape: 'rect',
          color: 'gold',
          layout: 'horizontal',
          label: 'paypal',
          height: 30
        },
        createOrder: (data: any, actions: any) => {
          totalPago = this.total; // Guardamos el total actual
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: totalPago.toFixed(2), // Usamos el total guardado
                currency_code: 'USD'
              }
            }]
          });
        },
        onApprove: (data: any, actions: any) => {
          return actions.order.capture().then((details: any) => {
            paymentDetails = details;
            this.carritoService.limpiarCarrito();
            this.actualizarCarrito();
          });
        },
        onError: (err: any) => {
          paymentDetails = { error: err };
        },
        onCancel: (data: any) => {
          paymentDetails = { cancelled: true };
        },
        onClose: () => {
          if (paymentDetails && !paymentDetails.error && !paymentDetails.cancelled) {
            alert(`✅ Pago completado!\n\nGracias por tu compra ${paymentDetails.payer.name.given_name}\n\nTotal: $${totalPago.toFixed(2)}`); // Usamos el total guardado
            this.router.navigate(['/productos']);
          } else if (paymentDetails?.error) {
            alert('Error en el pago: ' + paymentDetails.error.message);
          }
        }
      });
  
      if (this.paypalButton.isEligible()) {
        this.paypalButton.render('#paypal-button-container');
      }
    } catch (error) {
      console.error('Error al crear botón PayPal:', error);
    }
  }
  generarXML() {
    this.recibo = this.carritoService.generarXML();
    this.actualizarCarrito();
    
    console.log('Total actual:', this.total);
    
    if (this.total <= 0) {
      console.warn('El total debe ser mayor que 0 para mostrar PayPal');
      return;
    }
  
    // Cargar PayPal inmediatamente sin setTimeout
    this.loadPayPalButton();
  }

  // Resto de tus métodos permanecen igual...
  eliminarProducto(index: number) {
    const producto = this.carrito[index];
    this.carritoService.eliminarProducto(index);
    this.actualizarCarrito();
  }

  descargarXML() {
    if (!this.recibo) return;

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

  modificarCantidad(index: number, cantidad: number) {
    const producto = this.carrito[index];
    
    if (producto.cantidad + cantidad >= 1) {
      producto.cantidad += cantidad;
    }
    
    this.actualizarCarrito();
  }



  regresar(): void {
    this.router.navigate(['/productos']);
  }
}