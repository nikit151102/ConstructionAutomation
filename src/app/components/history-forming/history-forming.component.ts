import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
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
import { PreviewPdfComponent } from '../preview-pdf/preview-pdf.component';
import { dataDocs } from '../../interfaces/files';


interface Button {
  label: string;
  onClick: () => void;
}

@Component({
  selector: 'app-history-forming',
  standalone: true,
  imports: [CommonModule, ButtonModule, TagModule, ToastModule, ButtonModule, MenuModule, PopUpComponent, AccordionModule, SkeletonModule, PreviewPdfComponent],
  templateUrl: './history-forming.component.html',
  styleUrl: './history-forming.component.scss'
})

export class HistoryFormingComponent implements OnInit {
  historyDocs: dataDocs[] = [];
  filteredDocs: dataDocs[] = [];
  items: MenuItem[] | undefined;
  visiblePopUpPay: boolean = false;
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

  fields = [
    { key: 'statusCode', label: 'Статус' },
    { key: 'FileName', label: 'Название файла' },
    { key: 'FileSize', label: 'Размер' },
    { key: 'InitDate', label: 'Дата' },
    { key: 'DocumentId', label: '' }
  ];

  currentSortField: string = '';
  isAscending: boolean = true;
  
  buttons: Button[] = [];

  constructor(public historyFormingService: HistoryFormingService,
    private currentUserService: CurrentUserService,
    private commomFileService: CommomFileService,
    private cdr: ChangeDetectorRef,
    private personalAccountService: PersonalAccountService) { }

  ngOnInit() {

    this.historyFormingService.historyDocsState$.subscribe((value: any) => {
      this.historyDocs = value
      this.filterDocsByType();
      this.cdr.detectChanges();
    })

    this.loadData();

    this.filteredDocs = [...this.historyDocs];
  }


  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    const clickedInside = (event.target as HTMLElement).closest('.multiselect-container');
    if (!clickedInside) {
      this.dropdownOpen = false;
    }
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
    if (!Array.isArray(this.historyDocs)) {
      this.filteredDocs = [];
      return;
    }

    if (this.selectedTypeDocs.length === 0) {
      this.filteredDocs = [...this.historyDocs];
    } else {
      const selectedCodes = this.selectedTypeDocs.map((type: any) => parseInt(type.code, 10));
      this.filteredDocs = this.historyDocs.filter(doc => selectedCodes.includes(doc.documentType));
    }
  }

  toggleAccordion(doc: any): void {
    this.expandedDoc = this.expandedDoc === doc ? null : doc;
  }

  loadData() {
    this.historyFormingService.getHistoryForming().subscribe((response: any) => {
      this.historyFormingService.loadHistoryDocs(response.data)
    })
  }

  generateActions(dataDoc: any, statusCode: number): any[] {
    if (statusCode === 0 || statusCode === 4) {
      return [];
    }

    if (statusCode === 1) {
      return [
        {
          label: 'Оплатить',
          icon: 'pi pi-credit-card',
          class: 'status-info',
          command: () => {this.visiblePopUpPay = true;
            this.buttons = [
              { label: 'ОК', onClick: () => this.onOk(dataDoc.id) },
              { label: 'Отмена', onClick: this.onCancel.bind(this) }
            ];
          }
        },
        {
          label: 'Предпросмотр',
          icon: 'pi pi-eye',
          class: 'status-preview',
          command: () => this.handlePreview(dataDoc.documentPdfShortId)
        }
      ];
    }

    if (statusCode === 2) {
      return [
        {
          label: 'Предпросмотр',
          icon: 'pi pi-eye',
          class: 'status-preview',
          command: () => this.handlePreview(dataDoc.documentPdfShortId)
        },
        {
          label: 'Excel',
          icon: 'pi pi-file-excel',
          class: 'status-excel',
          command: () => this.downloadFile('excel', dataDoc.documentXlsxId)
        },
        {
          label: 'PDF',
          icon: 'pi pi-file-pdf',
          class: 'status-pdf',
          command: () => this.downloadFile('pdf', dataDoc.documentPdfId)
        }
      ];
    }

    return [];
  }

  getSizeInMB(size: number) {
    return this.commomFileService.fileSizeInMB(size);
  }

  pdfBlob!: Blob;
  handlePreview(fileId: string): void {
    this.commomFileService.previewfile(fileId).subscribe(
      (blob: Blob) => {
        if (blob) {
          this.pdfBlob = blob;
          this.historyFormingService.updateSelectExcelId('');
          this.historyFormingService.updateSelectPdfId('');
          this.historyFormingService.visiblePdf = true;
        }
      },
      (error: any) => {
        console.error('Ошибка при получении файла для предварительного просмотра:', error);
        // this.toastService.showError('Ошибка!', 'Не удалось загрузить файл для предварительного просмотра');
      }
    );
  }

  downloadFile(type: string, fileId: string) {
    if (type == 'excel') {
      this.commomFileService.downloadFile(fileId);
    }
    if (type == 'pdf') {
      this.commomFileService.downloadFile(fileId);
    }
  }

  sortDocs(field: string) {
    if (this.currentSortField === field) {
      this.isAscending = !this.isAscending;
    } else {
      this.isAscending = true;
    }

    this.currentSortField = field;

    this.historyDocs.sort((a, b) => {
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



  onOk(id: string): void {
    this.visiblePopUpPay = false;
    this.historyFormingService.makeTransaction(id).subscribe((response: any) => {
      this.pdfBlob = this.commomFileService.createBlobFromData(response.file)
      this.visiblePopUpPay = false;
      this.personalAccountService.changeBalance(response.balance);
      this.historyFormingService.updateSelectExcelId(response.resultXlsxId);
      this.historyFormingService.updateSelectPdfId(response.resultPdfId);
      this.historyFormingService.visiblePdf = true;
    })
  }

  onCancel(): void {
    this.visiblePopUpPay = false;
  }

  onPopupClose(): void {
    this.visiblePopUpPay = false;
  }

  closePopup(): void {
    this.historyFormingService.visiblePdf = false;
  }


}