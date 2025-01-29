import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { referenceConfig } from './conf';
import { ReferenceBookService } from './reference-book.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-reference-book',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './reference-book.component.html',
  styleUrls: ['./reference-book.component.scss']
})
export class ReferenceBookComponent implements OnInit {
  currentConfig: any;
  data: any[] = []; // Данные для таблицы
  formFields: any; // Поля для создания и редактирования
  isModalOpen = false; // Флаг модального окна
  modalTitle = 'Создать запись'; // Заголовок модального окна
  modalAction = 'Создать'; // Действие в модальном окне
  modalData: any = {}; // Данные для модального окна

  constructor(
    private route: ActivatedRoute,
    private referenceBookService: ReferenceBookService,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const typeId = params.get('typeId');
      this.currentConfig = referenceConfig.find(config => config.typeId === typeId);

      if (this.currentConfig) {
        this.formFields = this.currentConfig.formFields;
      } else {
        console.error('Не найден объект с указанным typeId');
        this.toastService.showError('Ошибка', 'Не найден объект с указанным typeId');
      }
      this.loadData();
    });
  }

  // Загрузка данных
  loadData(): void {
    this.referenceBookService.getRecords(this.currentConfig.endpoint).subscribe(
      (response: any) => {
        if (response && response.data && Array.isArray(response.data)) {
          this.data = response.data;
          this.cdr.detectChanges();
        } else {
          console.error('Ошибка: данные не найдены в ответе.');
          this.toastService.showError('Ошибка', 'Данные не найдены в ответе.');
        }
      },
      (error) => {
        console.error('Ошибка при загрузке данных:', error);
        this.toastService.showError('Ошибка', 'Ошибка при загрузке данных');
      }
    );
  }

  // Открытие модального окна для создания записи
  openCreateModal(currentEndpoint: string): void {
    if (this.currentConfig.connectionReference) this.loadConnectionReferenceData()
    this.modalTitle = 'Создать запись';
    this.modalAction = 'Создать';
    this.modalData = {};
    this.currentConfig = referenceConfig.find(config => config.endpoint === currentEndpoint);
    if (this.currentConfig) {
      this.formFields = this.currentConfig.formFields;
    }
    this.isModalOpen = true;
  }

  // Открытие модального окна для редактирования записи
  openEditModal(currentEndpoint: string, item: any): void {
    if (this.currentConfig.connectionReference) {
      // Загружаем данные для связи, если они есть
      this.loadConnectionReferenceData().then(() => {
        const field = this.currentConfig.connectionReference.field;
        const positionField = this.currentConfig.connectionReference.fieldName;

        // Устанавливаем модальные данные, включая связанные поля
        this.modalData = { ...item, [field]: item[positionField]?.id };

        // Устанавливаем выбранный элемент, используя данные из записи
        const selectedItem = this.connectionReferenceData.find(referenceItem => referenceItem.id === item[positionField]?.id);
        this.selectedReference = selectedItem || null;

        this.modalTitle = 'Редактировать запись';
        this.modalAction = 'Обновить';
        this.isModalOpen = true;
      });
    } else {
      this.modalData = { ...item };
      this.modalTitle = 'Редактировать запись';
      this.modalAction = 'Обновить';
      this.isModalOpen = true;
    }
  }



  // Закрытие модального окна
  closeModal(): void {
    this.isModalOpen = false;
  }

  // Отправка формы (создание/редактирование)
  onSubmit(endpoint: string): void {
    if (this.modalAction === 'Создать') {
      const creatorId = localStorage.getItem('VXNlcklk');

      if (creatorId) {
        Object.assign(this.modalData, { creatorId });
      } else {
        this.toastService.showError('Ошибка', 'Не найден creatorId');
        return;
      }
      if (this.currentConfig.connectionReference) {
        const relatedField = this.currentConfig.connectionReference.field;

        if (!this.modalData[relatedField]) {
          this.toastService.showError('Ошибка', `Не выбрана ${this.currentConfig.connectionReference.label}`);
          return;
        }
      }

      this.createRecord(endpoint, this.modalData);
    } else {
      const allowedFields = this.formFields.map((field: any) => field.field);
      const idRecord = this.modalData.id;

      for (const key in this.modalData) {
        if (this.modalData.hasOwnProperty(key)) {
          if (!allowedFields.includes(key) && key !== this.currentConfig.connectionReference?.field) {
            delete this.modalData[key];
          }
        }
      }
      Object.assign(this.modalData, { id: idRecord });


      if (this.currentConfig.connectionReference) {
        const relatedField = this.currentConfig.connectionReference.field;
        if (!this.modalData[relatedField]) {
          this.toastService.showError('Ошибка', `Не выбран элемент для поля ${relatedField}`);
          return;
        }
      }

      this.updateRecord(endpoint, idRecord, this.modalData);

    }

    this.closeModal();
  }


  // Создание новой записи
  createRecord(currentEndpoint: string, newRecord: any): void {
    this.referenceBookService.newRecord(currentEndpoint, newRecord).subscribe(
      (response) => {
        this.data.push(response.data);
        this.toastService.showSuccess('Успех', 'Запись успешно создана');
      },
      (error) => {
        console.error('Ошибка при создании записи:', error);
        this.toastService.showError('Ошибка', 'Ошибка при создании записи');
      }
    );
  }

  // Обновление записи
  updateRecord(currentEndpoint: string, id: number, updatedRecord: any): void {
    this.referenceBookService.updateRecord(currentEndpoint, id, updatedRecord).subscribe(
      (response) => {
        const index = this.data.findIndex((item) => item.id === id);
        if (index !== -1) {
          this.data[index] = response.data;
          this.toastService.showSuccess('Успех', 'Запись успешно обновлена');
        }
      },
      (error) => {
        console.error('Ошибка при обновлении записи:', error);
        this.toastService.showError('Ошибка', 'Ошибка при обновлении записи');
      }
    );
  }

  // Удаление записи
  deleteRecord(currentEndpoint: string, id: number): void {
    this.referenceBookService.deleteRecord(currentEndpoint, id).subscribe(
      () => {
        this.data = this.data.filter((item) => item.id !== id);
        this.toastService.showSuccess('Успех', 'Запись успешно удалена');
      },
      (error) => {
        console.error('Ошибка при удалении записи:', error);
        this.toastService.showError('Ошибка', 'Ошибка при удалении записи');
      }
    );
  }

  getNestedValue(item: any, field: string): any {
    const fields = field.split('.');
    return fields.reduce((acc, key) => acc && acc[key], item);
  }



  connectionReferenceData: any[] = []; // Данные для связи
  connectionReferenceColumns: any[] = []; // Столбцы для отображения связи

  // Загрузка данных для связи (например, должности для сотрудников)
  loadConnectionReferenceData(): Promise<void> {
    return new Promise((resolve, reject) => {
      const connectionConfig = referenceConfig.find(
        (config) => config.typeId === this.currentConfig.connectionReference.typeId
      );
      if (connectionConfig) {
        this.referenceBookService.getRecords(connectionConfig.endpoint).subscribe(
          (response: any) => {
            if (response && response.data) {
              this.connectionReferenceData = response.data;
              this.connectionReferenceColumns = connectionConfig.tableColumns;
              resolve();
            } else {
              reject('Данные не найдены');
            }
          },
          (error) => {
            console.error('Ошибка при загрузке данных для связи:', error);
            reject(error);
          }
        );
      } else {
        reject('Конфигурация для связи не найдена');
      }
    });
  }

  // Текущий выбранный элемент
  selectedReference: any;
  dropdownVisible: boolean = false;

  // При клике на поле ввода отображаем или скрываем список
  toggleDropdown(): void {
    this.dropdownVisible = !this.dropdownVisible;
  }

  // Выбор элемента
  selectReference(item: any): void {
    const field = this.currentConfig.connectionReference.field;
    this.modalData[field] = item.id;
    this.selectedReference = item; 
    this.dropdownVisible = false; 
  }

  // Получение значения для отображения выбранного элемента
  getSelectedDisplayValue(): string {
    if (this.selectedReference) {
      return this.connectionReferenceColumns.map(column => {
        return this.getNestedValue(this.selectedReference, column.field);
      }).join(' - ');
    }
    return 'Не выбрано';
  }

}
