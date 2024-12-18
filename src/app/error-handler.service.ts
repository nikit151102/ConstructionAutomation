import { Injectable, ErrorHandler } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface ErrorResponse {
    errorMessage: string;
    details: string;
    url: string;
    username: string;
    timestamp: string;
}

@Injectable({
    providedIn: 'root',
})
export class GlobalErrorHandlerService implements ErrorHandler {
    private apiUrl = 'https://vm-c86b4df8.na4u.ru/logs/log-error/angular';

    constructor(private http: HttpClient) { }

    handleError(error: any): void {

      
    }

    sendErrorToServer(error: ErrorResponse) {
        return this.http.post(this.apiUrl, error);
    }
}
