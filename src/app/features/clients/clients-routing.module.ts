import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientListComponent } from './pages/client-list/client-list.component';
import { ClientDetailComponent } from './pages/client-detail/client-detail.component';

const routes: Routes = [
  {
    path: '',
    component: ClientListComponent
  },
  {
    path: ':id',
    component: ClientDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientsRoutingModule { }
