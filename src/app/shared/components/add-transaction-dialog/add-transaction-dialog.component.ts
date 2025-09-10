import { Component, Inject, OnInit, AfterViewInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';

import { BaseDialogComponent } from '../base-dialog/base-dialog.component';
import { FormInputComponent } from '../form-input/form-input.component';

import { StorageService } from '../../../core/services/storage.service';
import { UtilsService } from '../../../core/services/utils.service';
import { Transaction } from '../../../core/models/transaction.model';
import { Category } from '../../../core/models/category.model';

export interface AddTransactionDialogData {
  transaction?: Transaction;
  isEdit?: boolean;
  compactMode?: boolean;
}

@Component({
  selector: 'app-add-transaction-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDividerModule,
    MatTooltipModule,
    BaseDialogComponent,
    FormInputComponent
  ],
  templateUrl: './add-transaction-dialog.component.html',
  styleUrl: './add-transaction-dialog.component.scss'
})
export class AddTransactionDialogComponent implements OnInit, AfterViewInit {
  private fb = inject(FormBuilder);
  private storageService = inject(StorageService);
  private utilsService = inject(UtilsService);
  private snackBar = inject(MatSnackBar);
  private cdr = inject(ChangeDetectorRef);

  // Formulário
  transactionForm!: FormGroup;
  
  // Dados
  categories: Category[] = [];
  categoryOptions: Array<{label: string, value: string}> = [];
  isEdit = false;
  compactMode = false;
  
  // Estados
  loading = false;
  expanded = false;

  constructor(
    public dialogRef: MatDialogRef<AddTransactionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddTransactionDialogData
  ) {
    this.isEdit = data?.isEdit || false;
    this.compactMode = data?.compactMode || false;
  }

  ngOnInit() {
    this.loadCategories();
    this.initializeForm();
    
    if (this.isEdit && this.data.transaction) {
      this.populateForm(this.data.transaction);
    }
  }

  ngAfterViewInit() {
    // Força o reset do formulário em modo compacto para garantir estado limpo
    if (this.compactMode && !this.isEdit) {
      setTimeout(() => {
        this.resetForm();
        // Força a detecção de mudanças após reset
        if (this.cdr) {
          this.cdr.detectChanges();
        }
      }, 50); // Reduzido para 50ms
    }
  }

  initializeForm() {
    const today = new Date().toISOString().split('T')[0];
    
    this.transactionForm = this.fb.group({
      transactionType: ['expense', Validators.required], // 'expense' ou 'income'
      description: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      amount: [0, [Validators.required, Validators.min(0.01)]],
      category: ['', Validators.required],
      date: [today, Validators.required],
      isCreditCard: [false]
    });
  }

  populateForm(transaction: Transaction) {
    this.transactionForm.patchValue({
      transactionType: transaction.amount > 0 ? 'income' : 'expense',
      description: transaction.description,
      amount: Math.abs(transaction.amount), // Sempre positivo no formulário
      category: transaction.category,
      date: transaction.date,
      isCreditCard: transaction.isCreditCard
    });
  }

  loadCategories() {
    this.categories = this.storageService.getCategories();
    
    // Se não há categorias, adiciona uma padrão
    if (this.categories.length === 0) {
      this.categories = [
        { id: this.utilsService.generateId(), name: 'Geral', color: '#2196F3' }
      ];
    }
    
    // Atualiza as opções para o select
    this.categoryOptions = this.categories.map(category => ({
      label: category.name,
      value: category.name
    }));
  }

  resetForm() {
    const today = new Date().toISOString().split('T')[0];
    
    // Reset completo do formulário
    this.transactionForm.reset();
    
    // Define valores padrão
    this.transactionForm.patchValue({
      transactionType: 'expense',
      description: '',
      amount: 0,
      category: '',
      date: today,
      isCreditCard: false
    });
    
    // Reset de todos os estados
    this.transactionForm.markAsUntouched();
    this.transactionForm.markAsPristine();
    this.transactionForm.updateValueAndValidity();
    this.expanded = false;
    this.loading = false;
    
    // Força detecção de mudanças
    this.cdr.markForCheck();
    this.cdr.detectChanges();
  }

