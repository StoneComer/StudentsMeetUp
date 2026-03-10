import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { Profile } from '../interfaces';
import { Reminder } from '../interfaces';
import {isNumber} from "chart.js/helpers";

interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  @ViewChild('searchInput') searchInput!: ElementRef;

  constructor(private router: Router, private auth: AuthService) {}

  public user: Profile = {
    id: '',
    username: '',
    email: '',
    telegramId: ''
  };

  public reminders: Reminder[] = [];
  public totalElements = 0;
  public currentPage = 0;
  public totalPages = 0;
  public itemsPerPage = 10;
  public searchTerm = '';
  public searchTitle = '';
  public date = '';
  public time = '';
  public searchDescription = '';
  public combinedSearch = ''; // для UI отображения

  // Сортировка - только допустимые поля API
  public availableSortFields = ['name', 'date', 'time'];
  public sortBy = 'date';
  public sortDirection: 'asc' | 'desc' = 'asc';

  public session_state = '';showEditModal = false;
  showDeleteModal = false;
  editingReminder: Reminder | null = null;
  deletingReminderId: number | null = null;

  // Форма редактирования
  public editForm = {
    id: '',
    title: '',
    description: '',
    remind: ''
  };
  showCreateModal = false;
  createForm = {
    title: '',
    description: '',
    remind: '' // YYYY-MM-DDTHH:MM
  };


  ngOnInit(): void {
    this.getProfile();
    this.loadReminders();
  }

  getProfile() {
    this.auth.getProfile().subscribe(
      (response: any) => {
        this.user = response;
        this.session_state = localStorage.getItem('session_state') || '';
      }
    );
  }

  loadReminders() {
    this.auth.getReminders(
      this.currentPage,
      this.itemsPerPage,
      this.searchTitle,
      this.searchDescription,
      this.sortBy,
      this.sortDirection
    ).subscribe(
      (response: any) => {
        this.reminders = response.items;
        this.totalElements = response.totalElements || response.total || 0;
        this.totalPages = Math.ceil(this.totalElements / this.itemsPerPage) || 0;
      }
    );
  }

  filterReminders() {
    this.auth.filterReminders(
      this.currentPage,
      this.itemsPerPage,
      this.date,
      this.time,
      this.sortBy,
      this.sortDirection
    ).subscribe(
      (response: any) => {
        this.reminders = response.items;
        this.totalElements = response.totalElements || response.total || 0;
        this.totalPages = Math.ceil(this.totalElements / this.itemsPerPage) || 0;
      }
    );
  }

  onSearch() {
    // Разделяем поисковый запрос на title и description
    const search = this.combinedSearch.trim();
    if (search) {
      if (search.split('.').length > 1 || isNumber(search)) {
        const parts = search.toString().split(' ', 2);
        this.date = parts[0] || '';
        this.time = parts[1] || '';
        this.currentPage = 0;
        this.filterReminders();
      } else {
        // Простое разделение: первая часть - title, вторая - description
        const parts = search.split(' ', 2);
        this.searchTitle = parts[0] || '';
        this.searchDescription = parts[1] || '';
        this.currentPage = 0;
        this.loadReminders();
      }
    } else {
      this.searchTitle = '';
      this.searchDescription = '';
      this.date = '';
      this.time = '';
    }
  }

  clearSearch() {
    this.combinedSearch = '';
    this.searchTitle = '';
    this.searchDescription = '';
    this.currentPage = 0;
    if (this.searchInput) {
      this.searchInput.nativeElement.value = '';
    }
    this.loadReminders();
  }

  onSort(column: string) {
    if (!this.availableSortFields.includes(column)) {
      return; // Блокируем сортировку по недопустимым полям
    }

    if (this.sortBy === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = column;
      this.sortDirection = 'asc';
    }
    this.currentPage = 0;
    this.loadReminders();
  }

  // Пагинация
  previousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadReminders();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadReminders();
    }
  }

  goToFirstPage() {
    if (this.currentPage !== 0) {
      this.currentPage = 0;
      this.loadReminders();
    }
  }

  goToLastPage() {
    if (this.currentPage !== this.totalPages - 1) {
      this.currentPage = this.totalPages - 1;
      this.loadReminders();
    }
  }

  onItemsPerPageChange() {
    this.currentPage = 0;
    this.loadReminders();
  }

  get recordsInfo(): string {
    const start = this.currentPage * this.itemsPerPage + 1;
    const end = Math.min((this.currentPage + 1) * this.itemsPerPage, this.totalElements);
    return `${start}–${end} из ${this.totalElements} напоминаний`;
  }

  get sortIcon(): string {
    return this.sortDirection === 'asc' ? '↑' : '↓';
  }

  openEditModal(reminder: Reminder) {
    this.editingReminder = { ...reminder };
    this.editForm = {
      id: reminder.id.toString(),
      title: reminder.title,
      description: reminder.description,
      remind: reminder.remind // Полная ISO строка
    };
    this.showEditModal = true;
  }

  openDeleteModal(reminderId: number) {
    this.deletingReminderId = reminderId;
    this.showDeleteModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.editingReminder = null;
    this.editForm = { id: '', title: '', description: '', remind: '' };
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.deletingReminderId = null;
  }

  saveReminder() {
    if (!this.editingReminder || !this.editForm.title.trim()) {
      return;
    }

    const reminderData = {
      id: parseInt(this.editForm.id),
      title: this.editForm.title.trim(),
      description: this.editForm.description || '',
      remind: new Date(this.editForm.remind).toISOString()
    };

    console.log('Сохраняем:', reminderData); // Для отладки

    this.auth.updateReminder(reminderData).subscribe({
      next: (response) => {
        console.log('Успешно обновлено:', response);
        this.loadReminders();
        this.closeEditModal();
      },
      error: (error) => {
        console.error('Ошибка обновления:', error);
        alert(`Ошибка при сохранении: ${error.error?.message || 'Неизвестная ошибка'}`);
      }
    });
  }

  onDateChange(event: any) {
    const date = event.target.value;
    if (date && this.editForm.remind) {
      const timePart = this.editForm.remind.slice(11, 16);
      this.editForm.remind = `${date}T${timePart}`;
    }
  }

  onTimeChange(event: any) {
    const time = event.target.value;
    if (time && this.editForm.remind) {
      const datePart = this.editForm.remind.slice(0, 10);
      this.editForm.remind = `${datePart}T${time}`;
    }
  }

  deleteReminder() {
    if (this.deletingReminderId === null) return;

    this.auth.deleteReminder(this.deletingReminderId).subscribe({
      next: () => {
        this.closeDeleteModal();
        this.loadReminders(); // Перезагружаем список
      },
      error: (error) => {
        console.error('Ошибка удаления:', error);
        alert('Ошибка при удалении напоминания');
      }
    });
  }

  openCreateModal() {
    this.createForm = { title: '', description: '', remind: '' };
    this.showCreateModal = true;
  }

  closeCreateModal() {
    this.showCreateModal = false;
    this.createForm = { title: '', description: '', remind: '' };
  }

  createReminder() {
    if (!this.createForm.title.trim()) {
      alert('Название обязательно');
      return;
    }

    const reminderData = {
      title: this.createForm.title.trim(),
      description: this.createForm.description || '',
      remind: new Date(this.createForm.remind).toISOString()
    };

    this.auth.createReminder(reminderData).subscribe({
      next: (response) => {
        console.log('Создано:', response);
        this.closeCreateModal();
        this.loadReminders(); // Перезагружаем список
      },
      error: (error) => {
        console.error('Ошибка создания:', error);
        alert(`Ошибка при создании: ${error.error?.message || 'Неизвестная ошибка'}`);
      }
    });
  }

  onCreateDateChange(event: any) {
    const date = event.target.value;
    if (date && this.createForm.remind) {
      const timePart = this.createForm.remind.slice(11, 16);
      this.createForm.remind = `${date}T${timePart}`;
    } else {
      this.createForm.remind = date + 'T00:00';
    }
  }

  onCreateTimeChange(event: any) {
    const time = event.target.value;
    if (time && this.createForm.remind) {
      const datePart = this.createForm.remind.slice(0, 10);
      this.createForm.remind = `${datePart}T${time}`;
    } else {
      this.createForm.remind = '2026-03-10T' + time;
    }
  }
}
