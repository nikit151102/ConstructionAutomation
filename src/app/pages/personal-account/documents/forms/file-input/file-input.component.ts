import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FileSelectEvent, FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';  

@Component({
  selector: 'app-file-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ToastModule, FileUploadModule, FormsModule],
  templateUrl: './file-input.component.html',
  styleUrl: './file-input.component.scss'
})
export class FileInputComponent {
  @Input() chooseLabel: string = 'Upload';
  @Input() chooseIcon: string = 'pi pi-upload';
  @Input() accept: string = '';
  @Input() showSheetSelection: boolean = false; 
  @Output() onSelect = new EventEmitter<{ event?: FileSelectEvent; file: File, sheetName?: string }>();

  sheetName: string = ''; 
  sheetNames: string[] = [];
  selectFile!: File;
  selectEvent!: FileSelectEvent;
visibleDelete: boolean = false;
  handleSelect(event: FileSelectEvent) {
    const file = event.files[0];
    this.selectEvent = event;
  
    if (file && file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      const reader = new FileReader();
  
      reader.onload = (e: any) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });
  
        this.sheetNames = workbook.SheetNames;
        this.selectFile = file;
        this.visibleDelete = true;
        if (this.sheetNames.length === 1) {
      
          this.sheetName = this.sheetNames[0];
          
          this.onSelect.emit({
            event: event,
            file: file,
            sheetName: this.sheetName, 
          });
        } else if (this.sheetNames.length > 1) {

          this.showSheetSelection = true;
        }
      };
  
      reader.readAsBinaryString(file);
    }
  }
  
  clearFile(fileUpload: any) {
    fileUpload.clear();  
    this.selectFile = null!;
    this.sheetNames = [];
    this.sheetName = '';
    this.showSheetSelection = false;
    this.visibleDelete = false;
  }

  onSheetSelect(selectedSheet: string) {
    this.sheetName = selectedSheet;
    this.onSelect.emit({
      event: this.selectEvent, 
      file: this.selectFile,
      sheetName: this.sheetName
    });
  }
  
  
}