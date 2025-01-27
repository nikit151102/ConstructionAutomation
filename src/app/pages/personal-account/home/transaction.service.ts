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
  
  addTransactionToBeginning(transaction: Transaction): void {
    const currentTransactions = this.transactionsSubject.value;
    this.transactionsSubject.next([transaction, ...currentTransactions]);
  }

  updateTransactionById(id: string, updatedTransaction: Transaction): void {
    const currentTransactions = this.transactionsSubject.value;
    const transactionIndex = currentTransactions.findIndex((t:any) => t.id === id);
    console.log('updateTransactionById')
    if (transactionIndex !== -1) {
      const updatedTransactions = [...currentTransactions];
      updatedTransactions[transactionIndex] = updatedTransaction;
      this.transactionsSubject.next(updatedTransactions);
      console.log('save transactionIndex')
    }
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
