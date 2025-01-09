import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
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
import { PopUpConfirmEmailService } from '../pop-up-confirm-email/pop-up-confirm-email.service';

@Component({
  selector: 'app-form-registration',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, InputTextModule, FloatLabelModule, PasswordModule, CustomButtonComponent, PopUpEntryComponent],
  templateUrl: './form-registration.component.html',
  styleUrls: ['./form-registration.component.scss']
})
export class FormRegistrationComponent {
  SignUpForm: FormGroup;
  passwordConditions = {
    minLength: false,
    hasUpperCase: false,
  };
  isPasswordFocused: boolean = false;
  isEmailFocused: boolean = false;

  constructor(private fb: FormBuilder, private registrationService: FormRegistrationService,
    private router: Router, private tokenService: TokenService,
    private currentUserService: CurrentUserService,
    private toastService: ToastService,
    private cookieConsentService: CookieConsentService,
    private popUpConfirmEmailService: PopUpConfirmEmailService) {
    this.SignUpForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, this.englishLettersOnlyValidator()]],
      password: ['', [Validators.required, Validators.minLength(6), this.englishLettersOnlyValidator()]],
      agreement: [false, Validators.requiredTrue]
    });
  }

  private englishLettersOnlyValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (value && !/^[A-Za-z0-9!@#$%^&*(),.?":{}|<>]*$/.test(value)) {
        return { englishLettersOnly: true };
      }
      return null;
    };
  }

  checkPasswordConditions(password: string): void {
    this.passwordConditions.minLength = password.length >= 6;
    this.passwordConditions.hasUpperCase = /[A-Z]/.test(password);
  }

  handlePasswordInput(event: Event): void {
    const password = (event.target as HTMLInputElement).value;
    this.checkPasswordConditions(password);
    //  const input = event.target as HTMLInputElement;
    // // Заменяем все символы, кроме латинских букв
    // input.value = input.value.replace(/[^A-Za-z]/g, ''); // Убираем все символы, кроме английских букв
    // this.SignUpForm.get('password')?.setValue(input.value); // Применяем новое значение в форме
  }

  handlePasswordFocus(): void {
    this.isPasswordFocused = true;
    console.log('this.isPasswordFocused', this.isPasswordFocused)
  }

  handlePasswordBlur(): void {
    this.isPasswordFocused = false;
  }


  handleEmailInput(event: Event): void {
    const email = (event.target as HTMLInputElement).value;
    this.SignUpForm.get('email')?.markAsDirty();
    this.SignUpForm.get('email')?.updateValueAndValidity();
  }


  onSignUp() {

    this.SignUpForm.markAllAsTouched();

    if (this.SignUpForm.valid) {
      if (!this.cookieConsentService.hasConsented()) {
        this.cookieConsentService.revokeConsent();
        this.toastService.showWarn('Предупреждение', 'Вы должны согласиться на использование cookie');
        return;
      }

      const formData = this.SignUpForm.value;

      const Data = {
        FirstName: formData.username,
        Email: formData.email,
        Password: formData.password,
        isMailSend: true
      };

      this.registrationService.signUn(Data).subscribe(
        (response) => {
          this.currentUserService.saveUser(response.data);
          this.tokenService.setToken(response.data.token);
          // this.router.navigate([`/${response.data.id}`]);
          this.popUpConfirmEmailService.showPopup();
        },
        (error) => {
          this.toastService.showError('Ошибка', 'Ошибка при регистрации')
        }
      );
    } else {
      this.toastService.showWarn('Предупреждение', 'Форма невалидна')
    }
  }

  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.onSignUp();
    }
  }

  goBack(): void {
    this.router.navigateByUrl('/');
  }


}
