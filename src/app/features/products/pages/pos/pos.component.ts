import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.interface';
import { NotificationService } from '../../../../core/services/notification.service';

interface CartItem {
  product: Product;
  cantidad: number;
  subtotal: number;
}

@Component({
  selector: 'app-pos',
  templateUrl: './pos.component.html',
  styleUrls: ['./pos.component.scss']
})
export class PosComponent implements OnInit {
  products: Product[] = [];
  cart: CartItem[] = [];
  loading = false;
  searchQuery = '';

  constructor(
    private productService: ProductService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getProducts({ page: 1, limit: 100 }).subscribe({
      next: (response) => {
        this.products = response.data.filter(p => p.activo);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  get filteredProducts(): Product[] {
    if (!this.searchQuery) {
      return this.products;
    }
    const query = this.searchQuery.toLowerCase();
    return this.products.filter(p => 
      p.nombre.toLowerCase().includes(query)
    );
  }

  addToCart(product: Product): void {
    const existingItem = this.cart.find(item => item.product.id === product.id);
    
    if (existingItem) {
      existingItem.cantidad++;
      existingItem.subtotal = existingItem.cantidad * product.precio_venta;
    } else {
      this.cart.push({
        product,
        cantidad: 1,
        subtotal: product.precio_venta
      });
    }

    this.notificationService.showSuccess(`${product.nombre} añadido al carrito`);
  }

  removeFromCart(index: number): void {
    this.cart.splice(index, 1);
  }

  updateQuantity(item: CartItem, newQuantity: number): void {
    if (newQuantity <= 0) {
      const index = this.cart.indexOf(item);
      this.removeFromCart(index);
      return;
    }
    
    item.cantidad = newQuantity;
    item.subtotal = item.cantidad * item.product.precio_venta;
  }

  get total(): number {
    return this.cart.reduce((sum, item) => sum + item.subtotal, 0);
  }

  clearCart(): void {
    this.cart = [];
  }

  processSale(): void {
    if (this.cart.length === 0) {
      this.notificationService.showWarning('El carrito está vacío');
      return;
    }

    // TODO: Implementar llamada al servicio de ventas
    this.notificationService.showInfo('Funcionalidad de venta en desarrollo');
    console.log('Venta:', {
      items: this.cart,
      total: this.total
    });
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }
}
