import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { SalesRoutingModule } from './sales-routing.module';
import { SaleListComponent } from './pages/sale-list/sale-list.component';

@NgModule({
  declarations: [SaleListComponent],
  imports: [SharedModule, SalesRoutingModule]
})
export class SalesModule { }
