import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CustomButtonComponent } from '../../../ui-kit/custom-button/custom-button.component';
import { FormAuthorizationService } from './form-authorization.service';
import { Router } from '@angular/router';
import { TokenService } from '../../../services/token.service';
import { CurrentUserService } from '../../../services/current-user.service';
import { PopUpEntryComponent } from '../pop-up-entry/pop-up-entry.component';
import { ProgressSpinnerService } from '../../progress-spinner/progress-spinner.service';
import { ToastService } from '../../../services/toast.service';
import { CookieConsentService } from '../../../services/cookie-consent.service';

@Component({
  selector: 'app-form-authorization',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, InputTextModule, FloatLabelModule, PasswordModule, CustomButtonComponent, PopUpEntryComponent],
  templateUrl: './form-authorization.component.html',
  styleUrls: ['./form-authorization.component.scss']
})
export class FormAuthorizationComponent implements OnInit {
  signInForm: FormGroup;

  constructor(private fb: FormBuilder,
    private AuthorizationService: FormAuthorizationService,
    private router: Router,
    private tokenService: TokenService,
    private progressSpinnerService: ProgressSpinnerService,
    private toastService: ToastService,
    private currentUserService: CurrentUserService,
    private cookieConsentService: CookieConsentService
  ) {
    this.signInForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit() {
    setTimeout(() => {
      const usernameInput = document.getElementById('username') as HTMLInputElement;
      const passwordInput = document.getElementById('password') as HTMLInputElement;

      if (usernameInput) {
        usernameInput.type = 'text';
        setTimeout(() => usernameInput.type = 'text', 100);
      }

      if (passwordInput) {
        passwordInput.type = 'text';
        setTimeout(() => passwordInput.type = 'password', 100);
      }
    });
  }

  onSignIn() {
    this.signInForm.markAllAsTouched();

    if (this.signInForm.valid) {

      if (!this.cookieConsentService.hasConsented()) {
        this.cookieConsentService.revokeConsent();
        this.toastService.showWarn('Предупреждение', 'Вы должны согласиться на использование cookie');
        return;
      }

      this.progressSpinnerService.show();

      const formData = this.signInForm.value;

      const Data = {
        UserName: formData.username,
        Email: formData.username,
        Password: formData.password,
      };
      console.log("Data", Data)
      this.AuthorizationService.signIn(Data).subscribe(
        (response) => {
          if (response.data) {
            this.progressSpinnerService.hide();
            this.currentUserService.getUserData();
            this.tokenService.setToken(response.data.token);
            this.router.navigate([`/${response.data.id}`]);
            localStorage.setItem('VXNlcklk', response.data.id);
            
          }

        },
        (error) => {
          this.progressSpinnerService.hide();
          this.toastService.showError('Ошибка', 'Ошибка при входе')
        }
      );
    } else {
      this.toastService.showWarn('Предупреждение', 'Форма невалидна')
    }
  }


  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.onSignIn();
    }
  }

}
