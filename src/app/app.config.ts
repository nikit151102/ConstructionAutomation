import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection, ErrorHandler } from '@angular/core';
import { routes } from './app.routes';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { GlobalErrorHandlerService } from './error-handler.service'; 
import { provideRouter } from '@angular/router';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom([BrowserAnimationsModule, HttpClientModule]),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandlerService,
    },
  ],
};
