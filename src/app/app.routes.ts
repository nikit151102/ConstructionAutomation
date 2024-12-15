import { Routes } from '@angular/router';
import { AuthGuard } from './pages/personal-account/auth.guard';

export const routes: Routes = [
    {
        path: '',  loadChildren: () => import('./pages/login-signup/login-signup.module').then(m => m.LoginSignupModule)
    },
    {
        path: 'login',  loadChildren: () => import('./pages/login-signup/login-signup.module').then(m => m.LoginSignupModule)
    },
    {
        // canActivate: [AuthGuard]
        path: ':id',  loadChildren: () => import('./pages/personal-account/personal-account.module').then(m => m.PersonalAccountModule)
    },

];
