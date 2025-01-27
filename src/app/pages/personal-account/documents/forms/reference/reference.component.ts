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
  styleUrls: ['./reference.component.scss']
})
export class ReferenceComponent {
  @Input() name!: string;
  @Input() label!: string;
  @Input() endpoint!: string;
  @Input() fields!: string[];
  @Output() selectedId = new EventEmitter<string>();

  control = new FormControl('', Validators.required);
  options: any;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    console.log('endpoint', this.endpoint);
    console.log('fields',this.fields)
    if (this.endpoint) {
      const token = localStorage.getItem('YXV0aFRva2Vu');
      const headers = new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      });

      this.http.get<{ message: string; status: number; data: any[] }>(
        `${environment.apiUrl}${this.endpoint}`,
        { headers }
      ).subscribe(response => {
        if (response.data && Array.isArray(response.data)) {
          this.options = response.data;
        }
      }, error => {
        console.error('HTTP request failed:', error);
        this.options = [];
      });
    }

    this.control.valueChanges.subscribe(value => {
      if (value) {
        this.selectedId.emit(value);
      }
    });
  }



}
