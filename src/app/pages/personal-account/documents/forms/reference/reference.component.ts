import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../../../environment';
import { TooltipComponent } from '../../../../../ui-kit/tooltip/tooltip.component';
import { ReferenceService } from './reference.service';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-reference',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TooltipComponent],
  templateUrl: './reference.component.html',
  styleUrls: ['./reference.component.scss'],
})
export class ReferenceComponent {
  @Input() name!: string;
  @Input() label!: string;
  @Input() typeReference!: string;
  @Input() endpoint!: string;
  @Input() fields!: string[];
  @Output() selectedId = new EventEmitter<string>();
  @Input() textTooltip: {
    isVisible: boolean,
    text: string
  } = {
      isVisible: false,
      text: ''
    };
  referenceData: any
  control = new FormControl('', Validators.required);
  showDefault: boolean = false;

  constructor(public referenceService: ReferenceService) { }

  ngOnInit(): void {
    if(this.typeReference == 'Employees'){
      console.log('Employees')
      this.referenceService.referenceData$.subscribe((value: any) => {
        if (value && value > 0) {
          this.showDefault = false;
          this.referenceData = value;
        } else {
          this.showDefault = true;
          this.referenceData = [];
        }
      })
    }else{
      this.referenceService.loadData(this.endpoint).pipe(
        catchError((error) => {
          console.error('Ошибка при загрузке данных:', error);
          this.referenceData = []; 
          console.log('referenceData', this.referenceData)
          this.showDefault = true; 
          return of([]);  
        })
      ).subscribe((value: any) => {
        this.referenceData = value.data;
        this.showDefault = false;
      });
    }

    this.control.valueChanges.subscribe(value => {
      if (value) {
        this.selectedId.emit(value);
      }
    });
  }

  getOptionLabel(option: any): string {
    return this.fields.map(field => option[field]).filter(value => value).join(' ');
  }


}
