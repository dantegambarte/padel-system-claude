import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { CashRegisterRoutingModule } from './cash-register-routing.module';
import { CashRegisterDailyComponent } from './pages/cash-register-daily/cash-register-daily.component';
import { CashRegisterHistoryComponent } from './pages/cash-register-history/cash-register-history.component';

@NgModule({
  declarations: [
    CashRegisterDailyComponent,
    CashRegisterHistoryComponent
  ],
  imports: [
    SharedModule,
    CashRegisterRoutingModule
  ]
})
export class CashRegisterModule { }
