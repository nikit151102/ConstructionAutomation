import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Transaction } from '../../../../interfaces/docs';
import { Response } from '../../../../interfaces/common';
import { environment } from '../../../../../environment';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor(private http: HttpClient) {}

  getTransactions(): Observable<Response<Transaction[]>> {
    return this.http.get<Response<Transaction[]>>(`${environment.apiUrl}/api/Profile/GetTransactions`);
  }
  
}
