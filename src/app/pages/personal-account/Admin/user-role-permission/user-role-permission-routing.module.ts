import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserRolePermissionComponent } from './user-role-permission.component';

const routes: Routes = [
  {
    path: '', 
    component: UserRolePermissionComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],  
  exports: [RouterModule]
})
export class UserRolePermissionPagesRoutingModule { }
