import { Routes } from '@angular/router';

import {HomeComponent} from './components/home/home';
import {HistoryComponent} from './components/history/history';
import { AuthFormComponent } from './auth-form/auth-form';

import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login',   component: AuthFormComponent },
  { path: 'home',    component: HomeComponent,    canActivate: [authGuard] },
  { path: 'history', component: HistoryComponent, canActivate: [authGuard] },
  { path: '',        redirectTo: 'login',          pathMatch: 'full' }
];