import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InstructionsService {

  constructor(private http: HttpClient) { }

  getInstructionHtml(filename: string): Observable<string> {
    return this.http.get(`instructions/${filename}`, { responseType: 'text' });
  }

  visibleInstruction: boolean = false;

  openInstruction() {
    this.visibleInstruction = true;
  }

  closeInstruction() {
    this.visibleInstruction = false;
  }

}
