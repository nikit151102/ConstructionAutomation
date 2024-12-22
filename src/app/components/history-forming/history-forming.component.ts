import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { HistoryFormingService } from './history-forming.service';
import { CurrentUserService } from '../../services/current-user.service';
import { PopUpComponent } from '../pop-up/pop-up.component';
import { CommomFileService } from '../../services/file.service';
import { PersonalAccountService } from '../../pages/personal-account/personal-account.service';
import { AccordionModule } from 'primeng/accordion';
import { SkeletonModule } from 'primeng/skeleton';

interface dataDocs {
  statusCode: number,
  FileName: string,
  FileSize: string,
  documentType: number,
  InitDate: Date,
  DocumentId: string
}

@Component({
  selector: 'app-history-forming',
  standalone: true,
  imports: [CommonModule, ButtonModule, TagModule, ToastModule, ButtonModule, MenuModule, PopUpComponent, AccordionModule, SkeletonModule],
  templateUrl: './history-forming.component.html',
  styleUrl: './history-forming.component.scss'
})

export class HistoryFormingComponent implements OnInit {
  docs!: dataDocs[];
  filteredDocs: dataDocs[] = [];
  items: MenuItem[] | undefined;
  visiblePopUpPay: boolean = false;
  fileMetadata: any;
  expandedDoc: any = null;
  typeDocs = [
    { name: 'Cопоставительная ведомость', code: '1' },
    { name: 'Спецификация на метериалы', code: '2' },
    { name: 'Спецификация работ', code: '3' }
  ];
  selectedTypeDocs: any[] = [];
  dropdownOpen: boolean = false;

