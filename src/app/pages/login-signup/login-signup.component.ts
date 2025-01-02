import { Component } from '@angular/core';
import { AuthenticationComponent } from '../../components/authentication/authentication.component';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-login-signup',
  standalone: true,
  imports: [AuthenticationComponent],
  templateUrl: './login-signup.component.html',
  styleUrl: './login-signup.component.scss'
})
export class LoginSignupComponent {

  isSessionExpired: boolean = false;

  constructor(private toastService: ToastService) { }

  ngOnInit(): void {
    const navigationState = window.history.state;
    this.isSessionExpired = navigationState.isSessionExpired || false;

    if (this.isSessionExpired) {
      this.toastService.showWarn('Сессия истекла', 'Пожалуйста, войдите в систему заново.'
      );
    }
  }

}
