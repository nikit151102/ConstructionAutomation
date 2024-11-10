import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { UserCardComponent } from './components/user-card/user-card.component';
import { FormUserComponent } from './components/form-user/form-user.component';
import { FormDeleteComponent } from './components/form-delete/form-delete.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, UserCardComponent, FormUserComponent, FormDeleteComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {

}
