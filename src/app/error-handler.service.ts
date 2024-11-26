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

        const errorResponse: ErrorResponse = {
            errorMessage: error.message || 'Unknown Error',
            details: error.stack || 'No details',
            url: window.location.href,
            username: '',
            timestamp: new Date().toISOString(),
        };

        this.sendErrorToServer(errorResponse).subscribe({
            next: (response) => {
                console.log('Error logged to server:', response);
            },
            error: (err) => {
                console.error('Error while logging to server:', err);
            },
        });
    }

    sendErrorToServer(error: ErrorResponse) {
        return this.http.post(this.apiUrl, error);
    }
}
