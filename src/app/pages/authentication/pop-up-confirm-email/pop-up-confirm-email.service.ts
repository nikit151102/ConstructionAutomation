import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PopUpConfirmEmailService {

  private isVisibleSubject = new BehaviorSubject<boolean>(false); // Начальное состояние - скрыто
  isVisible$ = this.isVisibleSubject.asObservable(); // Observable для подписки

  // Метод для отображения поп-апа
  showPopup() {
    this.isVisibleSubject.next(true);
  }

  // Метод для скрытия поп-апа
  hidePopup() {
    this.isVisibleSubject.next(false);
  }
}
