import { Component, OnInit, inject, Input, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar } from '@angular/material/snack-bar';
// import * as flatpickr from 'flatpickr';

import { CustomModalRef } from '../../../../shared/components/custom-modal/custom-modal.service';
import { StorageService } from '../../../../core/services/storage.service';
import { UtilsService } from '../../../../core/services/utils.service';
import { Transaction } from '../../../../core/models/transaction.model';
import { Category } from '../../../../core/models/category.model';

export interface TransactionModalData {
  compactMode?: boolean;
  isEdit?: boolean;
  transaction?: Transaction;
}

@Component({
  selector: 'app-transaction-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule
  ],
  templateUrl: './transaction-modal.component.html',
  styleUrl: './transaction-modal.component.scss'
})
export class TransactionModalComponent implements OnInit, AfterViewInit, OnDestroy {
  private fb = inject(FormBuilder);
  private storageService = inject(StorageService);
  private utilsService = inject(UtilsService);
  private snackBar = inject(MatSnackBar);

  @Input() data!: TransactionModalData;
  @Input() modalRef!: CustomModalRef;
  @ViewChild('flatpickrInput') flatpickrInput!: ElementRef<HTMLInputElement>;

  transactionForm!: FormGroup;
  categories: Category[] = [];
  categoryOptions: Array<{label: string, value: string}> = [];
  isEdit = false;
  compactMode = false;
  loading = false;
  
  // Custom datepicker properties
  isDatePickerOpen = false;
  currentDate = new Date();
  currentYear = this.currentDate.getFullYear();
  currentMonth = this.currentDate.getMonth();
  selectedDate: Date | null = null;
  
  weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  
  get currentMonthName() {
    return this.months[this.currentMonth];
  }
  
  get calendarDays() {
    const days = [];
    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const today = new Date();
    const isToday = (day: number) => 
      day === today.getDate() && 
      this.currentMonth === today.getMonth() && 
      this.currentYear === today.getFullYear();
    
    const isSelected = (day: number) => {
      if (!this.selectedDate) return false;
      
      const selectedDay = this.selectedDate.getDate();
      const selectedMonth = this.selectedDate.getMonth();
      const selectedYear = this.selectedDate.getFullYear();
      
      return day === selectedDay && 
             this.currentMonth === selectedMonth && 
             this.currentYear === selectedYear;
    };
    
    // Mostrar apenas 35 dias (5 semanas) para reduzir dias de outros meses
    for (let i = 0; i < 35; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      days.push({
        day: date.getDate(),
        date: new Date(date),
        isCurrentMonth: date.getMonth() === this.currentMonth,
        isToday: isToday(date.getDate()),
        isSelected: isSelected(date.getDate())
      });
    }
    
    return days;
  }

  ngOnInit() {
    this.isEdit = this.data?.isEdit || false;
    this.compactMode = this.data?.compactMode || false;
    
    this.loadCategories();
    this.initializeForm();
  }

  loadCategories() {
    this.categories = this.storageService.getCategories();
    this.categoryOptions = this.categories.map(cat => ({
      label: cat.name,
      value: cat.name  // Usar o nome da categoria como valor
    }));
  }

  initializeForm() {
    // Formatar data atual para DD/MM
    this.transactionForm = this.fb.group({
      transactionType: ['expense', Validators.required],
      description: ['', [Validators.required, Validators.minLength(2)]],
      amount: [0, [Validators.required, Validators.min(0.01)]],
      category: ['', Validators.required],
      date: ['', Validators.required],
      isCreditCard: [false]
    });

    // Se for edição, preencher dados
    if (this.isEdit && this.data.transaction) {
      const transaction = this.data.transaction;
      const transactionDate = new Date(transaction.date);
      const displayDate = this.formatDateForDisplay(transactionDate);
      
      this.transactionForm.patchValue({
        transactionType: transaction.amount >= 0 ? 'income' : 'expense',
        description: transaction.description,
        amount: Math.abs(transaction.amount),
        category: transaction.category,
        date: displayDate,
        isCreditCard: transaction.isCreditCard || false
      });
    }
  }

