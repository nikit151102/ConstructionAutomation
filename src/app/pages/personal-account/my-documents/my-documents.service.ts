import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../../environment';
import { ProgressSpinnerService } from '../../../components/progress-spinner/progress-spinner.service';
import { ToastService } from '../../../services/toast.service';


interface MenuItem {
  label?: string;
  command?: () => void;
  idFolder?: string;
  [key: string]: any;
}


@Injectable({
  providedIn: 'root'
})
export class MyDocumentsService {

  private apiUrl = environment.apiUrl;

  BreadcrumbItems: MenuItem[] = [];

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


  upload(data: { DirectoryId: string; files: File[] }): Observable<any> {
    const url = `${this.apiUrl}/api/Profile/Upload`;
    const formData = new FormData();

    // const userId = localStorage.getItem('VXNlcklk');
    // if (userId) {
    //   formData.append('UserId', userId);
    // }

    formData.append('DirectoryId', data.DirectoryId);
    data.files.forEach(file => {
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

  getAllUserDirectories(): Observable<any[]> {
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


  openFolder(idFolder: string) {
    const url = `${this.apiUrl}/api/Profile/UserDirectories/${idFolder}`;
    const token = localStorage.getItem('YXV0aFRva2Vu');

    return this.http.get<any[]>(url, {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }),
    });
  }

  addFileMove(data: {
    documentId: string,
    directoryId: string
  }) {
    const url = `${this.apiUrl}/api/Profile/UserDirectories/Add`;
    const token = localStorage.getItem('YXV0aFRva2Vu');

    return this.http.post<any[]>(url, data, {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }),
    });
  }
  
  removeFileMove(data: {
    documentId: string,
    directoryId: string
  }) {
    const url = `${this.apiUrl}/api/Profile/UserDirectories/Remove`;
    const token = localStorage.getItem('YXV0aFRva2Vu');

    return this.http.post<any[]>(url, data, {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }),
    });
  }

  addOrderMove(data: {
    documentId: string,
    directoryId: string
  }) {
    const url = `${this.apiUrl}/api/Profile/UserDirectories/AddDirectory`;
    const token = localStorage.getItem('YXV0aFRva2Vu');

    return this.http.post<any[]>(url, data, {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }),
    });
  }
  
  removeOrderMove(data: {
    documentId: string,
    directoryId: string
  }) {
    const url = `${this.apiUrl}/api/Profile/UserDirectories/RemoveDirectory`;
    const token = localStorage.getItem('YXV0aFRva2Vu');

    return this.http.post<any[]>(url, data, {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }),
    });
  }


  loadData(idFolder: string) {

    if (this.BreadcrumbItems.length < 1 && idFolder == '') {

      this.getAllUserDirectories().subscribe((data: any) => {

        // this.storageInfo = data.storageInfo;
        this.storageInfo = { 'storageVolumeCopacity': 200000000, 'storageVolumeUsage': 5000000 };
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

    } else {

      this.openFolder(idFolder).subscribe((data: any) => {
        const combinedArray = [
          ...(data.data.subDirectories || []),
          ...(data.data.documents || [])
        ];
        const files = combinedArray
          .map((file: any) => ({
            ...file,
            icon: file.type === 'file' ? 'pngs/file.png' : file.type === "directory" ? 'pngs/folder.png' : ''
          }));
        this.setFiles(files)
        const menuItem: MenuItem = {
          label: data.data.name,
          idFolder: data.data.id,
          command: () => {
            const index = this.BreadcrumbItems.findIndex(
              (item) => item.idFolder === data.data.id
            );

            if (index !== -1) {

              this.BreadcrumbItems = this.BreadcrumbItems.slice(0, index + 1);
            }

            this.loadData(data.data.id);
          }
        };

        const exists = this.BreadcrumbItems.some(
          (item) => item['idFolder'] === menuItem.idFolder
        );

        if (!exists) {
          this.BreadcrumbItems = [...this.BreadcrumbItems, menuItem];
        }
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
}
