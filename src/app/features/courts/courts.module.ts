import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { CourtsRoutingModule } from './courts-routing.module';
import { CourtListComponent } from './pages/court-list/court-list.component';

@NgModule({
  declarations: [
    CourtListComponent
  ],
  imports: [
    SharedModule,
    CourtsRoutingModule
  ]
})
export class CourtsModule { }