  get selectedDocsLabel(): string {
    return this.selectedTypeDocs.length > 0
      ? `Выбрано ${this.selectedTypeDocs.length}`
      : 'Фильтр';
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  isSelected(option: any): boolean {
    return this.selectedTypeDocs.some(doc => doc.code === option.code);
  }

  toggleSelection(option: any) {
    if (this.isSelected(option)) {
      this.selectedTypeDocs = this.selectedTypeDocs.filter(doc => doc.code !== option.code);
    } else {
      this.selectedTypeDocs.push(option);
    }
    this.filterDocsByType();
  }

  filterDocsByType(): void {
    if (this.selectedTypeDocs.length === 0) {
      this.filteredDocs = [...this.docs];
    } else {
      const selectedCodes = this.selectedTypeDocs.map((type: any) => parseInt(type.code, 10));
      this.filteredDocs = this.docs.filter(doc => selectedCodes.includes(doc.documentType));
    }
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    const clickedInside = (event.target as HTMLElement).closest('.multiselect-container');
    if (!clickedInside) {
      this.dropdownOpen = false;
    }
  }


  toggleAccordion(doc: any): void {
    this.expandedDoc = this.expandedDoc === doc ? null : doc;
  }


  fields = [
    { key: 'statusCode', label: 'Статус' },
    { key: 'FileName', label: 'Название файла' },
    { key: 'FileSize', label: 'Размер' },
    { key: 'InitDate', label: 'Дата' },
    { key: 'DocumentId', label: '' }
  ];

  currentSortField: string = '';
  isAscending: boolean = true;

  constructor(private historyFormingService: HistoryFormingService,
    private currentUserService: CurrentUserService,
    private commomFileService: CommomFileService,
    private personalAccountService: PersonalAccountService) { }

  ngOnInit() {
    const userData = this.currentUserService.getUser()

    //  this.loadData();

    this.docs = [
      {
        statusCode: 1,
        FileName: 'Document1.pdf',
        FileSize: '2.4 MB',
        documentType: 1,
        InitDate: new Date('2024-01-15'),
        DocumentId: 'DOC12345',
      },
      {
        statusCode: 0,
        FileName: 'Document2.pdf',
        FileSize: '1.1 MB',
        documentType: 3,
        InitDate: new Date('2024-02-10'),
        DocumentId: 'DOC67890',
      },
      {
        statusCode: 2,
        FileName: 'Report1.docx',
        FileSize: '3.8 MB',
        documentType: 2,
        InitDate: new Date('2024-03-05'),
        DocumentId: 'DOC11223',
      },
      {
        statusCode: 1,
        FileName: 'Presentation.pptx',
        FileSize: '4.6 MB',
        documentType: 1,
        InitDate: new Date('2024-04-22'),
        DocumentId: 'DOC44556',
      },
      {
        statusCode: 4,
        FileName: 'Notes.txt',
        FileSize: '512 KB',
        documentType: 3,
        InitDate: new Date('2024-05-12'),
        DocumentId: 'DOC77889',
      },
    ];
    this.filteredDocs = [...this.docs];
  }

  loadData() {
    // this.historyFormingService.getHistoryForming().subscribe((response: any) => {
    //   this.docs = response.data
    // })
  }



  generateActions(statusCode: number): any[] {
    if (statusCode === 0 || statusCode === 4) {
      return [];
    }

    if (statusCode === 1) {
      return [
        {
          label: 'Оплатить',
          icon: 'pi pi-credit-card',
          class: 'status-info', // изменен на status-info
          command: () => (this.visiblePopUpPay = true)
        },
        {
          label: 'Предпросмотр',
          icon: 'pi pi-eye',
          class: 'status-preview', // изменен на status-preview
          command: () => this.handlePreview()
        }
      ];
    }

    if (statusCode === 2) {
      return [
        {
          label: 'Предпросмотр',
          icon: 'pi pi-eye',
          class: 'status-preview', // изменен на status-preview
          command: () => this.handlePreview()
        },
        {
          label: 'Excel',
          icon: 'pi pi-file-excel',
          class: 'status-excel', // изменен на status-excel
          command: () => this.downloadFile('excel')
        },
        {
          label: 'PDF',
          icon: 'pi pi-file-pdf',
          class: 'status-pdf', // изменен на status-pdf
          command: () => this.downloadFile('pdf')
        }
      ];
    }

    return [];
  }


  handlePreview(): void {
    console.log('Предпросмотр открыт');
    // Реализация логики для предпросмотра
  }

  downloadFile(type: string) {
    if (type == 'excel') {
      this.commomFileService.downloadFile(this.fileMetadata.fullResultXlsx.id);
    }
    if (type == 'pdf') {
      this.commomFileService.downloadFile(this.fileMetadata.fullResultPdf.id);
    }
  }


  sortDocs(field: string) {
    if (this.currentSortField === field) {
      this.isAscending = !this.isAscending;
    } else {
      this.isAscending = true;
    }

    this.currentSortField = field;

    this.docs.sort((a, b) => {
      const valueA = a[field as keyof dataDocs];
      const valueB = b[field as keyof dataDocs];

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        if (field === 'InitDate') {
          return this.isAscending
            ? new Date(valueA).getTime() - new Date(valueB).getTime()
            : new Date(valueB).getTime() - new Date(valueA).getTime();
        }

        return this.isAscending
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      } else if (valueA instanceof Date && valueB instanceof Date) {
        return this.isAscending
          ? valueA.getTime() - valueB.getTime()
          : valueB.getTime() - valueA.getTime();
      } else if (typeof valueA === 'number' && typeof valueB === 'number') {
        return this.isAscending ? valueA - valueB : valueB - valueA;
      }

      return 0;
    });
  }


  buttons = [
    { label: 'ОК', onClick: this.onOk.bind(this) },
    { label: 'Отмена', onClick: this.onCancel.bind(this) }
  ];

  onOk(): void {
    this.visiblePopUpPay = false;
    this.personalAccountService.changeBalance('900');
  }

  onCancel(): void {
    this.visiblePopUpPay = false;
  }

  onPopupClose(): void {
    this.visiblePopUpPay = false;
  }



}