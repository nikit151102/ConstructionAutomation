import { CommonModule } from '@angular/common';
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { MyDocumentsService } from '../my-documents.service';
import { FormsModule } from '@angular/forms';
import { FolderService } from '../folder/folder.service';
import { ToastService } from '../../../../services/toast.service';

@Component({
  selector: 'app-create-folder',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule, FormsModule],
  templateUrl: './create-folder.component.html',
  styleUrls: ['./create-folder.component.scss']
})
export class CreateFolderComponent implements OnInit, AfterViewInit {
  value: string = '';
  isVertical: boolean = false;

  @ViewChild('renameInput') renameInput!: ElementRef<HTMLInputElement>;

  constructor(private myDocumentsService: MyDocumentsService, private folderService: FolderService, private toastService: ToastService) { }

  ngOnInit(): void {
    this.myDocumentsService.isVertical$.subscribe((type: boolean) => {
      this.isVertical = type;
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.renameInput.nativeElement.focus(), 0);
  }

  onEnter(): void {
    if (this.value.trim()) {
  
      this.folderService.addFolder({
        "name": this.value,
        "userDocumentDirectoryId": this.myDocumentsService.BreadcrumbItems.length > 0
          ? this.myDocumentsService.BreadcrumbItems[this.myDocumentsService.BreadcrumbItems.length - 1]['idFolder']
          : null
      }).subscribe(
        (data: any) => {
          const idFolder = this.myDocumentsService.BreadcrumbItems.length > 0
            ? this.myDocumentsService.BreadcrumbItems[this.myDocumentsService.BreadcrumbItems.length - 1]['idFolder'] ?? ""
            : "";

          this.myDocumentsService.loadData(idFolder);
          this.myDocumentsService.visibleCreateFolder = false;
          this.value = '';
        },
        (error) => {
          this.myDocumentsService.visibleCreateFolder = false;
          this.value = '';
          this.toastService.showError('Ошибка', 'Не удалось создать папку. Попробуйте снова.');
        }
      );
    }
  }
  
  onEsc(): void {
    this.myDocumentsService.visibleCreateFolder = false;
    this.value = '';
  }

  handleBlur(): void {
    if (this.value.trim()) {
      this.onEnter();
    } else {
      this.onEsc();
    }
  }

  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.onEnter();
    } else if (event.key === 'Escape') {
      this.onEsc();
    }
  }
}
