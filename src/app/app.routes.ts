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
        path: 'legal/:optionalParam', 
        loadChildren: () => import('./components/legal-information/legal-information.module').then(m => m.LegalInformationModule) 
      },
    {
        // canActivate: [AuthGuard]
        path: ':id',  loadChildren: () => import('./pages/personal-account/personal-account.module').then(m => m.PersonalAccountModule)
    }

];
