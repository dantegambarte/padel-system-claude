import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product, ProductCategory } from '../../models/product.interface';
import { TableColumn, TableAction } from '../../../../shared/components/data-table/data-table.component';
import { NotificationService } from '../../../../core/services/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  loading = false;
  selectedCategory: string = 'all';
  
  categories = [
    { value: 'all', label: 'Todas' },
    { value: ProductCategory.BEBIDA, label: 'Bebidas' },
    { value: ProductCategory.COMIDA, label: 'Comidas' },
    { value: ProductCategory.ALQUILER, label: 'Alquileres' },
    { value: ProductCategory.OTRO, label: 'Otros' }
  ];

  columns: TableColumn[] = [
    { key: 'nombre', label: 'Producto', sortable: true },
    { key: 'categoria', label: 'Categoría', sortable: true },
    { key: 'precio_venta', label: 'Precio', type: 'currency', sortable: true },
    { key: 'stock_actual', label: 'Stock', sortable: true },
    { key: 'stock_minimo', label: 'Stock Mín.', sortable: false }
  ];

  actions: TableAction[] = [
    {
      icon: 'edit',
      label: 'Editar',
      color: 'primary',
      action: (row) => this.edit(row)
    },
    {
      icon: 'add_circle',
      label: 'Añadir Stock',
      color: 'accent',
      action: (row) => this.addStock(row),
      show: (row) => row.requiere_stock
    },
    {
      icon: 'remove_circle',
      label: 'Quitar Stock',
      color: 'warn',
      action: (row) => this.removeStock(row),
      show: (row) => row.requiere_stock && row.stock_actual > 0
    },
    {
      icon: 'delete',
      label: 'Eliminar',
      color: 'warn',
      action: (row) => this.delete(row)
    }
  ];

  constructor(
    private productService: ProductService,
    private router: Router,
    private notificationService: NotificationService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getProducts({ page: 1, limit: 100 }).subscribe({
      next: (response) => {
        this.products = response.data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  onCategoryChange(): void {
    this.loadProducts();
  }

  get filteredProducts(): Product[] {
    if (this.selectedCategory === 'all') {
      return this.products;
    }
    return this.products.filter(p => p.categoria === this.selectedCategory);
  }

  get lowStockCount(): number {
    return this.products.filter(p => 
      p.requiere_stock && p.stock_actual <= p.stock_minimo
    ).length;
  }

  create(): void {
    this.router.navigate(['/products/new']);
  }

  edit(product: Product): void {
    this.router.navigate(['/products', product.id, 'edit']);
  }

  addStock(product: Product): void {
    const cantidad = prompt(`¿Cuántas unidades deseas añadir a ${product.nombre}?`);
    if (cantidad && !isNaN(Number(cantidad))) {
      this.productService.adjustStock({
        product_id: product.id,
        cantidad: Number(cantidad),
        tipo: 'ingreso',
        motivo: 'Ajuste manual'
      }).subscribe({
        next: () => {
          this.notificationService.showSuccess('Stock actualizado');
          this.loadProducts();
        }
      });
    }
  }

  removeStock(product: Product): void {
    const cantidad = prompt(`¿Cuántas unidades deseas quitar de ${product.nombre}?`);
    if (cantidad && !isNaN(Number(cantidad))) {
      this.productService.adjustStock({
        product_id: product.id,
        cantidad: Number(cantidad),
        tipo: 'egreso',
        motivo: 'Ajuste manual'
      }).subscribe({
        next: () => {
          this.notificationService.showSuccess('Stock actualizado');
          this.loadProducts();
        }
      });
    }
  }

  delete(product: Product): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: '¿Eliminar producto?',
        message: `¿Estás seguro de eliminar ${product.nombre}?`,
        confirmText: 'Sí, eliminar',
        confirmColor: 'warn'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.productService.deleteProduct(product.id).subscribe({
          next: () => {
            this.notificationService.showSuccess('Producto eliminado');
            this.loadProducts();
          }
        });
      }
    });
  }

  goToPOS(): void {
    this.router.navigate(['/products/pos']);
  }
}
