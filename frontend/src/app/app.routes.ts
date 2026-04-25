import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { LoginSuccess } from './pages/login-success/login-success';
import { ForgotPassword } from './pages/forgot-password/forgot-password';
import { ResetPassword } from './pages/reset-password/reset-password';

export const routes: Routes = [
    {path: 'login', component: Login},
    {path: 'forgot-password', component: ForgotPassword},
    {path: 'reset-password', component: ResetPassword},
    {path: 'login-success', component: LoginSuccess},
    {path: '', redirectTo: '/login', pathMatch: 'full'}
];
