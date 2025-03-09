import { Routes } from '@angular/router';
import { authGuard, loginGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent),
    canActivate: [loginGuard]
  },
  {
    path: 'list',
    loadComponent: () => import('./components/list/list.component').then(m => m.ListComponent),
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];
