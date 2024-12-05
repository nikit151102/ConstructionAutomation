import { Component, EventEmitter, Input, Output } from '@angular/core';
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
    this.updateSortedControls();
  }
  
  @Output() onSelect = new EventEmitter<{ event?: FileSelectEvent; file: File, sheetName?: string }>();
  @Output() uploadSuccess = new EventEmitter<any>();

  form!: FormGroup;
  files: { [key: string]: { file: File; sheetName?: string; fileId?: string } } = {};
  sortedControls: any;
  constructor(private fb: FormBuilder, private formsService: FormsService,
    private toastService: ToastService,
    private progressSpinnerService: ProgressSpinnerService,
    private commomFileService: CommomFileService
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
    } else {
      console.warn(`No file provided for key ${key}`);
    }
  }
  
  onSubmit() {
    const formData = new FormData();
    const appendedKeys = new Set<string>();

    const addOrUpdateKey = (key: string, value: any) => {
        if (appendedKeys.has(key)) {
            formData.delete(key);
        }
        formData.append(key, value);
        appendedKeys.add(key);
    };

    this.config.controls.forEach((control: any) => {
        const value = this.form.get(control.name)?.value;

        if (value !== undefined) {
            if (control.type === 'dropdown' && control.isFileInput) {
                const fileControlName = control.name.replace('ListName', '');
                const fileData = this.files[fileControlName];

                if (fileData?.sheetName) {
                    addOrUpdateKey(control.name, fileData.sheetName);
                }
            } else {
                addOrUpdateKey(control.name, value);
            }
        }

        if (control.type === 'file' && this.files[control.name]) {
            const fileData = this.files[control.name];
            if (fileData?.fileId) {
                addOrUpdateKey(`${control.name}Id`, fileData.fileId);
            } else if (fileData?.file) {
                addOrUpdateKey(control.name, fileData.file);
            }
        }
    });

    const userId = localStorage.getItem('VXNlcklk');
    if (userId) {
        addOrUpdateKey('UserId', userId);
    }

    formData.forEach((value, key) => {
        console.log(`${key}: ${value}`);
    });
  
    this.progressSpinnerService.show();
    this.formsService.uploadFiles(formData, this.config.endpoint).subscribe({
      next: (response: any) => {
        this.progressSpinnerService.hide();
        this.uploadSuccess.emit(response);
        this.fileMetadata = response.documentMetadata;
        console.log('response.documentMetadata:', response.documentMetadata);
      },
      error: (error: any) => {
        console.error('Error:', error);
        this.progressSpinnerService.hide();
        this.toastService.showError('Ошибка', 'Не удалось сформировать документ');
      }
    });
  }
  
 

  fileMetadata:any = null;
  downloadFile() {
    this.commomFileService.downloadFile(this.fileMetadata.id);
  }


}