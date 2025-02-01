import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VerificationService } from './verification.service';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-verification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './verification.component.html',
  styleUrl: './verification.component.scss'
})
export class VerificationComponent implements OnInit {
  id: string | null = null;
  verificationMessage: string = '';
  verificationStatus: boolean | null = null; // true - почта подтверждена, false - уже подтверждена

  constructor(
    private route: ActivatedRoute,
    private verificationService: VerificationService, // сервис для связи с сервером
    private router: Router,
    private toastService:ToastService
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('optionalParam');

    if (this.id) {
      this.checkEmailVerification();
    }
  }

  goToLogin(): void {
    this.router.navigate(['/login'], { state: { isSessionExpired: false } });
  }

  checkEmailVerification(): void {
    this.verificationService.verifyEmail(this.id!).subscribe(
      (response) => {
        this.verificationMessage = 'Почта успешно подтверждена!';
        this.verificationStatus = true;
      },
      (error) => {
        if (error.error.status === 422) {
          this.toastService.showError('Ошибка', error.error.Message);
          this.verificationMessage = 'Вы уже подтвердили свою почту.';
          this.verificationStatus = false;
        } else {
          this.toastService.showError('Ошибка', error.error.Message);
          this.verificationMessage = 'Произошла ошибка. Попробуйте снова позже.';
        }
      }
    );
  }
}