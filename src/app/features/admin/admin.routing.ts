import { Routes } from '@angular/router';
import { UsersListComponent } from './components/users/users-list/user-list.component';
import { UserDetailComponent } from './components/users/user-detail/user-detail.component';
import { RolesListComponent } from './components/roles/roles-list/roles-list.component';
import { DashboardLayoutPage } from './pages/dashboard-layout/dashboard-layout.page';
import { DashboardComponent } from './components/dashboard/dashboard/dashboard.component';
import { RoleGuard } from 'src/app/core/guards/role.guard';


export const AdminRoutes: Routes = [
  {
    path: '',
    component: DashboardLayoutPage, // contiene el sidebar y router-outlet
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      { 
        path: 'users',
        component: UsersListComponent 
      },
      {
        path: 'user-detail',
        component: UserDetailComponent
      },
      {
        path: 'roles',
        component: RolesListComponent
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];