import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FinancialReportComponent } from './pages/financial-report/financial-report.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'financial',
    pathMatch: 'full'
  },
  {
    path: 'financial',
    component: FinancialReportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
