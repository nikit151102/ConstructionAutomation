import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../../environment';

@Injectable({
  providedIn: 'root'
})
export class DocumentsService {


  selectConf: any;
  visiblePdf:boolean = false;
  selectPdf:any;
  
  public showPopupErrorForming: boolean = false;
  public descriptionPopupErrorForming: string = '';

  buttons(cdr: ChangeDetectorRef) {
    return [
      { label: 'Продолжить', onClick: () => {
          this.showPopupErrorForming = false;
          cdr.detectChanges(); 
        } 
      },
      
  ];
}

  private isselectConfSubject = new BehaviorSubject<any>('');

  isSelectConfState$ = this.isselectConfSubject.asObservable();

  constructor(private http: HttpClient) { }

  setSelectConfValue(newValue: any): void {
    this.isselectConfSubject.next(newValue);
  }

  getSelectConfValue(): boolean {
    return this.isselectConfSubject.getValue();
  }


  uploadFiles(files: FormData, endpoint: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/api/UserDocument/${endpoint}`, files, {

      headers: new HttpHeaders({
        'Accept': 'application/json'
      })
    });
  }


  private isSuccessDoc = new BehaviorSubject<any>('');
  isSuccessDoc$ = this.isSuccessDoc.asObservable();

  setSuccessDoc(doc: any) {
    this.isSuccessDoc.next(doc);
  }


}
