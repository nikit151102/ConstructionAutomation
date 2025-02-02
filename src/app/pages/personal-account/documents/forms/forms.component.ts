import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileSelectEvent } from 'primeng/fileupload';
import { DropdownComponent } from './dropdown/dropdown.component';
import { FileInputComponent } from './file-input/file-input.component';
import { TextInputComponent } from './text-input/text-input.component';
import { CommonModule } from '@angular/common';
import { FormsService } from './forms.service';
import { ToastService } from '../../../../services/toast.service';
import { ProgressSpinnerService } from '../../../../components/progress-spinner/progress-spinner.service';
import { UploadData } from '../../../../interfaces/docs';
import { Response } from '../../../../interfaces/common';
import { DialogStorageComponent } from '../../../../components/dialog-storage/dialog-storage.component';
import { DialogStorageService } from '../../../../components/dialog-storage/dialog-storage.service';
import { InstructionsComponent } from '../../../../components/instructions/instructions.component';
import { InstructionsService } from '../../../../components/instructions/instructions.service';
import { ReferenceComponent } from './reference/reference.component';
import { DateComponent } from './date/date.component';
import { DocumentsService } from '../documents.service';

@Component({
  selector: 'app-forms',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, DropdownComponent, FileInputComponent, TextInputComponent, DialogStorageComponent, InstructionsComponent, ReferenceComponent, DateComponent],
  templateUrl: './forms.component.html',
  styleUrl: './forms.component.scss'
})
export class FormsComponent {

  private _config: any;

  @Input()
  set config(value: any) {
    this._config = value;
    this.fileInstruction = `${this._config.fileInstruction}`
    this.onConfigChange();
  }
  get config(): any {
    return this._config;
  }

  selectedFolder: string = '';
  fileInstruction: string = '';

  onConfigChange() {
    this.files = {}; // Сброс файлов
    this.sortedControls = [];
    this.initForm(); // Реинициализация формы с новым конфигом
    this.form.reset(); // Сбрасываем все значения формы
    this.updateSortedControls();
    this.cdr.detectChanges();
    this.selectedFolder = `${this._config.nameDoc}`;
    this.fileInstruction = `${this._config.fileInstruction}`

  }

  @Output() onSelect = new EventEmitter<{ event?: FileSelectEvent; file: File, sheetName?: string }>();
  @Output() uploadSuccess = new EventEmitter<any>();

  activeFileInput!: FileInputComponent; // Хранит ссылку на текущий FileInputComponent

  onOpenDialog(fileInput: FileInputComponent | null, action: string): void {
    if (fileInput) {
      this.activeFileInput = fileInput; // Сохраняем ссылку на текущий file-input
      this.dialogStorageService.setFileAction('select')
    } else {
      this.dialogStorageService.setFileAction('click')
    }
    this.dialogStorageService.currentAction = action;
    this.dialogStorageService.setIsVisibleDialog(true); // Открываем диалог
  }


  onDialogConfirm(event: any) {
    if (this.activeFileInput && event.type === 'selectFile') {
      this.activeFileInput.confirmSelection(event.confirm); // Вызываем метод file-input
    } else if (event.type === 'selectDirectory') {
      this.form.patchValue({
        directoryId: event.confirm.idFolder
      });

      this.selectedFolder = event.confirm.label
    }
  }

  form!: FormGroup;
  files: { [key: string]: { file: File; sheetName?: string; fileId?: string } } = {};
  sortedControls: any;
  constructor(private fb: FormBuilder, private formsService: FormsService,
    private toastService: ToastService,
    private progressSpinnerService: ProgressSpinnerService,
    private cdr: ChangeDetectorRef,
    public dialogStorageService: DialogStorageService,
    public instructionsService: InstructionsService,
    private documentsService: DocumentsService
  ) { }

  ngOnInit(): void {
    this.sortedControls = null;
    this.dialogStorageService.setIsVisibleDialog(false);
    this.initForm();
    this.updateSortedControls();
  }

  updateSortedControls() {
    this.sortedControls = [...this.config.controls]
      .filter(control => control.order !== 0) // Исключаем элементы с order === 0
      .sort((a, b) => (a.order || Number.MAX_SAFE_INTEGER) - (b.order || Number.MAX_SAFE_INTEGER)); // Сортируем остальные
  }

