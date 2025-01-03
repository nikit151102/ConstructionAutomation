import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Transaction } from './../../../interfaces/docs';
import { Response } from './../../../interfaces/common';
import { environment } from './../../../../environment';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  private transactionsSubject = new BehaviorSubject<Transaction[]>([]);
  public transactions$ = this.transactionsSubject.asObservable();

  constructor(private http: HttpClient) { }

  getTransactionsSubject() {
    return this.transactionsSubject.getValue();
  }
  
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('YXV0aFRva2Vu');
    if (!token) {
      throw new Error('Token not found');
    }
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getTransactions(): Observable<Response<Transaction[]>> {

    return this.http.get<Response<Transaction[]>>(`${environment.apiUrl}/api/Profile/GetTransactions`, {
      headers: this.getAuthHeaders(),
    })
      .pipe(
        tap((transactions) => {
          console.log('transactions',transactions)
          this.transactionsSubject.next(transactions.data);
        })
      );
  }

  get currentTransactions(): Transaction[] {
    return this.transactionsSubject.getValue();
  }

}
