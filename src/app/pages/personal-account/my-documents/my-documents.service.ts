import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, Subject, throwError } from 'rxjs';
import { environment } from '../../../../environment';
import { ProgressSpinnerService } from '../../../components/progress-spinner/progress-spinner.service';
import { ToastService } from '../../../services/toast.service';


interface MenuItem {
  label?: string;
  command?: () => void;
  idFolder?: string;
  [key: string]: any;
}

interface Item {
  documentId: string,
  directoryId: string | null
}

@Injectable({
  providedIn: 'root'
})
export class MyDocumentsService {

  BreadcrumbItems: MenuItem[] = [];

  public getIdFolder(){
    return this.BreadcrumbItems.length > 0
    ? this.BreadcrumbItems[this.BreadcrumbItems.length - 1]['idFolder'] ?? ""
    : "";
  }

  private moveFileSubject = new Subject<any>();
  private moveDirectorySubject = new Subject<any>();

  moveFileObservable = this.moveFileSubject.asObservable();
  moveDirectoryObservable = this.moveDirectorySubject.asObservable();

  setMoveFile(file: any): void {
    this.moveFileSubject.next(file);
  }

  setMoveDirectory(directory: any): void {
    this.moveDirectorySubject.next(directory);
  }

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

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('YXV0aFRva2Vu');
    if (!token) {
      throw new Error('Token not found');
    }
    return new HttpHeaders()
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`);
  }



  upload(data: { DirectoryId: string; files: File[] }): Observable<any> {
    const formData = new FormData();

    formData.append('DirectoryId', data.DirectoryId);
    data.files.forEach(file => {
      formData.append('Files', file);
    });

    return this.http.post<any>(`${environment.apiUrl}/api/Profile/Upload`, formData, {
      headers: this.getAuthHeaders()
    });
  }

  downloadFile(id: string): Observable<any> {
    return this.http.get<Blob>(`${environment.apiUrl}/api/Profile/DownloadFile/${id}`, {
      headers: this.getAuthHeaders(),
      responseType: 'json',
    });
  }

  getAllUserDirectories(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/api/Profile/UserDirectories`, {
      headers: this.getAuthHeaders()
    });
  }

  getAllFileOfDirectory(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/api/Profile/UserDirectories`, {
      headers: this.getAuthHeaders()
    });
  }

  deleteFile(id: string): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/api/Profile/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  renameFile(id: string, data: any): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}/api/Profile/UpdateUserFile`, data, {
      headers: this.getAuthHeaders()
    });
  }


  openFolder(idFolder: string) {
    return this.http.get<any[]>(`${environment.apiUrl}/api/Profile/UserDirectories/${idFolder}`, {
      headers: this.getAuthHeaders()
    });
  }

  addFileMove(data: Item) {
    return this.http.post<any[]>(`${environment.apiUrl}/api/Profile/UserDirectories/Add`, data, {
      headers: this.getAuthHeaders()
    });
  }

  removeFileMove(data: Item) {
    return this.http.post<any[]>(`${environment.apiUrl}/api/Profile/UserDirectories/Remove`, data, {
      headers: this.getAuthHeaders()
    });
  }

  addOrderMove(data: Item) {
    return this.http.post<any[]>(`${environment.apiUrl}/api/Profile/UserDirectories/AddDirectory`, data, {
      headers: this.getAuthHeaders()
    });
  }

  removeOrderMove(data: Item) {
    return this.http.post<any[]>(`${environment.apiUrl}/api/Profile/UserDirectories/RemoveDirectory`, data, {
      headers: this.getAuthHeaders()
    });
  }


private filterData(data:any){
  return  [...data.documents, ...data.subDirectories]
          .filter((file: any) => file.type)
          .map((file: any) => ({
            ...file,
            icon: file.type === 'file' ? 'pngs/file.png' : file.type === 'directory' ? 'pngs/folder.png' : ''
          }));

}

  loadData(idFolder: string) {

    if (this.BreadcrumbItems.length < 1 && idFolder == '') {

      this.getAllUserDirectories().subscribe((data: any) => {
        this.storageInfo = { 'storageVolumeCopacity': 200000000, 'storageVolumeUsage': 5000000 };
        this.setFiles(this.filterData(data.data));
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

  elementMove: any;

  public handleFileMove(documentId: string, currentFolderId: string, targetFolderId: string): void {
    const addData = { documentId, directoryId: targetFolderId };

    this.addFileMove(addData).pipe(
      catchError(error => {
        console.error('Ошибка при добавлении файла:', error);
        return throwError(() => error);
      })
    ).subscribe((data: any) => {
      this.storageInfo = { 'storageVolumeCopacity': 200000000, 'storageVolumeUsage': 5000000 };
      this.setFiles(this.filterData(data.data));
    });
  }

  public handleFolderMove(directoryId: string, currentFolderId: string | null, targetFolderId: string | null): void {
    const addData = { documentId: directoryId, directoryId: targetFolderId };

    this.addOrderMove(addData).pipe(
      catchError(error => {
        console.error('Ошибка при добавлении папки:', error);
        return throwError(() => error);
      })
    ).subscribe((data: any) => {
      this.storageInfo = { 'storageVolumeCopacity': 200000000, 'storageVolumeUsage': 5000000 };
      this.setFiles(this.filterData(data.data));
    });
  }

}
