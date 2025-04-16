import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { DbConnectionService } from './core/services/db_supabase/db_conection.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor(
    private dbSvc : DbConnectionService
  ) {
    try {
      this.dbSvc.testConnection();
    } catch (error) {
      console.log(error)
    } 
  }
}