  initForm() {
    const formControls: any = {};
    this.config.controls.forEach((control: any) => {
      formControls[control.name] = [
        control.defaultValue || '',
        control.validators || [],
      ];
    });
    formControls['directoryId'] = ["00000000-0000-0000-0000-000000000000", []];
    this.form = this.fb.group(formControls);
  }


  getSafeFormControl(group: FormGroup, controlName: string): FormControl {
    const control = group.get(controlName);
    if (!(control instanceof FormControl)) {
      throw new Error(`Control with name '${controlName}' is not a FormControl.`);
    }
    return control;
  }


  onFileSelect(data: { event?: FileSelectEvent; file: File; sheetName?: string; fileId: string }, key: string) {
    const file = data.file;
    console.log('onFileSelect data.fileId ', data.fileId)
    if (file) {
      this.files[key] = { file, sheetName: data.sheetName, fileId: data.fileId };
    }
    this.cdr.detectChanges();
  }

  onReferenceSelected(name: string, selectedId: string): void {
    this.form.get(name)?.setValue(selectedId);
  }

  handleDateChange(name: string, selectedDate: string): void {
    this.form.get(name)?.setValue(selectedDate);
  }


  onSubmit() {
    const formData = new FormData();
    const appendedKeys = new Set<string>(); // Для отслеживания добавленных ключей

    // Вспомогательная функция для добавления поля в FormData
    const addFieldToFormData = (name: string, value: any) => {
      if (value !== undefined) {
        // Если ключ уже был добавлен, удалить его
        if (appendedKeys.has(name)) {
          formData.delete(name);
        }
        formData.append(name, value);
        appendedKeys.add(name);
      }
    };

    // Обработка обычных полей
    this.config.controls.forEach((control: any) => {
      const value = this.form.get(control.name)?.value;

      if (control.type === 'dropdown' && control.isFileInput) {
        const fileControlName = control.name.replace('ListName', '');
        const fileData = this.files[fileControlName];

        if (fileData && fileData.sheetName && !fileData.fileId) {
          addFieldToFormData(control.name, fileData.sheetName);
        }
      } else if (control.type === 'file' && this.files[control.name]) {
        const fileData = this.files[control.name];

        if (fileData) {
          const fileId = fileData.fileId;

          if (fileId) {
            // Если fileId присутствует, добавляем его в форму как отдельное поле с суффиксом Id
            addFieldToFormData(`${control.name}Id`, fileId);
            if (fileData.file && fileData.file.name) {
              addFieldToFormData(`${control.name}ListName`, fileData.sheetName); // Добавляем имя файла

            }
          } else {
            // Если fileId нет, добавляем файл в форму
            const file = fileData.file;
            if (file) {
              addFieldToFormData(control.name, file);
            }
          }
        }
      } else {
        addFieldToFormData(control.name, value);
      }
    });


    // Добавление поля directoryId
    const directoryId = this.form.get('directoryId')?.value;
    if (directoryId !== undefined) {
      if (directoryId === null) {
        addFieldToFormData('directoryId', "00000000-0000-0000-0000-000000000000"); // Добавляем поле directoryId  
      } else {
        addFieldToFormData('directoryId', directoryId); // Добавляем поле directoryId
      }
    }

    // // Добавление UserId, если оно доступно
    // const userId = localStorage.getItem('VXNlcklk');
    // if (userId) {
    //   addFieldToFormData('UserId', userId);
    // }

    // Отправка данных
    this.uploadSuccess.emit(null);
    this.progressSpinnerService.show();

    this.formsService.uploadFiles(formData, this.config.endpoint).subscribe({
      next: (response: Response<UploadData>) => {
        this.progressSpinnerService.hide();
        this.uploadSuccess.emit(response);
      },
      error: (error) => {
        if (error?.error?.status == 701) {
          this.documentsService.descriptionPopupErrorForming = error?.error?.Message || '';
          this.documentsService.showPopupErrorForming = false;
          this.cdr.detectChanges();
        }else{
          const errorMessage = error?.error?.Message || 'Максимум 3 формирования одновременно. Подождите или отмените одно.';
          this.toastService.showError('Ошибка', errorMessage);
          this.progressSpinnerService.hide();
        }
      }
    });
  }

  openInstruction() {
    this.instructionsService.openInstruction();
    this.cdr.detectChanges();
  }


  ngOnDestroy(): void {
    this.dialogStorageService.setIsVisibleDialog(false);
  }
}