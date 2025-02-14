import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PersonalAccountComponent } from './personal-account.component';

const routes: Routes = [
  {
    path: '', 
    component: PersonalAccountComponent,
    children: [
      {
        path: '',
        redirectTo: 'profile', 
        pathMatch: 'full'  
      },      
      {
        path: 'thanks', loadChildren: () => import('./thanks/thanks.module').then(m => m.ThanksModule)
      },
      {
        path: 'home', 
        loadChildren: () => import('./home/home.module').then(m => m.HomeModule) 
      },
      {
        path: 'profile', 
        loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule) 
      },
      {
        path: 'myDocs', 
        loadChildren: () => import('./my-documents/my-documents.module').then(m => m.MyDocumentsModule) 
      },

      {
        path:'referenceBook/:typeId',
        loadChildren: () => import('./reference-book/reference-book.module').then(m => m.ReferenceBookModule)
      },
      {
        path: ':configType', 
        loadChildren: () => import('./documents/documents.module').then(m => m.DocumentsModule) 
      },
      {
        path: 'thanks', loadChildren: () => import('./thanks/thanks.module').then(m => m.ThanksModule)
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],  
  exports: [RouterModule]
})
export class PersonalAccountPagesRoutingModule { }
