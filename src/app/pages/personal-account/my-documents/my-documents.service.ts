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

  visibleCreateFolder: boolean = false;
  
  private isVertical = new BehaviorSubject<boolean>(false);
  isVertical$ = this.isVertical.asObservable();


  setTypeView(isVertical: boolean) {
    this.isVertical.next(isVertical);
  }

  private files = new BehaviorSubject<boolean>(false);
  filesSelect$ = this.files.asObservable();

  storageInfo: {
    storageVolumeCopacity: number,
    storageVolumeUsage: number
  } = {
      storageVolumeCopacity: 0,
      storageVolumeUsage: 0
    }

  setFiles(files: any) {
    this.files.next(files);
  }

  constructor(private http: HttpClient, private progressSpinnerService: ProgressSpinnerService, private toastService: ToastService) { }


  upload(files: File[]): Observable<any> {
    console.log("servces files", files);
    const url = `${this.apiUrl}/api/Profile/Upload`;
    const formData = new FormData();

    // const userId = localStorage.getItem('VXNlcklk');
    // if (userId) {
    //   formData.append('UserId', userId);
    // }

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

  downloadFile(id: string): Observable<any> {
    const url = `${this.apiUrl}/api/Profile/DownloadFile/${id}`;
    const token = localStorage.getItem('YXV0aFRva2Vu');

    return this.http.get<Blob>(url, {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }),
      responseType: 'json',
    });
  }

  getAllUserDirectories(idUser: string): Observable<any[]> {
    const userId = localStorage.getItem('VXNlcklk');
    const url = `${this.apiUrl}/Directories?UserId=${idUser}`;
    const token = localStorage.getItem('YXV0aFRva2Vu');

    return this.http.get<any[]>(url, {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }),
    });
  }

  getAllFileOfDirectory(): Observable<any[]> {
    const userId = localStorage.getItem('VXNlcklk');
    const url = `${this.apiUrl}/api/Profile/UserDirectories`;
    const token = localStorage.getItem('YXV0aFRva2Vu');

    return this.http.get<any[]>(url, {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }),
    });
  }

  deleteFile(id: string): Observable<any> {
    const url = `${this.apiUrl}/api/Profile/${id}`;
    const token = localStorage.getItem('YXV0aFRva2Vu');

    return this.http.delete<any>(url, {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    });
  }

  renameFile(id: string, data: any): Observable<any> {
    const url = `${this.apiUrl}/api/Profile/UpdateUserFile`;
    const token = localStorage.getItem('YXV0aFRva2Vu');

    return this.http.put<any>(url, data, {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    });
  }


  loadData(idUser: string) {

    this.getAllUserDirectories(idUser).subscribe((data: any) => {

      // this.storageInfo = data.storageInfo;
      this.storageInfo = { 'storageVolumeCopacity': 2000000, 'storageVolumeUsage': 5000000 };
      const files = data.data
      .filter((file: any) => file.type) 
      .map((file: any) => ({
        ...file,
        icon: file.type === 'file' ? 'pngs/file.png' : file.type === "directory" ? 'pngs/folder.png' : ''
      }));
    
      this.setFiles(files);
      this.progressSpinnerService.hide();
    },
      (error) => {
        console.error('Ошибка загрузки данных:', error);
        this.progressSpinnerService.hide();
        this.toastService.showError('Ошибка', 'Не удалось загрузить данные');

      },

    );


  }
}
