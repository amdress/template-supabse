import { Routes } from '@angular/router';

import { NoAuthGuard } from './core/guards/no-auth.guard';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';

import { AuthRoutes } from './features/auth/auth.routing';
import { AdminRoutes } from './features/admin/admin.routing';

import { CompanyRoutes } from './modules/company/company.routing';
import { UserRoutes } from './modules/user/user.routing';


export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    canActivate: [NoAuthGuard],
    children: AuthRoutes,
  },
  {
    path: 'admin',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin'] },
    children: AdminRoutes,
  },
  {
    path: 'user',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['user'] },
    children: UserRoutes,
  },
  {
    path: 'company',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['bussiness'] },
    children: CompanyRoutes,
  },
  {
    path: 'unauthorized',
    loadComponent: () => import('./features/unauthorized/unauthorized.page').then( m => m.UnauthorizedPage)
  },

 
];
