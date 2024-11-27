import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileSelectEvent } from 'primeng/fileupload';
import { DropdownComponent } from './dropdown/dropdown.component';
import { FileInputComponent } from './file-input/file-input.component';
import { TextInputComponent } from './text-input/text-input.component';
import { CommonModule } from '@angular/common';
import { FormsService } from './forms.service';
import { ActivatedRoute } from '@angular/router';
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
  }
  
  @Output() onSelect = new EventEmitter<{ event?: FileSelectEvent; file: File, sheetName?: string }>();
  @Output() uploadSuccess = new EventEmitter<any>();

  form!: FormGroup;
  files: { [key: string]: { file: File; sheetName?: string; fileId?: string } } = {};

  constructor(private fb: FormBuilder, private formsService: FormsService,
    private activatedRoute: ActivatedRoute,
    private toastService: ToastService,
    private progressSpinnerService: ProgressSpinnerService,
    private commomFileService: CommomFileService
  ) { }

  ngOnInit(): void {
    this.fileMetadata = null;
    console.log("configconfig", this.config)
    this.initForm();

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

    if (this.config.fileInputs && Array.isArray(this.config.fileInputs)) {
      this.config.fileInputs.forEach((fileInput: any) => {
        const fileData = this.files[fileInput.key];
        if (fileData) {
          formData.append(fileInput.key, fileData.file);

          if (fileData.sheetName  && !fileData.fileId) {
            formData.append(`${fileInput.key}ListName`, fileData.sheetName);
            
          }
          if (fileData.sheetName && fileData.fileId) {
            formData.append(`${fileInput.key}Id`, fileData.fileId);
          }
        }
      });
    }

    this.config.controls.forEach((control: any) => {
      const value = this.form.get(control.name)?.value;
      if (value !== undefined) {
        formData.append(control.name, value);
      }
    });


    const filteredFormData = new FormData();
    const entries = [...(formData as any).entries()];
    const addedKeys = new Set();

    entries.forEach(([key, value]) => {
      if (!value) {
        console.warn(`Skipped empty value for key: '${key}'`);
        return;
      }
      if (!addedKeys.has(key)) {
        filteredFormData.append(key, value);
        addedKeys.add(key);
      } else {
        console.warn(`Duplicate key skipped: '${key}'`);
      }
    });


    // for (const [key, value] of (filteredFormData as any).entries()) {
    //   console.log(`${key}:`, value);
    // }

    let userId = localStorage.getItem('VXNlcklk')
    if (userId)
      filteredFormData.append('UserId', userId);
    this.progressSpinnerService.show();
    this.formsService.uploadFiles(filteredFormData, this.config.endpoint).subscribe({
      next: (response: any) => {
        this.progressSpinnerService.hide();
        console.log('Success:', response)
        this.uploadSuccess.emit(response);
        this.fileMetadata = response.documentMetadata;
      },
      error: (error: any) => {
        console.error('Error:', error)
        this.progressSpinnerService.hide();
        this.toastService.showError('Ошибка', 'Не удалось сформировать документ');
      }
      ,
    });
  }

  fileMetadata:any = null;
  downloadFile() {
    this.commomFileService.downloadFile(this.fileMetadata.id);
  }


}