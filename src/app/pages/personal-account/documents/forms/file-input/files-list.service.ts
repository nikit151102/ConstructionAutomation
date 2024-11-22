import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'any'
})
export class FilesListService {

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




  

}
