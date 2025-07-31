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
import { ProgressSpinnerService } from '../../../components/progress-spinner/progress-spinner.service';

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
    private popUpConfirmEmailService: PopUpConfirmEmailService,
    private progressSpinnerService: ProgressSpinnerService) {
    this.SignUpForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, this.emailAndEnglishLettersValidator()]],
      password: ['', [Validators.required, Validators.minLength(6), this.passwordValidator()]],
      agreement: [false, Validators.requiredTrue]
    });
  }

ngOnInit(): void {

}

  private emailAndEnglishLettersValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      // Проверка на формат электронной почты
      const emailPattern = /^[A-Za-z0-9!"№;%:?*()_+,.<>[\]{}|^&$#@`~\\/=<>-]*$/;

      if (value && !emailPattern.test(value)) {
        return { email: true }; // Некорректный формат электронной почты
      }

      // Проверка на разрешённые символы
      const specialCharsPattern = /^[A-Za-zА-Яа-я0-9!"№;%:?*()_+,.<>[\]{}|^&$#@`~\\/=<>-]*$/;
      if (value && !specialCharsPattern.test(value)) {
        return { englishLettersOnly: true }; // Ошибка, если ввод содержит неподдерживаемые символы
      }

      return null; // Валидация прошла успешно
    };
  }

  passwordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null;
      }
      const passwordPattern = /^[A-Za-z0-9!"№;%:?*()_+,.<>[\]{}|^&$#@`~\\/=<>]*$/;
      return passwordPattern.test(value) ? null : { invalidPassword: true };
    };
  }

  handlePasswordInput(event: Event): void {
    this.passwordConditions.minLength = this.SignUpForm.get('password')?.value.length >= 6;
    this.passwordConditions.hasUpperCase = /[A-Z]/.test(this.SignUpForm.get('password')?.value);
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
        isMailSend: false
      };
      this.progressSpinnerService.show();
      this.registrationService.signUn(Data).subscribe(
        (response) => {
          this.progressSpinnerService.hide();
          this.currentUserService.saveUser(response.data);
          this.tokenService.setToken(response.data.token);
          this.router.navigate([`/${response.data.id}`]);
          //this.popUpConfirmEmailService.showPopup();
          const dataStage = {
            userName: `${response.data.lastName ?? ''} ${response.data.firstName ?? ''}`.trim(),
            email: response.data.email
          };

          localStorage.setItem('ZW5jcnlwdGVkRW1haWw=', this.utf8ToBase64(JSON.stringify(dataStage)));

        },
        (error) => {
          this.progressSpinnerService.hide();
          const errorMessage = error?.error?.Message || 'Произошла неизвестная ошибка';
          this.toastService.showError('Ошибка', errorMessage);
        }
      );
    } else {
      this.toastService.showWarn('Предупреждение', 'Форма невалидна')
    }
  }

  private utf8ToBase64(str: string): string {
    const utf8Bytes = new TextEncoder().encode(str);
    let binary = '';
    utf8Bytes.forEach(byte => {
      binary += String.fromCharCode(byte);
    });
    return btoa(binary);
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