  onSave(event?: Event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    if (this.transactionForm.valid) {
      this.loading = true;
      
      try {
        const formValue = this.transactionForm.value;
        
        const amount = formValue.transactionType === 'income' 
          ? Math.abs(formValue.amount)
          : Math.abs(formValue.amount) * -1;
        
        // Converter data do formato DD/MM para string no formato esperado
        const [day, month] = formValue.date.split('/');
        const currentYear = new Date().getFullYear();
        const dateString = `${currentYear}-${month}-${day}`;
        
        const transaction: Transaction = {
          id: this.isEdit && this.data.transaction ? this.data.transaction.id : this.utilsService.generateId(),
          description: formValue.description.trim(),
          amount: amount,
          category: formValue.category,
          date: dateString,
          isCreditCard: formValue.isCreditCard || false,
          createdAt: this.isEdit && this.data.transaction ? this.data.transaction.createdAt : new Date()
        };

        if (this.isEdit) {
          this.storageService.updateTransaction(transaction.id, transaction);
          this.snackBar.open('Transação atualizada com sucesso!', 'Fechar', { duration: 3000 });
        } else {
          this.storageService.addTransaction(transaction);
          this.snackBar.open('Transação adicionada com sucesso!', 'Fechar', { duration: 3000 });
        }

        setTimeout(() => {
          this.modalRef.close(transaction);
        }, 10);
        
      } catch (error) {
        console.error('Erro ao salvar transação:', error);
        this.snackBar.open('Erro ao salvar transação', 'Fechar', { duration: 3000 });
        this.loading = false;
      }
    }
  }

  onCancel() {
    this.modalRef.close();
  }

  ngAfterViewInit() {
    this.initializeDateInput();
    
    // Event listener simples para fechar datepicker ao clicar fora
    document.addEventListener('click', (event) => {
      if (this.isDatePickerOpen) {
        const target = event.target as HTMLElement;
        const datepicker = document.querySelector('.datepicker');
        const dateInput = document.querySelector('.date-input');
        const dateBtn = document.querySelector('.date-btn');
        
        if (datepicker && !datepicker.contains(target) && 
            !dateInput?.contains(target) && 
            !dateBtn?.contains(target)) {
          this.isDatePickerOpen = false;
        }
      }
    });
  }

  ngOnDestroy() {
    // Limpar event listeners se necessário
  }

  // Métodos para o datepicker customizado
  formatDateForDisplay(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${day}/${month}`;
  }

  private initializeDateInput() {
    if (this.flatpickrInput) {
      // Adicionar event listener para máscara DD/MM
      this.flatpickrInput.nativeElement.addEventListener('input', (event: any) => {
        this.onDateInputChange(event);
      });
    }
  }

  // Métodos do datepicker customizado - SIMPLIFICADO
  toggleDatePicker() {
    this.isDatePickerOpen = !this.isDatePickerOpen;
    
    // Se estiver abrindo, configurar event listener para primeiro clique
    if (this.isDatePickerOpen) {
      setTimeout(() => {
        this.setupDatePickerClickHandler();
      }, 50);
    }
  }

  private setupDatePickerClickHandler() {
    const datepicker = document.querySelector('.datepicker');
    if (datepicker) {
      // Remover listener anterior se existir
      datepicker.removeEventListener('click', this.handleDatePickerClick);
      // Adicionar novo listener
      datepicker.addEventListener('click', this.handleDatePickerClick);
    }
  }

  private handleDatePickerClick = (event: Event) => {
    const target = event.target as HTMLElement;
    
    // Se clicou em um dia, selecionar imediatamente
    if (target.classList.contains('day')) {
      const dayNumber = parseInt(target.textContent || '0');
      if (dayNumber > 0) {
        // Encontrar o objeto day correspondente
        const days = this.calendarDays;
        const day = days.find(d => d.day === dayNumber);
        if (day) {
          this.selectDate(day);
        }
      }
    }
  }

  closeDatePicker() {
    this.isDatePickerOpen = false;
  }

  previousMonth() {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
  }

  nextMonth() {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
  }

  selectDate(day: any) {
    // Selecionar a data e fechar imediatamente
    this.selectedDate = day.date;
    const formattedDate = this.formatDateForDisplay(day.date);
    
    // Atualizar o form
    this.transactionForm.patchValue({ date: formattedDate });
    
    // Atualizar o input visual
    if (this.flatpickrInput) {
      this.flatpickrInput.nativeElement.value = formattedDate;
    }
    
    // Fechar o datepicker imediatamente
    this.isDatePickerOpen = false;
  }

  selectToday() {
    const today = new Date();
    this.selectedDate = today;
    const formattedDate = this.formatDateForDisplay(today);
    this.transactionForm.patchValue({ date: formattedDate });
    this.flatpickrInput.nativeElement.value = formattedDate;
    this.isDatePickerOpen = false;
  }

  clearDate() {
    this.selectedDate = null;
    this.transactionForm.patchValue({ date: '' });
    this.flatpickrInput.nativeElement.value = '';
    this.isDatePickerOpen = false;
  }

  onDateInputChange(event: any) {
    const value = event.target.value;
    
    // Aplicar máscara DD/MM
    let maskedValue = value.replace(/\D/g, ''); // Remove tudo que não é dígito
    
    if (maskedValue.length >= 2) {
      maskedValue = maskedValue.substring(0, 2) + '/' + maskedValue.substring(2, 4);
    }
    
    // Atualizar o input
    event.target.value = maskedValue;
    
    // Atualizar o form
    this.transactionForm.patchValue({ date: maskedValue });
  }
}
