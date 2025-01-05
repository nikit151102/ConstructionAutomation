import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DialogStorageService {

  currentAction: string = ''

  constructor() { }

  private isListFiles = new BehaviorSubject<boolean>(false);
  isListFilesVisible$ = this.isListFiles.asObservable();


  setlistView(isVertical: boolean) {
    this.isListFiles.next(isVertical);
  }

  private isVertical = new BehaviorSubject<boolean>(false);
  isVertical$ = this.isVertical.asObservable();


  setTypeView(isVertical: boolean) {
    this.isVertical.next(isVertical);
  }


  private isVisibleDialog = new BehaviorSubject<boolean>(false);
  isVisibleDialog$ = this.isVisibleDialog.asObservable();

  setIsVisibleDialog(value: boolean): void {
    this.isVisibleDialog.next(value);
  }

  getIsVisibleDialog(): boolean {
    return this.isVisibleDialog.getValue();
  }

  
  private isfileAction = new BehaviorSubject<string>('');
  isfileAction$ = this.isfileAction.asObservable();

  setFileAction(value: string): void {
    this.isfileAction.next(value);
  }

  getFileAction(): string {
    return this.isfileAction.getValue();
  }

}
