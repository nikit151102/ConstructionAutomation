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
import { CommomFileService } from '../../../../services/file.service';

@Component({
  selector: 'app-forms',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, DropdownComponent, FileInputComponent, TextInputComponent],
  templateUrl: './forms.component.html',
  styleUrl: './forms.component.scss'
})
export class FormsComponent {

  private _config: any;

  @Input()
  set config(value: any) {
    this._config = value;
    this.onConfigChange(); 
  }
  get config(): any {
    return this._config;
  }

  onConfigChange() {
    this.fileMetadata = null;
    this.files = {}; // Сброс файлов
    this.sortedControls = [];
    this.initForm(); // Реинициализация формы с новым конфигом
    this.form.reset(); // Сбрасываем все значения формы
    this.updateSortedControls();
    this.cdr.detectChanges();

  }
  
  @Output() onSelect = new EventEmitter<{ event?: FileSelectEvent; file: File, sheetName?: string }>();
  @Output() uploadSuccess = new EventEmitter<any>();

  form!: FormGroup;
  files: { [key: string]: { file: File; sheetName?: string; fileId?: string } } = {};
  sortedControls: any;
  constructor(private fb: FormBuilder, private formsService: FormsService,
    private toastService: ToastService,
    private progressSpinnerService: ProgressSpinnerService,
    private commomFileService: CommomFileService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.fileMetadata = null;
    this.sortedControls = null;
    console.log("configconfig", this.config)
    this.initForm();
    this.updateSortedControls();
  }

  updateSortedControls(){
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
  
    this.form = this.fb.group(formControls);
  }
  

  getSafeFormControl(group: FormGroup, controlName: string): FormControl {
    const control = group.get(controlName);
    if (!(control instanceof FormControl)) {
      throw new Error(`Control with name '${controlName}' is not a FormControl.`);
    }
    return control;
  }


  onFileSelect(data: { event?: FileSelectEvent; file: File; sheetName?: string; fileId: string  }, key: string) {
    const file = data.file;

    if (file) {

      this.files[key] = { file, sheetName: data.sheetName, fileId: data.fileId };
      console.log('data.fileId',data.fileId)
    } else {
      console.warn(`No file provided for key ${key}`);
    }
    this.cdr.detectChanges();
  }
  
  
  onSubmit() {
    const formData = new FormData();
    const appendedKeys = new Set<string>(); // Для отслеживания добавленных ключей
    // console.log('Начинаем обработку формы.');
  
    // Обработка обычных полей
    this.config.controls.forEach((control: any) => {
      const value = this.form.get(control.name)?.value;
  
      // console.log(`Обрабатываем поле: ${control.name}, значение: ${value}`);
  
      // Проверка, что значение не undefined, и добавление в FormData
      if (value !== undefined) {
        // Обработка dropdown, связанного с файловым вводом
        if (control.type === 'dropdown' && control.isFileInput) {
          const fileControlName = control.name.replace('ListName', '');
          const fileData = this.files[fileControlName];
  
          // console.log(`Поле типа dropdown для ${control.name}, ищем файл: ${fileControlName}`);
  
          if (fileData && fileData.sheetName && !fileData.fileId) {
            // Проверка, существует ли уже ключ, если да, то обновить, если нет — добавить
            if (appendedKeys.has(control.name)) {
              // console.log(`Удаляем старое значение для ключа ${control.name}`);
              formData.delete(control.name); // Удалить существующее значение
            }
            // console.log(`Добавляем в FormData: ${control.name} = ${fileData.sheetName}`);
            formData.append(control.name, fileData.sheetName);
            appendedKeys.add(control.name); // Отслеживаем ключ
          } else {

            // console.warn(`Файл для dropdown ${control.name} не найден`);
          }
        } else {
          // Для обычных полей
          if (appendedKeys.has(control.name)) {
            // console.log(`Удаляем старое значение для ключа ${control.name}`);
            formData.delete(control.name); // Удалить существующее значение
          }
          // console.log(`Добавляем в FormData: ${control.name} = ${value}`);
          formData.append(control.name, value);
          appendedKeys.add(control.name); // Отслеживаем ключ
        }
      } else {
        // console.warn(`Значение для ${control.name} не определено, пропускаем.`);
      }
  
      // Обработка файловых полей
      if (control.type === 'file' && this.files[control.name]) {
        const file = this.files[control.name].file;
        if (file) {
          if (appendedKeys.has(control.name)) {
            // console.log(`Удаляем старое значение для файла с ключом ${control.name}`);
            formData.delete(control.name); // Удалить существующее значение
          }
          // console.log(`Добавляем файл в FormData: ${control.name} = ${file.name}`);
          formData.append(control.name, file);
          appendedKeys.add(control.name); // Отслеживаем ключ
        } else {
          // console.warn(`Не выбран файл для ${control.name}`);
        }
      }
    });
  
    // Добавление UserId, если оно доступно
    let userId = localStorage.getItem('VXNlcklk');
    if (userId) {
      if (appendedKeys.has('UserId')) {
        // console.log(`Удаляем старое значение для ключа 'UserId'`);
        formData.delete('UserId'); 
      }
      // console.log(`Добавляем UserId в FormData: UserId = ${userId}`);
      formData.append('UserId', userId);
      appendedKeys.add('UserId'); 
    }
  
    // console.log('Финальные данные формы:');
    formData.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });
    
    this.uploadSuccess.emit(null);
    this.progressSpinnerService.show();
    this.formsService.uploadFiles(formData, this.config.endpoint).subscribe({
      next: (response: any) => {
        this.progressSpinnerService.hide();
        this.uploadSuccess.emit(response);
        this.fileMetadata = response.documentMetadata;
        console.log(' response.documentMetadata:', response.documentMetadata)
      },
      error: (error: any) => {
        console.error('Error:', error);
        this.progressSpinnerService.hide();
        this.toastService.showError('Ошибка', 'Не удалось сформировать документ');
      }
    });
  }
 
  getFormattedDivergenceList(): string {
    return this.fileMetadata?.divergenceList.replace(/\n/g, '<br>') || '';
  }
  
  
  getFormattedErrorListCipher(): string {
    return this.fileMetadata?.errorListCipher.replace(/\n/g, '<br>') || '';
  }
  

  fileMetadata:any = null;
  downloadFile(type:string) {
    if(type == 'excel'){
      this.commomFileService.downloadFile(this.fileMetadata.fullResultXlsx.id);
    }
    if(type == 'pdf'){
      this.commomFileService.downloadFile(this.fileMetadata.fullResultPdf.id);
    }
  }


}