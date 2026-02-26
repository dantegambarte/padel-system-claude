import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Angular Material Modules
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';

// Components
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { DataTableComponent } from './components/data-table/data-table.component';

// Pipes
import { CurrencyArsPipe } from './pipes/currency-ars.pipe';
import { PhoneFormatPipe } from './pipes/phone-format.pipe';
import { TimeFormatPipe } from './pipes/time-format.pipe';
import { DateFormatPipe } from './pipes/date-format.pipe';

// Directives
import { ClickOutsideDirective } from './directives/click-outside.directive';
import { AutofocusDirective } from './directives/autofocus.directive';

const materialModules = [
  MatToolbarModule,
  MatButtonModule,
  MatIconModule,
  MatSidenavModule,
  MatListModule,
  MatCardModule,
  MatInputModule,
  MatFormFieldModule,
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  MatDialogModule,
  MatSelectModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatProgressSpinnerModule,
  MatSnackBarModule,
  MatChipsModule,
  MatBadgeModule,
  MatTooltipModule,
  MatMenuModule,
  MatCheckboxModule,
  MatRadioModule,
  MatSlideToggleModule,
  MatAutocompleteModule,
  MatTabsModule,
  MatExpansionModule,
];

const components = [
  NavbarComponent,
  SidebarComponent,
  LoadingSpinnerComponent,
  ConfirmDialogComponent,
  DataTableComponent,
];

const pipes = [
  CurrencyArsPipe,
  PhoneFormatPipe,
  TimeFormatPipe,
  DateFormatPipe,
];

const directives = [AutofocusDirective, ClickOutsideDirective];

/**
 * Shared Module
 * Contiene componentes, pipes y directivas reutilizables
 * Se importa en todos los feature modules que lo necesiten
 */
@NgModule({
  declarations: [...components, ...pipes, ...directives],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    ...materialModules,
  ],
  exports: [
    // Módulos comunes
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,

    // Material modules
    ...materialModules,

    // Componentes
    ...components,

    // Pipes
    ...pipes,

    // Directivas
    ...directives,
  ],
})
export class SharedModule {}
