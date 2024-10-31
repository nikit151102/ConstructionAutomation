import { Component } from '@angular/core';
import { AuthenticationComponent } from '../../components/authentication/authentication.component';

@Component({
  selector: 'app-login-signup',
  standalone: true,
  imports: [AuthenticationComponent],
  templateUrl: './login-signup.component.html',
  styleUrl: './login-signup.component.scss'
})
export class LoginSignupComponent {

}
