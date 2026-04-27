import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { LoginSuccessComponent } from './pages/login-success/login-success.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { DashboardLayoutComponent } from './layout/dashboard-layout/dashboard-layout.component';

export const routes: Routes = [
    {path: 'login', component: LoginComponent},
    {path: 'forgot-password', component: ForgotPasswordComponent},
    {path: 'reset-password', component: ResetPasswordComponent},
    {path: 'login-success', component: LoginSuccessComponent},
    {
        path: '',
        component: DashboardLayoutComponent,
        children: [
            {path: 'pets', loadComponent: () => import('./pages/pets/pet-list/pet-list.component').then(m => m.PetListComponent)
            },
            { path: '', redirectTo: 'pets', pathMatch: 'full' }
        ]
    },

    {path: '**', redirectTo: '/login'}
];
