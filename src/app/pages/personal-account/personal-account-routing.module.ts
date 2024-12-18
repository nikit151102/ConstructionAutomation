import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PersonalAccountComponent } from './personal-account.component';
import { MapComponent } from './map/map.component';

const routes: Routes = [
  {
    path: '', 
    component: PersonalAccountComponent,
    children: [
      {
        path: '',
        redirectTo: 'home', 
        pathMatch: 'full'  
      },
      {
        path: 'home', 
        component: MapComponent
      },
      {
        path: 'profile', 
        loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule) 
      },
      {
        path: 'map', component: MapComponent
      },
      {
        path: 'myDocs', 
        loadChildren: () => import('./my-documents/my-documents.module').then(m => m.MyDocumentsModule) 
      },
      {
        path: ':configType', 
        loadChildren: () => import('./documents/documents.module').then(m => m.DocumentsModule) 
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],  
  exports: [RouterModule]
})
export class PersonalAccountPagesRoutingModule { }
