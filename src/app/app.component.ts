import { Component } from '@angular/core';

@Component({
  selector: 'root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Club de Pádel - Sistema de Gestión';

  constructor() {
    console.log('🎾 Club de Pádel - Sistema de Gestión iniciado');
  }
}
