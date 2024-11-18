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

@Component({
  selector: 'app-form-authorization',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, InputTextModule, FloatLabelModule, PasswordModule, CustomButtonComponent, PopUpEntryComponent],
  templateUrl: './form-authorization.component.html',
  styleUrls: ['./form-authorization.component.scss']
})
export class FormAuthorizationComponent implements OnInit {
  signInForm: FormGroup;

  constructor(private fb: FormBuilder, private AuthorizationService: FormAuthorizationService, private router: Router, private tokenService: TokenService, private currentUserService: CurrentUserService) {
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
      const formData = this.signInForm.value;

      const Data  = {
        UserName: formData.username,
        UserId: '',
        Email: formData.username,
        Password: formData.password, 
      };
        console.log("Data",Data)
      this.AuthorizationService.signIn(Data).subscribe(
        (response) => {
          if(response.data){
            this.tokenService.setToken(response.data.token);
            this.router.navigate([`/${response.data.id}`]);
            localStorage.setItem('VXNlcklk', response.data.id);
            
          }
          
        },
        (error) => {
          console.error('Ошибка при входе:', error);
        }
      );
    } else {
      console.log('Форма недействительна');
      this.handleFormErrors(); 
    }
  }

  private handleFormErrors() {
    Object.keys(this.signInForm.controls).forEach(controlName => {
      const control = this.signInForm.get(controlName);
      if (control && control.invalid) {
        const errors = control.errors;
        if (errors?.['required']) {
          console.log(`${controlName} обязателен для заполнения`);
        }
        if (errors?.['minlength']) {
          console.log(`${controlName} должен содержать минимум ${errors['minlength'].requiredLength} символов`);
        }
      }
    });
  }
  


}
