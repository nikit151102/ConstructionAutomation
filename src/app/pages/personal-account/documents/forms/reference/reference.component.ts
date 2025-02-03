import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../../../environment';

@Component({
  selector: 'app-reference',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './reference.component.html',
  styleUrls: ['./reference.component.scss'],
})
export class ReferenceComponent {
  @Input() name!: string;
  @Input() label!: string;
  @Input() endpoint!: string;
  @Input() fields!: string[];
  @Output() selectedId = new EventEmitter<string>();

  control = new FormControl('', Validators.required);
  options: any;
  showDefault: boolean = false;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {

    if (this.endpoint) {
      this.loadData();
    }

    this.control.valueChanges.subscribe(value => {
      if (value) {
        this.selectedId.emit(value);
      }
    });
  }


  loadData(){
    const token = localStorage.getItem('YXV0aFRva2Vu');
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    });

    this.http.get<{ message: string; status: number; data: any[] }>(
      `${environment.apiUrl}${this.endpoint}`,
      { headers }
    ).subscribe(response => {
      setTimeout(() => {
        if (response.data && Array.isArray(response.data)) {
          if (response.data.length > 0) {
            this.showDefault = false;
          } else {
            this.showDefault = true;
          }
          this.options = response.data;
        }
      }, 100);
    }, error => {
      this.options = [];
    });
  }
  

}
