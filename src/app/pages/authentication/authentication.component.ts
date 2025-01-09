import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormAuthorizationComponent } from './form-authorization/form-authorization.component';
import { FormRegistrationComponent } from './form-registration/form-registration.component';
import { PopUpConfirmEmailComponent } from './pop-up-confirm-email/pop-up-confirm-email.component';

@Component({
  selector: 'app-authentication',
  standalone: true,
  imports: [CommonModule, FormAuthorizationComponent, FormRegistrationComponent, PopUpConfirmEmailComponent],
  templateUrl: './authentication.component.html',
  styleUrl: './authentication.component.scss'
})
export class AuthenticationComponent {
  isRightPanelActive = false;
  visibleBtns: boolean = true;

  togglePanel(isSignUp: boolean) {
    this.isRightPanelActive = isSignUp;
  }

  onVisibleBtnsChange(value: boolean): void {
    this.visibleBtns = value;
  }

}