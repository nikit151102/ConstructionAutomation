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
        redirectTo: 'home', 
        pathMatch: 'full'  
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
        path: 'comparativeStatement', 
        loadChildren: () => import('./documents/comparative-statement/comparative-statement.module').then(m => m.ComparativeStatementModule) 
      },
      {
        path: 'UserRoles', 
        loadChildren: () => import('./Admin/user-role/user-role.module').then(m => m.UserRoleModule) 
      },
      {
        path: 'UserRolePermission', 
        loadChildren: () => import('./Admin/user-role-permission/user-role-permission.module').then(m => m.UserRolePermissionModule) 
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],  
  exports: [RouterModule]
})
export class PersonalAccountPagesRoutingModule { }