  toggleExpanded() {
    this.expanded = !this.expanded;
  }

  onCategorySelect(category: Category) {
    this.transactionForm.patchValue({ category: category.name });
  }

  onAmountChange(event: any) {
    const value = event.target.value;
    if (value < 0) {
      this.transactionForm.patchValue({ amount: Math.abs(value) });
    }
  }

  onSave() {
    if (this.transactionForm.valid) {
      this.loading = true;
      
      try {
        const formValue = this.transactionForm.value;
        
        // Aplica sinal baseado no tipo: receitas positivas, gastos negativos
        const amount = formValue.transactionType === 'income' 
          ? Math.abs(formValue.amount)  // Receitas são positivas
          : Math.abs(formValue.amount) * -1;  // Gastos são negativos
        
        const transaction: Transaction = {
          id: this.isEdit && this.data.transaction ? this.data.transaction.id : this.utilsService.generateId(),
          description: formValue.description.trim(),
          amount: amount,
          category: formValue.category,
          date: formValue.date,
          isCreditCard: formValue.isCreditCard,
          createdAt: this.isEdit && this.data.transaction ? this.data.transaction.createdAt : new Date()
        };

        if (this.isEdit) {
          this.storageService.updateTransaction(transaction.id, transaction);
          this.snackBar.open('Transação atualizada com sucesso!', 'Fechar', { duration: 3000 });
        } else {
          this.storageService.addTransaction(transaction);
          this.snackBar.open('Transação adicionada com sucesso!', 'Fechar', { duration: 3000 });
        }

        // Pequeno delay antes de fechar para garantir que o storage foi atualizado
        setTimeout(() => {
          this.dialogRef.close(transaction);
        }, 10);
        
      } catch (error) {
        console.error('Erro ao salvar transação:', error);
        this.snackBar.open('Erro ao salvar transação', 'Fechar', { duration: 3000 });
        this.loading = false; // Reset loading em caso de erro
      } finally {
        // Garante que loading seja resetado
        setTimeout(() => {
          this.loading = false;
          this.cdr.detectChanges();
        }, 100);
      }
    } else {
      this.markFormGroupTouched();
      this.snackBar.open('Por favor, preencha todos os campos obrigatórios', 'Fechar', { duration: 3000 });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  markFormGroupTouched() {
    Object.keys(this.transactionForm.controls).forEach(key => {
      const control = this.transactionForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.transactionForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${this.getFieldLabel(fieldName)} é obrigatório`;
      if (field.errors['minlength']) return `${this.getFieldLabel(fieldName)} deve ter pelo menos ${field.errors['minlength'].requiredLength} caracteres`;
      if (field.errors['maxlength']) return `${this.getFieldLabel(fieldName)} deve ter no máximo ${field.errors['maxlength'].requiredLength} caracteres`;
      if (field.errors['min']) return `${this.getFieldLabel(fieldName)} deve ser maior que zero`;
    }
    return '';
  }

  getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      description: 'Descrição',
      amount: 'Valor',
      category: 'Categoria',
      date: 'Data'
    };
    return labels[fieldName] || fieldName;
  }

  formatCurrency(value: number): string {
    return this.utilsService.formatCurrency(value);
  }

  getCategoryColor(categoryName: string): string {
    const category = this.categories.find(c => c.name === categoryName);
    return category?.color || '#000000';
  }

  getCategoryOptions(): Array<{label: string, value: string}> {
    return this.categories.map(category => ({
      label: category.name,
      value: category.name
    }));
  }

  get isFormValid(): boolean {
    return this.transactionForm ? this.transactionForm.valid : false;
  }

  get isButtonDisabled(): boolean {
    return !this.isFormValid || this.loading;
  }
}