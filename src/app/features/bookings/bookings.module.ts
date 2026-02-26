import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { BookingsRoutingModule } from './bookings-routing.module';
import { BookingListComponent } from './pages/booking-list/booking-list.component';

@NgModule({
  declarations: [
    BookingListComponent
  ],
  imports: [
    SharedModule,
    BookingsRoutingModule
  ]
})
export class BookingsModule { }
