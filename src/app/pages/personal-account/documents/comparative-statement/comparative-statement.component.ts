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


@Component({
  selector: 'app-comparative-statement',
  standalone: true,
  imports: [FileUploadModule, ToastModule, ReactiveFormsModule, FormsModule, DropdownModule, CalendarModule],
  templateUrl: './comparative-statement.component.html',
  styleUrl: './comparative-statement.component.scss',
  providers: [
    MessageService
  ]
})

export class ComparativeStatementComponent implements OnInit {

  form!: FormGroup;
  File1!: File;
  File2!: File;
  sheetNamesFile1: string[] = [];
  sheetNamesFile2: string[] = [];
  selectedSheetFile1!: string;
  selectedSheetFile2!: string;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private comparativeStatementService: ComparativeStatementService
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      contractorName: ['', Validators.required],
      statementDate: [new Date(), Validators.required],
      system: ['', Validators.required]
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
    } else if (fileKey === 'file2') {
      this.File2 = files[0];
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
    if (!this.File1 || !this.File2 || this.form.invalid) {
      return;
    }

    const selectedFiles: SelectedFiles = {
      planFile: this.File1,
      summaryFile: this.File2,
      planFileListName: "",
      summaryFileListName: "",
      contractorName: this.form.get('contractorName')?.value,
      statementDate: this.form.get('statementDate')?.value,
      system: this.form.get('system')?.value,
      NameFile1: this.selectedSheetFile1,
      NameFile2: this.selectedSheetFile2
    };

    console.log(selectedFiles);

    this.comparativeStatementService.uploadFiles(selectedFiles).subscribe({
      next: (response) => console.log("Data successfully", response),
      error: (error) => console.log("Error sending Data", error)
    });
  }
}