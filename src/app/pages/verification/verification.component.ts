import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VerificationService } from './verification.service';
import { CommonModule } from '@angular/common';

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
    private router: Router
  ) {}

  ngOnInit(): void {
    // Получаем параметр id из URL
    this.id = this.route.snapshot.paramMap.get('optionalParam');

    if (this.id) {
      this.checkEmailVerification();
    }
  }

  checkEmailVerification(): void {
    this.verificationService.verifyEmail(this.id!).subscribe(
      (response) => {
        if (response.success) {
          this.verificationMessage = 'Почта успешно подтверждена!';
          this.verificationStatus = true;
        } else {
          this.verificationMessage = 'Вы уже подтвердили свою почту.';
          this.verificationStatus = false;
        }
      },
      (error) => {
        this.verificationMessage = 'Произошла ошибка. Попробуйте снова позже.';
      }
    );
  }
}