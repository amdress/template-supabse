import { Routes } from '@angular/router';


export const CompanyRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard'
  },
  {
    path:'dashboard',
    loadComponent: () => import ('./pages/dashboard/dashboard.page').then(m => m.DashboardPage)
  },

];