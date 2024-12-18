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
    private toastService:ToastService) {
    this.SignUpForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]], 
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
  onSignUp() {

    this.SignUpForm.markAllAsTouched();
  
    if (this.SignUpForm.valid) {
      const formData = this.SignUpForm.value;

     const Data  = {
        FirstName:  formData.username,
        Email: formData.email,
        Password: formData.password, 
      };

    //   const Data  = {
    //  FirstName: '',
    //     LastName: '',
    //     Hash: 'f45vfd7r98tfr8f4749v98g45',
    //     UserName:  'Nikit',
    //     Email: '',
    //     Password: '', 
    //     Roles: []
    //   };

      console.log('Форма отправлена:', Data);

      this.registrationService.signUn(Data).subscribe(
        (response) => {
          console.log('Успешная регистрация:', response);
          this.currentUserService.saveUser(response.data);
          this.tokenService.setToken(response.data.token);
          console.log('response.token:', response.data.token);
          this.router.navigate([`/${response.data.id}`]);
          console.log('response.id:', response.data.id);
        },
        (error) => {
          console.error('Ошибка при регистрации:', error);
          this.toastService.showError('Ошибка', 'Ошибка при регистрации')
        }
      );
    } else {
      console.log('Форма недействительна');
      this.toastService.showWarn('Предупреждение', 'Форма невалидна')
      this.handleFormErrors();
    }
  }
  
  private handleFormErrors() {
    Object.keys(this.SignUpForm.controls).forEach(controlName => {
      const control = this.SignUpForm.get(controlName);
      if (control && control.invalid) {
        const errors = control.errors;
        if (errors?.['required']) {
          console.log(`${controlName} обязателен`);
        }
        if (errors?.['minlength']) {
          console.log(`${controlName} должен содержать минимум ${errors['minlength'].requiredLength} символов`);
        }
        if (errors?.['email']) {
          console.log(`${controlName} должен быть корректным email-адресом`);
        }
      }
    });
  }
  
}
