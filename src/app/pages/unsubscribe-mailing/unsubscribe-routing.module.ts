import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UnsubscribeMailingComponent } from './unsubscribe-mailing.component';

const routes: Routes = [
  {
    path: '', 
    component: UnsubscribeMailingComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],  
  exports: [RouterModule]
})
export class UnsubscribeRoutingModule { }
