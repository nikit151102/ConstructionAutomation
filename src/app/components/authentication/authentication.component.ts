import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormAuthorizationComponent } from './form-authorization/form-authorization.component';
import { FormRegistrationComponent } from './form-registration/form-registration.component';

@Component({
  selector: 'app-authentication',
  standalone: true,
  imports: [CommonModule, FormAuthorizationComponent, FormRegistrationComponent],
  templateUrl: './authentication.component.html',
  styleUrl: './authentication.component.scss'
})
export class AuthenticationComponent {
  isRightPanelActive = false;

  togglePanel(isSignUp: boolean) {
    this.isRightPanelActive = isSignUp;
  }

  onSignUp() {

  }

  onSignIn() {

  }

}