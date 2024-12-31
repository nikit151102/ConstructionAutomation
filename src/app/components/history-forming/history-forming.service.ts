import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environment';
import { DocumentQueueItem, DocumentQueueResponse, TransactionResponse } from '../../interfaces/docs';
import { Response } from '../../interfaces/common';

@Injectable({
  providedIn: 'root'
})
export class HistoryFormingService {

  constructor(private http: HttpClient) { }

  selectpdf: any;
  selectExcel: any;
  visiblePdf: boolean = false;

  private selectExcelIdSubject = new BehaviorSubject<string>('');
  selectExcelIdState$ = this.selectExcelIdSubject.asObservable();

  private selectpdfIdSubject = new BehaviorSubject<string>('');
  selectpdfIdState$ = this.selectpdfIdSubject.asObservable();

  private historyDocsSubject = new BehaviorSubject<DocumentQueueItem[]>([]);
  historyDocsState$ = this.historyDocsSubject.asObservable();

  updateSelectExcelId(id: string): void {
    this.selectExcelIdSubject.next(id);
  }

  updateSelectPdfId(id: string): void {
    this.selectpdfIdSubject.next(id);
  }

  setHistoryDocsValue(doc: DocumentQueueItem): void {
    const currentDocs = this.historyDocsSubject.value || [];
    this.historyDocsSubject.next([...currentDocs, doc]);
  }

  getHistoryDocsValue(): any {
    return this.historyDocsSubject.getValue();
  }

  loadHistoryDocs(docs: DocumentQueueItem[]): void {
    if (Array.isArray(docs)) {
      this.historyDocsSubject.next(docs);
    }
  }


  // Эндпоинт для получения всех объектов очереди
  getHistoryForming(): Observable<any> {
    const token = localStorage.getItem('YXV0aFRva2Vu');
    return this.http.get<Response<DocumentQueueResponse>>(`${environment.apiUrl}/api/Profile/HistoryDocumentGenerate`, {

      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      })
    });
  }


  // Эндпоинт для оплаты 
  makeTransaction(id: string): Observable<any> {
    const token = localStorage.getItem('YXV0aFRva2Vu');
    return this.http.put<Response<TransactionResponse>>(`${environment.apiUrl}/api/Profile/ConfirmDocumentGenerate`, {
      "documentInstanceId": id
    }, {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      })
    });
  }

}
