import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
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

  setNewHistoryDocsValue(newDoc: DocumentQueueItem): void {

    const normalizedDoc = this.normalizeKeys(newDoc);

    const currentDocs = this.historyDocsSubject.getValue() || [];

    const existingIndex = currentDocs.findIndex(doc => doc.id === normalizedDoc.id);

    let updatedDocs;
    if (existingIndex !== -1) {
      updatedDocs = currentDocs.map(doc => doc.id === normalizedDoc.id ? normalizedDoc : doc);
    } else {
      updatedDocs = [normalizedDoc, ...currentDocs];
    }

    this.historyDocsSubject.next(updatedDocs);
  }

  // Метод для преобразования ключей объекта
  private normalizeKeys(obj: any): any {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.normalizeKeys(item));
    }

    return Object.keys(obj).reduce((acc, key) => {
      const newKey = key.charAt(0).toLowerCase() + key.slice(1);
      acc[newKey] = this.normalizeKeys(obj[key]);
      return acc;
    }, {} as any);
  }



  getHistoryDocsValue(): any {
    return this.historyDocsSubject.getValue();
  }

  loadHistoryDocs(docs: DocumentQueueItem[]): void {
    if (Array.isArray(docs)) {
      const currentDocs = this.historyDocsSubject.value || [];
      this.historyDocsSubject.next([...currentDocs, ...docs]);
    }
  }

  clearHistoryDocs(): void {
    this.historyDocsSubject.next([]);
  }

  // Эндпоинт для получения всех объектов очереди
  getHistoryForming(page: number = 1, pageSize: number = 10) {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    const token = localStorage.getItem('YXV0aFRva2Vu');
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    });

    return this.http.get<Response<DocumentQueueResponse>>(
      `${environment.apiUrl}/api/Profile/HistoryDocumentGenerate`,
      { params, headers }
    );
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


  makeCancelDelete(id: string, endpoint:string): Observable<any> {
    const token = localStorage.getItem('YXV0aFRva2Vu');
    return this.http.put(`${environment.apiUrl}/api/Profile/${endpoint}`, {
      "documentInstanceId": id
    }, {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      })
    });
  }


  private socket!: WebSocket;
  private messagesSubject = new Subject<any>();
  messages$ = this.messagesSubject.asObservable();

  connectToWebSocket(): void {
    const token = localStorage.getItem('YXV0aFRva2Vu');
    const url = `${environment.apiUrl}/api/Profile/HistoryUpdates?token=${token}&queueTag=GenerateQueue`;
    this.socket = new WebSocket(url);

    this.socket.onopen = () => {
    };

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.messagesSubject.next(data);
      } catch (e) {
        console.error('Error parsing WebSocket message:', e);
      }
    };


    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.socket.onclose = () => {
    };
  }

  disconnectWebSocket(): void {
    if (this.socket) {
      this.socket.close();
    }
  }




}
