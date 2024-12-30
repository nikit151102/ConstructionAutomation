import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CustomButtonComponent } from '../../../ui-kit/custom-button/custom-button.component';
import { FormRegistrationService } from './form-registration.service';
import { Router } from '@angular/router';
import { TokenService } from '../../../services/token.service';
import { CurrentUserService } from '../../../services/current-user.service';
import { PopUpEntryComponent } from '../pop-up-entry/pop-up-entry.component';
import { ToastService } from '../../../services/toast.service';
import { CookieConsentService } from '../../../services/cookie-consent.service';

@Component({
  selector: 'app-form-registration',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, InputTextModule, FloatLabelModule, PasswordModule, CustomButtonComponent, PopUpEntryComponent],
  templateUrl: './form-registration.component.html',
  styleUrls: ['./form-registration.component.scss']
})
export class FormRegistrationComponent {
  SignUpForm: FormGroup;

  constructor(private fb: FormBuilder, private registrationService: FormRegistrationService,
    private router: Router, private tokenService: TokenService,
    private currentUserService: CurrentUserService,
    private toastService: ToastService,
    private cookieConsentService: CookieConsentService) {
    this.SignUpForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      agreement: [false, Validators.requiredTrue]
    });
  }
  onSignUp() {

    this.SignUpForm.markAllAsTouched();

    if (this.SignUpForm.valid) {
      if(!this.cookieConsentService.hasConsented()){
        this.cookieConsentService.revokeConsent();
        this.toastService.showWarn('Предупреждение', 'Вы должны согласиться на использование cookie');
        return;
      }

      const formData = this.SignUpForm.value;

      const Data = {
        FirstName: formData.username,
        Email: formData.email,
        Password: formData.password,
      };

      this.registrationService.signUn(Data).subscribe(
        (response) => {
          this.currentUserService.saveUser(response.data);
          this.tokenService.setToken(response.data.token);
          this.router.navigate([`/${response.data.id}`]);
        },
        (error) => {
          this.toastService.showError('Ошибка', 'Ошибка при регистрации')
        }
      );
    } else {
      this.toastService.showWarn('Предупреждение', 'Форма невалидна')
    }
  }

}
