import { Component, Input, Output, EventEmitter, ViewChild, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  type?: 'text' | 'number' | 'date' | 'currency' | 'badge' | 'actions';
  pipe?: any; // Para formateo personalizado
  width?: string;
}

export interface TableAction {
  icon: string;
  label: string;
  color?: 'primary' | 'accent' | 'warn';
  action: (row: any) => void;
  show?: (row: any) => boolean; // Condición para mostrar el botón
}

/**
 * Componente de tabla reutilizable con paginación, ordenamiento y acciones
 * Uso:
 * <app-data-table
 *   [data]="items"
 *   [columns]="columns"
 *   [actions]="actions"
 *   [pageSize]="10"
 *   (pageChange)="onPageChange($event)"
 *   (sortChange)="onSortChange($event)">
 * </app-data-table>
 */
@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit, OnChanges {
  @Input() data: any[] = [];
  @Input() columns: TableColumn[] = [];
  @Input() actions: TableAction[] = [];
  @Input() pageSize: number = 10;
  @Input() pageSizeOptions: number[] = [5, 10, 25, 50];
  @Input() showPagination: boolean = true;
  @Input() loading: boolean = false;

  @Output() pageChange = new EventEmitter<PageEvent>();
  @Output() sortChange = new EventEmitter<Sort>();
  @Output() rowClick = new EventEmitter<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = [];

  ngOnInit(): void {
    this.setupColumns();
    this.setupDataSource();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.dataSource.data = this.data;
    }
    if (changes['columns']) {
      this.setupColumns();
    }
  }

  private setupColumns(): void {
    this.displayedColumns = this.columns.map(col => col.key);
    if (this.actions && this.actions.length > 0) {
      this.displayedColumns.push('actions');
    }
  }

  private setupDataSource(): void {
    this.dataSource.data = this.data;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  onPageChangeInternal(event: PageEvent): void {
    this.pageChange.emit(event);
  }

  onSortChangeInternal(event: Sort): void {
    this.sortChange.emit(event);
  }

  onRowClick(row: any): void {
    this.rowClick.emit(row);
  }

  shouldShowAction(action: TableAction, row: any): boolean {
    return action.show ? action.show(row) : true;
  }

  executeAction(action: TableAction, row: any, event: Event): void {
    event.stopPropagation(); // Evitar que se dispare el rowClick
    action.action(row);
  }

  getColumnValue(row: any, column: TableColumn): any {
    const value = row[column.key];
    
    if (column.pipe) {
      return column.pipe.transform(value);
    }
    
    return value;
  }
}
