import { Routes } from '@angular/router';
import { RoleGuard } from 'src/app/core/guards/role.guard';


export const UserRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home'
  },
  {
    path:'home',
    loadComponent: () => import ('./pages/home/home.page').then( m => m.HomePage)
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile.page').then( m => m.ProfilePage)
  }

];
