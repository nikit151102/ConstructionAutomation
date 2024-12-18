import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class YandexMapService {
  private ymaps: any;

  loadYandexMaps(): Promise<void> {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if ('ymaps' in window) {
          this.ymaps = (window as any).ymaps;
          clearInterval(interval);
          resolve();
        }
      }, 100);
    });
  }

  getYmaps() {
    return this.ymaps;
  }
}
