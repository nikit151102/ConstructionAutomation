import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor() { }

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
}
