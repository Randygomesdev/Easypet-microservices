import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { LoginSuccessComponent } from './pages/login-success/login-success.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { DashboardLayoutComponent } from './layout/dashboard-layout/dashboard-layout.component';
import { PetListComponent } from './pages/pets/pet-list/pet-list.component';
import { authGuard } from './guards/auth.guard';
import { PetDetailsComponent } from './pages/pets/pet-details/pet-details.component';

export const routes: Routes = [
    {path: 'login', component: LoginComponent},
    {path: 'forgot-password', component: ForgotPasswordComponent},
    {path: 'reset-password', component: ResetPasswordComponent},
    {path: 'login-success', component: LoginSuccessComponent},
    { path: '', redirectTo: '/pets', pathMatch: 'full' },
    
    {
        path: '',
        component: DashboardLayoutComponent,
        canActivate: [authGuard],
        children: [
            { path: 'pets', component: PetListComponent },
            { path: 'pets/:id', component: PetDetailsComponent },
        ]
    },

    { path: '**', redirectTo: '/login' }
];
