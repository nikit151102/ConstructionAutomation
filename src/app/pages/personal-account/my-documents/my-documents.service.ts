import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../../environment';
import { ProgressSpinnerService } from '../../../components/progress-spinner/progress-spinner.service';
import { ToastService } from '../../../services/toast.service';


@Injectable({
  providedIn: 'root'
})
export class MyDocumentsService {

  private apiUrl = environment.apiUrl;


  private isVertical = new BehaviorSubject<boolean>(false);
  isVertical$ = this.isVertical.asObservable();


  setTypeView(isVertical: boolean) {
    this.isVertical.next(isVertical);
  }

  private files = new BehaviorSubject<boolean>(false);
  filesSelect$ = this.files.asObservable();

  setFiles(files: any) {
    this.files.next(files);
  }

  constructor(private http: HttpClient, private progressSpinnerService: ProgressSpinnerService, private toastService:ToastService) { }

  getUserFile(fileId: string): Observable<any> {

    const token = localStorage.getItem('YXV0aFRva2Vu');

    const url = `${this.apiUrl}/api/UserDocument/GetUserFile/${fileId}`;
    return this.http.get<any>(url, {

      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    });
  }

  upload(files: File[]): Observable<any> {
    console.log("servces files", files);
    const url = `${this.apiUrl}/api/UserDocument/upload`;
    const formData = new FormData();

    const userId = localStorage.getItem('VXNlcklk');
    if (userId) {
      formData.append('UserId', userId);
    }

    files.forEach(file => {
      formData.append('Files', file);
    });

    const token = localStorage.getItem('YXV0aFRva2Vu');

    return this.http.post<any>(url, formData, {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      }),
    });
  }

  downloadFile(id: string): Observable<Blob> {
    const url = `${this.apiUrl}/api/UserDocument/DownloadFile`;
    const token = localStorage.getItem('YXV0aFRva2Vu');

    return this.http.get<Blob>(url, {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }),
      params: { id },
      responseType: 'blob' as 'json',
    });
  }

  getAllUserDocuments(): Observable<any[]> {
    const userId = localStorage.getItem('VXNlcklk');
    const url = `${this.apiUrl}/api/UserDocument/GetUserFile/${userId}`;
    const token = localStorage.getItem('YXV0aFRva2Vu');

    return this.http.get<any[]>(url, {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }),
    });
  }

  deleteFile(id: string): Observable<any> {
    const url = `${this.apiUrl}/api/UserDocument/${id}`;
    const token = localStorage.getItem('YXV0aFRva2Vu');

    return this.http.delete<any>(url, {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    });
  }

  renameFile(id: string, data: any): Observable<any> {
    const url = `${this.apiUrl}/api/UserDocument/${id}`;
    const token = localStorage.getItem('YXV0aFRva2Vu');

    return this.http.put<any>(url, data, {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    });
  }


  loadData() {

    this.progressSpinnerService.show();

    this.getAllUserDocuments().subscribe((data: any) => {

      const files = data.data.map((file: any) => ({
        ...file,
        icon: 'pngs/file.png'
      }));
      this.setFiles(files);
      this.progressSpinnerService.hide();
    },
    (error) => {
      console.error('Ошибка загрузки данных:', error);
      this.toastService.showError('Ошибка', 'Не удалось загрузить данные');
    },
    
  );

   
  }
}
