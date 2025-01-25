import { Component, OnInit } from '@angular/core';
import { tableConfig } from './conf';
import { ReferenceBookService } from './reference-book.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-reference-book',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './reference-book.component.html',
  styleUrls: ['./reference-book.component.scss']
})
export class ReferenceBookComponent implements OnInit {
  data: any[] = []; // Данные для таблицы
  columns = tableConfig.tableColumns; // Настройки столбцов из конфигурации
  pageTitle = tableConfig.pageTitle; // Название страницы
  errorMessage = ''; // Сообщение об ошибке
  isModalOpen = false; // Флаг модального окна
  modalTitle = 'Создать запись'; // Заголовок модального окна
  modalAction = 'Создать'; // Действие в модальном окне
  modalData: any = {}; // Данные для модального окна

  constructor(private referenceBookService: ReferenceBookService) {
    this.referenceBookService.endpoint = tableConfig.endpoint; // Устанавливаем эндпоинт
  }

  ngOnInit(): void {
    this.loadData();
  }

  // Загрузка данных
  loadData(): void {
    this.errorMessage = '';

    this.referenceBookService.getRecords().subscribe(
      (response) => {
        this.data = response;
      },
      (error) => {
        this.errorMessage = 'Ошибка при загрузке данных. Попробуйте позже.';
        console.error('Ошибка при загрузке данных:', error);
      }
    );
  }

  // Открытие модального окна для создания записи
  openCreateModal(): void {
    this.modalTitle = 'Создать запись';
    this.modalAction = 'Создать';
    this.modalData = { name: '', type: '', createdAt: '' };
    this.isModalOpen = true;
  }

  // Открытие модального окна для редактирования записи
  openEditModal(item: any): void {
    this.modalTitle = 'Редактировать запись';
    this.modalAction = 'Обновить';
    this.modalData = { ...item }; // Копируем данные записи для редактирования
    this.isModalOpen = true;
  }

  // Закрытие модального окна
  closeModal(): void {
    this.isModalOpen = false;
  }

  // Отправка формы (создание/редактирование)
  onSubmit(): void {
    if (this.modalAction === 'Создать') {
      this.createRecord(this.modalData);
    } else {
      this.updateRecord(this.modalData.id, this.modalData);
    }
    this.closeModal();
  }

  // Создание новой записи
  createRecord(newRecord: any): void {
    this.referenceBookService.newRecord(newRecord).subscribe(
      (response) => {
        this.data.push(response); // Добавляем новую запись в таблицу
      },
      (error) => {
        console.error('Ошибка при создании записи:', error);
      }
    );
  }

  // Обновление записи
  updateRecord(id: number, updatedRecord: any): void {
    this.referenceBookService.updateRecord(id, updatedRecord).subscribe(
      (response) => {
        const index = this.data.findIndex((item) => item.id === id);
        if (index !== -1) {
          this.data[index] = response; // Обновляем запись в таблице
        }
      },
      (error) => {
        console.error('Ошибка при обновлении записи:', error);
      }
    );
  }

  // Удаление записи
  deleteRecord(id: number): void {
    if (confirm('Вы уверены, что хотите удалить эту запись?')) {
      this.referenceBookService.deleteRecord(id).subscribe(
        () => {
          this.data = this.data.filter((item) => item.id !== id); // Удаляем запись из таблицы
        },
        (error) => {
          console.error('Ошибка при удалении записи:', error);
        }
      );
    }
  }
}
