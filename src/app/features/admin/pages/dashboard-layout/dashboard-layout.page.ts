import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from 'src/app/core/services/access-control/auth/auth.service';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/core/services/access-control/session/session.service';
import { UserModel } from 'src/app/core/models/user.model';


@Component({
  selector: 'app-dashboard-layout',
  templateUrl: './dashboard-layout.page.html',
  styleUrls: ['./dashboard-layout.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class DashboardLayoutPage implements OnInit {
  user!: UserModel;

  constructor(
    private authSvc: AuthService,
    private sessionSvc: SessionService,
    private router: Router
  ) { }

  ngOnInit() {
    const currentUser = this.sessionSvc.getCurrentUser();
    console.log('Usuario logueado', currentUser)
    if (currentUser) {
      this.user = currentUser;
    } else {
      // Manejo opcional si no hay usuario logueado
      this.user = { fullName: '', email: '', id: '' };
    }
  }

  logout(){
    this.authSvc.signOut()
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }


}
