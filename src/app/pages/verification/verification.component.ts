import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VerificationService } from './verification.service';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';
import { ProgressSpinnerService } from '../../components/progress-spinner/progress-spinner.service';

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
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private verificationService: VerificationService, // сервис для связи с сервером
    private router: Router,
    private toastService:ToastService,
    private progressSpinnerService:ProgressSpinnerService
  ) { }

  ngOnInit(): void {
    this.progressSpinnerService.show();
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
        this.progressSpinnerService.hide();
        this.cdr.detectChanges();
      },
      (error) => {
        this.progressSpinnerService.hide();
        if (error.error.status === 422) {
          this.toastService.showError('Ошибка', error.error.Message);
          this.verificationMessage = 'Вы уже подтвердили свою почту.';
          this.verificationStatus = false;
          
        } else {
          this.toastService.showError('Ошибка', error.error.Message);
          this.verificationMessage = 'Произошла ошибка. Попробуйте повторить позже.';
          this.verificationStatus = false;
        }
        this.cdr.detectChanges();
      }
    );
  }
}