import { Component, OnInit } from '@angular/core';
import { PopUpConfirmEmailService } from './pop-up-confirm-email.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pop-up-confirm-email',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pop-up-confirm-email.component.html',
  styleUrl: './pop-up-confirm-email.component.scss'
})
export class PopUpConfirmEmailComponent implements OnInit {
  isVisible: boolean = false;

  constructor(private popupService: PopUpConfirmEmailService) {}

  ngOnInit() {
    // Подписываемся на изменения состояния поп-апа
    this.popupService.isVisible$.subscribe((visible) => {
      this.isVisible = visible;
    });
  }

  closePopup() {
    this.popupService.hidePopup(); // Скрываем поп-ап
  }

  resendEmail() {
    // Логика для повторной отправки email
  }

  continue() {
    this.popupService.hidePopup()  // Скрываем поп-ап
  }
}