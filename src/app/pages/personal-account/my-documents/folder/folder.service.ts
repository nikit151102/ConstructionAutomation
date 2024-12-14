import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environment';
import { CurrentUserService } from '../../../../services/current-user.service';



@Injectable({
  providedIn: 'root'
})
export class FolderService {

  private apiUrl = environment.apiUrl;

  private currentMenu: any = null;

  public visibleShonRename: boolean = false;
  public oldFileName: string = '';

  setMenu(menu: any) {
    if (this.currentMenu && this.currentMenu !== menu) {
      this.currentMenu.hide();
    }
    this.currentMenu = menu;
  }

  clearMenu() {
    this.currentMenu = null;
  }

  constructor(private http: HttpClient, private currentUserService: CurrentUserService) { }

  renameFolder(idFolder: string, data: any) {
    const userId = localStorage.getItem('VXNlcklk');
    const url = `${this.apiUrl}/Directories/${idFolder}`;
    const token = localStorage.getItem('YXV0aFRva2Vu');

    return this.http.put<any[]>(url,
      data,
      {
        headers: new HttpHeaders({
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }),
      });
  }

  transitionFolder(idFolder: string) {
    const userId = localStorage.getItem('VXNlcklk');
    const url = `${this.apiUrl}/api/Profile/UserDirectories/${idFolder}`;
    const token = localStorage.getItem('YXV0aFRva2Vu');

    return this.http.get<any[]>(url, {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }),
    });

  }


  deleteFolder(idFolder: string) {
    const url = `${this.apiUrl}/Directories/${idFolder}`;
    const token = localStorage.getItem('YXV0aFRva2Vu');

    return this.http.delete<any[]>(url, {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }),
    });
  }

  openFolder(idFolder: string) {
    const url = `${this.apiUrl}/Directories/${idFolder}`;
    const token = localStorage.getItem('YXV0aFRva2Vu');

    return this.http.get<any[]>(url, {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }),
    });
  }


  addFolder(data: any) {
    const userId = this.currentUserService.getUser();
    const url = `${this.apiUrl}/Directories/${userId.id}`;
    const token = localStorage.getItem('YXV0aFRva2Vu');

    return this.http.post<any[]>(url, data, {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }),
    });
  }

}
