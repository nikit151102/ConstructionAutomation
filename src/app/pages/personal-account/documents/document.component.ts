import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DocumentsService } from './documents.service';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ToastModule } from 'primeng/toast';
import { FormsComponent } from './forms/forms.component';
import { ActivatedRoute } from '@angular/router';
import { ConfigType, getFormConfig } from './confs';

@Component({
  selector: 'app-document',
  standalone: true,
  imports: [CommonModule, FileUploadModule, ToastModule, ReactiveFormsModule, FormsModule, DropdownModule, CalendarModule, SelectButtonModule, FormsComponent],
  templateUrl: './document.component.html',
  styleUrl: './document.component.scss'
})
export class DocumentComponent implements OnInit {

  config: any;

  constructor(public documentsService: DocumentsService, private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {
      const configType = params.get('configType') as ConfigType | null;

      if (configType && ['comparativeStatement', 'materialSpecification', 'workSpecification'].includes(configType)) {
        this.config = getFormConfig(configType as ConfigType);
      } else {
        console.error('Invalid configType:', configType);
      }
    });
    
  }

}