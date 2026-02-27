import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CashRegisterDailyComponent } from './pages/cash-register-daily/cash-register-daily.component';
import { CashRegisterHistoryComponent } from './pages/cash-register-history/cash-register-history.component';

const routes: Routes = [
  {
    path: '',
    component: CashRegisterDailyComponent
  },
  {
    path: 'history',
    component: CashRegisterHistoryComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CashRegisterRoutingModule { }
