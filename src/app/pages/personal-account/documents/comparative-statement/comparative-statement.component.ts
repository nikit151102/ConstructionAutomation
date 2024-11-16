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
import { PersonalAccountService } from '../../personal-account.service';
import { ExcelViewerComponent } from '../../../../components/excel-viewer/excel-viewer.component';
import { SelectButtonModule } from 'primeng/selectbutton';

@Component({
  selector: 'app-comparative-statement',
  standalone: true,
  imports: [CommonModule, FileUploadModule, ToastModule, ReactiveFormsModule, FormsModule, DropdownModule, CalendarModule,ExcelViewerComponent, SelectButtonModule],
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
  selectedFile: File | null = null;
  selectedSheet: string = '';
  sheetNamesFile1: string[] = [];
  sheetNamesFile2: string[] = [];
  viewSheetName: string = ''; 
  stateOptions: any[] = [
    { label: 'Локальная смета', value: 'file1' },
    { label: 'КС-2', value: 'file2' }
  ];

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private comparativeStatementService: ComparativeStatementService,
    private route: ActivatedRoute,
    private personalAccountService: PersonalAccountService
  ) {
    this.personalAccountService.changeTitle('Сопоставительная ведомость');
  }

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
    });

    this.form.get('planFileListName')?.valueChanges.subscribe(value => {
      if (this.viewSheetName === 'file1') {
        this.selectedSheet = value;
      }
    });

    this.form.get('summaryFileListName')?.valueChanges.subscribe(value => {
      if (this.viewSheetName === 'file2') {
        this.selectedSheet = value;
      }
    });
  }
  isFullscreen: boolean = false;

  toggleFullscreen() {
    this.isFullscreen = !this.isFullscreen;
  }

  onSelect(fileKey: string, event: FileSelectEvent) {
    const files = event.files;
    if (files.length > 1) {
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'You can only upload one file at a time.' });
      return;
    }
  
    const file = files[0];
    if (fileKey === 'file1') {
      this.File1 = file;
      this.extractSheetNames(this.File1, 'file1');
    } else if (fileKey === 'file2') {
      this.File2 = file;
      this.extractSheetNames(this.File2, 'file2');
    }
  
    this.viewSheetName = fileKey;
    this.selectedFile = file;
  }
  

  extractSheetNames(file: File, fileKey: string) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetNames = workbook.SheetNames;
  
      if (fileKey === 'file1') {
        this.sheetNamesFile1 = sheetNames;
        this.form.patchValue({ planFileListName: sheetNames[0] });
      } else if (fileKey === 'file2') {
        this.sheetNamesFile2 = sheetNames;
        this.form.patchValue({ summaryFileListName: sheetNames[0] });
      }
  
      this.selectedSheet = sheetNames[0] || '';
    };
    reader.readAsArrayBuffer(file);
  }
  
  onViewChange(fileKey: string) {
    this.viewSheetName = fileKey;
    if (fileKey === 'file1') {
      this.selectedFile = this.File1;
      this.selectedSheet = this.form.get('planFileListName')?.value || '';
    } else if (fileKey === 'file2') {
      this.selectedFile = this.File2;
      this.selectedSheet = this.form.get('summaryFileListName')?.value || '';
    }
  }

  onUpload() {
    if (!this.File1 || !this.File2 || this.form.invalid || this.id.length == 0) {
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