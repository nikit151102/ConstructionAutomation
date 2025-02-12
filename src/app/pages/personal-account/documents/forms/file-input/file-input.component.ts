import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FileSelectEvent, FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import * as XLSX from 'xlsx';
import { DialogModule } from 'primeng/dialog';
import { SelectButtonModule } from 'primeng/selectbutton';
import { MyDocumentsService } from '../../../my-documents/my-documents.service';
import { DialogStorageService } from '../../../../../components/dialog-storage/dialog-storage.service';
import { TooltipComponent } from '../../../../../ui-kit/tooltip/tooltip.component';

@Component({
  selector: 'app-file-input',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ToastModule,
    FileUploadModule,
    FormsModule,
    DialogModule,
    SelectButtonModule,
    TooltipComponent
  ],
  templateUrl: './file-input.component.html',
  styleUrls: ['./file-input.component.scss'],
})
export class FileInputComponent implements OnInit, OnDestroy {
  @Input() chooseLabel = 'Upload';
  @Input() chooseIcon = 'pi pi-upload';
  @Input() accept = '';
  @Input() showSheetSelection = false;
  @Output() onSelect = new EventEmitter<{ event?: FileSelectEvent; file: File; sheetName?: string; fileId: string }>();
  @Output() confirm = new EventEmitter<FileInputComponent>();

  @Input() textTooltip: {
    isVisible: boolean,
    text: string
  } = {
      isVisible: false,
      text: ''
    };

  confSelection() {
    this.confirm.emit(this); // Уведомляем родителя о подтверждении
  }
  @ViewChild('fileUpload') fileUpload: any;

  visible = false;
  visibleDelete = false;

  fileName = '';
  sheetName = '';
  sheetNames: string[] = [];
  selectFile!: File;
  selectEvent!: FileSelectEvent;
  fileId: string = '';

  constructor(
    private myDocumentsService: MyDocumentsService,
    private cdr: ChangeDetectorRef,
    public dialogStorageService: DialogStorageService
  ) { }
  ngOnDestroy(): void {
    this.resetFileSelection();
    console.log(' this.resetFileSelection();')
  }

  ngOnInit(): void {
    this.resetFileSelection();
  }

  private updateButtonText(value:string): void {
    if (this.fileUpload) {
      const buttonLabelElement = this.fileUpload.el.nativeElement.querySelector('.p-button-label');
      if (buttonLabelElement) {
        buttonLabelElement.textContent = value; 
      }
    }
  }

  handleSelect(event: FileSelectEvent): void {

    const file = event.files[0];

    if (file?.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      this.updateButtonText('Файл выбран');
      const reader = new FileReader();
      reader.onload = (e: any) => this.processExcelFile(e.target.result, file, event);
      reader.readAsBinaryString(file);
    }
  }

  private processExcelFile(data: ArrayBuffer, file: File, event: FileSelectEvent): void {
    try {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        try {
          const data = e.target.result;
          const workbook = XLSX.read(data, { type: 'array' });

          this.sheetNames = workbook.SheetNames;
          console.log('Sheet names:', this.sheetNames);

          if (!this.sheetNames.length) {
            console.error('No sheets found in the file');
            return;
          }

          this.selectFile = file;
          this.visibleDelete = true;
          this.showSheetSelection = true;
          this.cdr.detectChanges();
          if (this.sheetNames.length === 1) {
            console.error(' Excel file length === 1');
            this.emitSelection(event, file, this.sheetNames[0], this.fileId);
          } else {
            this.showSheetSelection = true;
          }
        } catch (error) {
          console.error('Error processing Excel file:', error);
        }
      };

      reader.readAsArrayBuffer(file);

    } catch (error) {
      console.error('Failed to process Excel file:', error);
    }
  }

  clearFile(): void {
    this.fileUpload.clear();
    this.resetFileSelection();
    this.updateButtonText(this.chooseLabel);
  }


  private resetFileSelection(): void {
    this.selectFile = null!;
    this.selectEvent = null!;
    this.sheetNames = [];
    this.sheetName = '';
    this.fileName = '';
    this.fileId = '';
    this.showSheetSelection = false;
    this.visibleDelete = false;
  }

  onSheetSelect(selectedSheet: string): void {
    this.sheetName = selectedSheet;
    this.emitSelection(this.selectEvent, this.selectFile, selectedSheet, this.fileId);
  }

  private emitSelection(event: FileSelectEvent, file: File, sheetName: string, fileId: string): void {
    this.onSelect.emit({ event, file, sheetName, fileId });

  }


  ismyDownloadFile: any;

  onChangeSelectFile(event: any): void {

    if (!event?.id) {
      return;
    }

    this.ismyDownloadFile = event;
  }

  setCurrentFile(event: any) {
    this.myDocumentsService.downloadFile(event.id).subscribe({
      next: (data) => {
        this.fileId = event.id;
        const fileName = event.fileName || 'UploadedFile.xlsx';

        // Проверяем, что пришел fileContents в формате base64
        const base64Data = data.file.fileContents;
        if (base64Data) {
          // Декодируем base64 в бинарные данные
          const byteCharacters = atob(base64Data);  // Расшифровка base64 в строку
          const byteArrays = [];

          // Преобразуем строку в массив байтов
          for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
            const slice = byteCharacters.slice(offset, offset + 1024);
            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
              byteNumbers[i] = slice.charCodeAt(i);
            }
            byteArrays.push(new Uint8Array(byteNumbers));
          }

          // Создаем Blob из бинарных данных
          const fileBlob = new Blob(byteArrays, { type: data.file.contentType });

          // Шаг 1: Создаем файл из Blob
          const file = new File([fileBlob], fileName, { type: fileBlob.type });

          // Шаг 2: Чтение содержимого файла с помощью FileReader
          const reader = new FileReader();
          reader.onload = (e: any) => {
            try {
              // Шаг 3: Обрабатываем Excel файл
              const data = e.target.result;
              const workbook = XLSX.read(data, { type: 'array' });  // Убедитесь, что передаете данные, а не file

              // Извлекаем имена листов
              this.sheetNames = workbook.SheetNames;

              if (!this.sheetNames.length) {
                return;
              }

              // Чтение содержимого каждого листа
              const allSheetsContent: { [sheetName: string]: any[] } = {};

              this.sheetNames.forEach((sheetName) => {
                const sheet = workbook.Sheets[sheetName];
                // Преобразуем лист в массив строк
                allSheetsContent[sheetName] = XLSX.utils.sheet_to_json(sheet, { header: 1 });
              });

              // Эмуляция FileSelectEvent для дальнейшей обработки
              const eventMock: FileSelectEvent = {
                files: [file],
                originalEvent: null as any,
                currentFiles: [file],
              };

              // Передаем в обработчик
              this.handleSelect(eventMock);
            } catch (error) {
              console.error('Failed to process the file:', error);
            }
          };

          // Чтение файла как ArrayBuffer (лучше для бинарных данных)
          reader.readAsArrayBuffer(file);
        } else {
          console.error('No fileContents found in the response');
        }
      },
      error: (err) => {
        console.error('Failed to download file:', err);
      },
    });
  }


  handleFileProgrammatically(file: File): void {
    const eventMock: FileSelectEvent = {
      files: [file],
      originalEvent: null as any,
      currentFiles: [file],
    };
    this.handleSelect(eventMock);
  }


  confirmSelection(file:any): void {
    this.setCurrentFile(file);
  }

}
