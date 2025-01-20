import { Routes } from '@angular/router';
import { AuthGuard } from './pages/personal-account/auth.guard';
import { HomeComponent } from './pages/home/home.component';
import { OfferInformationComponent } from './components/offer-information/offer-information.component';

export const routes: Routes = [
    {
        path: '', component: HomeComponent
    },
    {
        path: 'contacts', loadChildren: () => import('./pages/contacts/contacts.module').then(m => m.ContactsModule)
    },
    {
        path: 'login', loadChildren: () => import('./pages/authentication/authentication.module').then(m => m.AuthenticationModule)
    },
    {
        path: 'legal/:optionalParam',
        loadChildren: () => import('./components/legal-information/legal-information.module').then(m => m.LegalInformationModule)
    },
    {
        path: 'verification/:optionalParam', loadChildren: () => import('./pages/verification/verification.module').then(m => m.VerificationModule)
    },
    {
        path: 'offerInformation', component: OfferInformationComponent
    },
    {
        // canActivate: [AuthGuard]
        path: ':id', loadChildren: () => import('./pages/personal-account/personal-account.module').then(m => m.PersonalAccountModule)
    },


];
