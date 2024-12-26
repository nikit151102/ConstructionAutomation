import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environment';
import { dataDocs } from '../../interfaces/files';

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


  updateSelectExcelId(id: string): void {
    this.selectExcelIdSubject.next(id);
  }

  updateSelectPdfId(id: string): void {
    this.selectpdfIdSubject.next(id);
  }

  private historyDocsSubject = new BehaviorSubject<dataDocs[]>([]);
  historyDocsState$ = this.historyDocsSubject.asObservable();

  setHistoryDocsValue(doc: dataDocs): void {
    const currentDocs = this.historyDocsSubject.value || [];
    this.historyDocsSubject.next([...currentDocs, doc]);
  }

  getHistoryDocsValue(): any {
    return this.historyDocsSubject.getValue();
  }

  loadHistoryDocs(docs: dataDocs[]): void {
    if (Array.isArray(docs)) {
      this.historyDocsSubject.next(docs);
    }
  }




// Эндпоинт для получения всех объектов очереди

// response
  //   {
  //   status
  //   message
  //   data[ массив с объектами очереди
  //  {
  // id: string,
  // statusCode: number,
  // FileName: string,
  // FileSize: number,
  // documentType: number, 
  // InitDate: Date,
  // DocumentPdfId: string,
  // DocumentXlsxId: string
  // }
  // ] 
  // }

  getHistoryForming(): Observable<any> {
    const token = localStorage.getItem('YXV0aFRva2Vu');
    return this.http.get(`${environment.apiUrl}/`, {

      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      })
    });
  }



// Эндпоинт для оплаты 

// response
  // {
  // status
  // message
  // file файл пдф для предпросмотр без вложенных объектов файлов
  // balance number 
  // resultXlsxId string
  // resultPdfId string
  // }

  makeTransaction(id: string): Observable<any> {
    const token = localStorage.getItem('YXV0aFRva2Vu');
    return this.http.post(`${environment.apiUrl}/api/User/MakeTransaction/${id}`, {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      })
    });
  }


}
