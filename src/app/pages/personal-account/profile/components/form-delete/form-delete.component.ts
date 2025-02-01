import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CurrentUserService } from '../../../../../services/current-user.service';
import { ToastService } from '../../../../../services/toast.service';

@Component({
  selector: 'app-form-delete',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-delete.component.html',
  styleUrl: './form-delete.component.scss'
})
export class FormDeleteComponent {
  deleteForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private currentUserService: CurrentUserService,
    private toastService:ToastService
  ) {
    this.deleteForm = this.fb.group({
      confirm: [false, Validators.requiredTrue]
    });
  }

  onSubmit(): void {
    if (!this.deleteForm.valid) {
      return;
    }
  
    const token = localStorage.getItem('YXV0aFRva2Vu');
    if (!token) {
      this.toastService.showError('Ошибка', 'Не найден токен авторизации. Пожалуйста, войдите в систему снова.');
      return;
    }
  
    this.currentUserService.deleteUser().subscribe(
      () => {
        localStorage.removeItem('YXV0aFRva2Vu');
        localStorage.removeItem('VXNlcklk');
        this.toastService.showSuccess('Успех', 'Аккаунт успешно удалён');
        this.router.navigate(['/login']);
      },
      (error) => {
        const errorMessage = error?.error?.Message || 'Произошла неизвестная ошибка';
        this.toastService.showError('Ошибка', errorMessage);
      }
    );
  }

}
