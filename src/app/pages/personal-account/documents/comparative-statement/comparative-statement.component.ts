import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { FileUploadModule, FileSelectEvent } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { SelectedFiles } from '../../../../interfaces/files';
import { ComparativeStatementService } from './comparative-statement.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import * as XLSX from 'xlsx';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-comparative-statement',
  standalone: true,
  imports: [CommonModule, FileUploadModule, ToastModule, ReactiveFormsModule, FormsModule, DropdownModule, CalendarModule],
  templateUrl: './comparative-statement.component.html',
  styleUrl: './comparative-statement.component.scss',
  providers: [
    MessageService
  ]
})

export class ComparativeStatementComponent implements OnInit {

  id: string = '';
  form!: FormGroup;
  File1!: File;
  File2!: File;
  sheetNamesFile1: string[] = [];
  sheetNamesFile2: string[] = [];

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private comparativeStatementService: ComparativeStatementService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      contractorName: ['', Validators.required],
      statementDate: [new Date(), Validators.required],
      system: ['', Validators.required],
      planFileListName: ['', Validators.required],
      summaryFileListName: ['', Validators.required],
    });

    this.route.paramMap.subscribe(params => {
      this.id = params.get('id') || ''; 
      console.log('params.get()', params.get('id'))
    });
  }

  onSelect(fileKey: string, event: FileSelectEvent) {
    const files = event.files;
    if (files.length > 1) {
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'You can only upload one file at a time.' });
      return;
    }
    if (fileKey === 'file1') {
      this.File1 = files[0];
      this.extractSheetNames(this.File1, 'file1');
    } else if (fileKey === 'file2') {
      this.File2 = files[0];
      this.extractSheetNames(this.File2, 'file2');
    }
  }

  extractSheetNames(file: File, fileKey: string) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetNames = workbook.SheetNames;
      if (fileKey === 'file1') {
        this.sheetNamesFile1 = sheetNames;
      } else if (fileKey === 'file2') {
        this.sheetNamesFile2 = sheetNames;
      }
    };
    reader.readAsArrayBuffer(file);
  }

  onUpload() {
    if (!this.File1 || !this.File2 || this.form.invalid || this.id.length == 0) {
      console.log('this.id.',this.id)
      return;
    }
    

    const formData = new FormData();
    formData.append('UserId', this.id);
    formData.append('planFile', this.File1);
    formData.append('summaryFile', this.File2);
    formData.append('planFileListName', this.form.get('planFileListName')?.value);
    formData.append('summaryFileListName', this.form.get('summaryFileListName')?.value);
    formData.append('contractorName', this.form.get('contractorName')?.value);
    formData.append('statementDate', this.form.get('statementDate')?.value);
    formData.append('system', this.form.get('system')?.value);

    this.comparativeStatementService.uploadFiles(formData).subscribe({
      next: (response) => console.log("Data successfully", response),
      error: (error) => console.log("Error sending Data", error)
    });
  }
}