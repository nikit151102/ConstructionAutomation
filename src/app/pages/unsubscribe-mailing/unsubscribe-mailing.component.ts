import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProgressSpinnerService } from '../../components/progress-spinner/progress-spinner.service';
import { ToastService } from '../../services/toast.service';
import { UnsubscribeMailingService } from './unsubscribe-mailing.service';

@Component({
  selector: 'app-unsubscribe-mailing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './unsubscribe-mailing.component.html',
  styleUrl: './unsubscribe-mailing.component.scss'
})
export class UnsubscribeMailingComponent implements OnInit {
  id: string | null = null;
  verificationMessage: string = '';
  verificationStatus: boolean | null = null; // true - почта подтверждена, false - уже подтверждена

  constructor(
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private unsubscribeMailingService: UnsubscribeMailingService, // сервис для связи с сервером
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

  checkEmailVerification(): void {
    this.unsubscribeMailingService.verifyEmail(this.id!).subscribe(
      (response) => {
        this.verificationMessage = 'Вы успешно отписались от нашей email-рассылки';
        this.verificationStatus = true;
        this.progressSpinnerService.hide();
        this.cdr.detectChanges();
      },
      (error) => {
        this.progressSpinnerService.hide();
        if (error.error.status === 422) {
          this.toastService.showError('Ошибка', error.error.Message);
          this.verificationMessage = 'Вы уже отписались от нашей email-рассылки.';
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