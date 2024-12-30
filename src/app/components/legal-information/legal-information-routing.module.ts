import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LegalInformationComponent } from './legal-information.component';

const routes: Routes = [
  {
    path: '', 
    component: LegalInformationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],  
  exports: [RouterModule]
})
export class PersonalAccountPagesRoutingModule { }
