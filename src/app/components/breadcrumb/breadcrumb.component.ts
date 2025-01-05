import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { MyDocumentsService } from '../../pages/personal-account/my-documents/my-documents.service';
import { CommomFileService } from '../../services/file.service';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, BreadcrumbModule, ButtonModule],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss'
})
export class BreadcrumbComponent {

  home = {
    icon: 'pi pi-home',
    command: () => {
      this.myDocumentsService.BreadcrumbItems = [];
      this.myDocumentsService.loadData('');
    }
  };

  constructor(public myDocumentsService: MyDocumentsService,
    private commomFileService: CommomFileService) { }

  getSizeInMB(size: number) {
    return this.commomFileService.fileSizeInMB(size);
  }
}
