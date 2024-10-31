import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginSignupComponent } from './login-signup.component';
const routes: Routes = [
  {
    path: '', component: LoginSignupComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],  
  exports: [RouterModule]
})
export class LoginPagesRoutingModule { }
