import { Component, OnInit, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { FormInputComponent } from '../form-input/form-input.component';
import { CustomModalRef } from '../custom-modal/custom-modal.service';
import { StorageService } from '../../../core/services/storage.service';
import { UtilsService } from '../../../core/services/utils.service';
import { Transaction } from '../../../core/models/transaction.model';
import { Category } from '../../../core/models/category.model';

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
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormInputComponent
  ],
  template: `
    <div class="transaction-modal">
      <!-- Header -->
      <div class="modal-header">
        <div class="header-content">
          <mat-icon class="header-icon">account_balance_wallet</mat-icon>
          <div class="header-text">
            <h2 class="modal-title">{{ isEdit ? 'Editar Transação' : 'Adicionar Gasto' }}</h2>
            <p class="modal-subtitle">{{ compactMode ? 'Adicione rapidamente um novo gasto' : 'Preencha as informações da transação' }}</p>
          </div>
        </div>
        <button type="button" class="close-button" (click)="onCancel()">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <!-- Form -->
      <form [formGroup]="transactionForm" (ngSubmit)="onSave()" class="transaction-form">
        
        <!-- Seletor de Tipo -->
        <div class="transaction-type-selector">
          <div class="type-toggle-container">
            <button type="button" 
                    class="type-button expense-button"
                    [class.active]="transactionForm.get('transactionType')?.value === 'expense'"
                    (click)="transactionForm.patchValue({transactionType: 'expense'})">
              <mat-icon>trending_down</mat-icon>
              <span>Gasto</span>
            </button>
            
            <button type="button" 
                    class="type-button income-button"
                    [class.active]="transactionForm.get('transactionType')?.value === 'income'"
                    (click)="transactionForm.patchValue({transactionType: 'income'})">
              <mat-icon>trending_up</mat-icon>
              <span>Receita</span>
            </button>
          </div>
        </div>

        <!-- Campos principais -->
        <div class="form-row">
          <app-form-input
            label="O que foi?"
            type="text"
            placeholder="Descreva a transação"
            [formControlName]="'description'"
            class="description-field">
          </app-form-input>
        </div>

        <div class="form-row">
          <app-form-input
            label="R$ Valor"
            type="number"
            placeholder="0,00"
            prefix="R$"
            [formControlName]="'amount'"
            class="amount-field">
          </app-form-input>
          
          <app-form-input
            label="Categoria"
            type="select"
            placeholder="Selecione uma categoria"
            [options]="categoryOptions"
            [formControlName]="'category'"
            class="category-field">
          </app-form-input>
        </div>

        <div class="form-row">
          <app-form-input
            label="Data"
            type="date"
            [formControlName]="'date'"
            class="date-field">
          </app-form-input>
        </div>

        <!-- Cartão de Crédito -->
        <div class="form-row">
          <div class="credit-card-option">
            <mat-checkbox [formControlName]="'isCreditCard'" class="credit-card-checkbox">
              <mat-icon>credit_card</mat-icon>
              <span>Gasto no cartão de crédito</span>
            </mat-checkbox>
          </div>
        </div>

      </form>

      <!-- Actions -->
      <div class="modal-actions">
        <button type="button" class="cancel-button" (click)="onCancel()">
          Cancelar
        </button>
        <button type="button" 
                class="confirm-button" 
                [disabled]="!transactionForm.valid || loading"
                (click)="onSave()">
          <mat-icon *ngIf="!loading">{{ isEdit ? 'save' : 'add' }}</mat-icon>
          {{ loading ? 'Salvando...' : (isEdit ? 'Atualizar' : 'Adicionar') }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .transaction-modal {
      color: white;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 32px 32px 20px 32px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(255, 255, 255, 0.05);
    }

    .header-content {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      flex: 1;
    }

    .header-icon {
      margin-top: 2px;
      color: #60a5fa;
      font-size: 1.8rem;
      width: 1.8rem;
      height: 1.8rem;
    }

    .modal-title {
      margin: 0;
      font-size: 22px;
      font-weight: 600;
      line-height: 1.2;
      color: white;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }

    .modal-subtitle {
      margin: 4px 0 0 0;
      color: rgba(255, 255, 255, 0.8);
      font-size: 14px;
      line-height: 1.4;
    }

    .close-button {
      background: none;
      border: none;
      color: rgba(255, 255, 255, 0.7);
      border-radius: 20px;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
      
      &:hover {
        background-color: rgba(255, 255, 255, 0.1);
        color: white;
        transform: scale(1.1);
      }
    }

    .transaction-form {
      padding: 32px;
      background: transparent;
      color: white;
    }

    .form-row {
      display: flex;
      gap: 16px;
      margin-bottom: 20px;
      
      @media (max-width: 768px) {
        flex-direction: column;
        gap: 12px;
      }
    }

    .description-field {
      flex: 1;
    }

    .amount-field {
      flex: 1;
      min-width: 150px;
    }

    .category-field {
      flex: 1.5;
    }

    .date-field {
      flex: 1;
    }

    // Seletor de tipo
    .transaction-type-selector {
      margin-bottom: 24px;
      
      .type-toggle-container {
        display: flex;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 20px;
        padding: 4px;
        gap: 4px;
        box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
        backdrop-filter: blur(10px);
      }
      
      .type-button {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 12px 16px;
        border: none;
        border-radius: 16px;
        background: transparent;
        color: rgba(255, 255, 255, 0.7);
        font-weight: 500;
        font-size: 0.95rem;
        cursor: pointer;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        
        mat-icon {
          font-size: 1.2rem;
          width: 1.2rem;
          height: 1.2rem;
        }
        
        &:hover:not(.active) {
          background: rgba(255, 255, 255, 0.15);
          color: white;
          transform: translateY(-1px);
        }
        
        &.active {
          background: white;
          color: white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transform: translateY(-1px);
          
          &.expense-button {
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
          }
          
          &.income-button {
            background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
            box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
          }
        }
      }
    }

    // Checkbox do cartão de crédito
    .credit-card-option {
      padding: 16px;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      
      .credit-card-checkbox {
        display: flex;
        align-items: center;
        gap: 12px;
        color: rgba(255, 255, 255, 0.9);
        
        ::ng-deep .mat-mdc-checkbox {
          .mdc-checkbox {
            .mdc-checkbox__background {
              background-color: rgba(255, 255, 255, 0.1);
              border-color: rgba(255, 255, 255, 0.3);
            }
            
            &.mdc-checkbox--selected .mdc-checkbox__background {
              background-color: #60a5fa;
              border-color: #60a5fa;
            }
          }
        }
        
        mat-icon {
          font-size: 1.2rem;
          width: 1.2rem;
          height: 1.2rem;
          color: #fbbf24;
        }
        
        span {
          font-weight: 500;
          color: rgba(255, 255, 255, 0.9);
        }
      }
    }

    .modal-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 32px 32px 32px;
      gap: 12px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(255, 255, 255, 0.05);
      
      @media (max-width: 768px) {
        flex-direction: column;
        gap: 12px;
        
        button {
          width: 100%;
        }
      }
    }

    .cancel-button {
      padding: 14px 28px;
      border: 2px solid rgba(255, 255, 255, 0.2);
      border-radius: 12px;
      background: transparent;
      color: rgba(255, 255, 255, 0.8);
      font-weight: 600;
      font-size: 0.95rem;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      
      &:hover {
        background: rgba(255, 255, 255, 0.1);
        border-color: rgba(255, 255, 255, 0.4);
        color: white;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(255, 255, 255, 0.1);
      }
    }

    .confirm-button {
      padding: 14px 28px;
      border: none;
      border-radius: 12px;
      background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
      color: white;
      font-weight: 600;
      font-size: 0.95rem;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 4px 12px rgba(96, 165, 250, 0.3);
      position: relative;
      overflow: hidden;
      
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
        transition: left 0.5s;
      }
      
      &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(96, 165, 250, 0.4);
        
        &::before {
          left: 100%;
        }
      }
      
      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none;
        
        &::before {
          display: none;
        }
      }
      
      mat-icon {
        font-size: 1.1rem;
        width: 1.1rem;
        height: 1.1rem;
      }
    }
  `]
})
export class TransactionModalComponent implements OnInit {
  private fb = inject(FormBuilder);
  private storageService = inject(StorageService);
  private utilsService = inject(UtilsService);
  private snackBar = inject(MatSnackBar);

  @Input() data!: TransactionModalData;
  @Input() modalRef!: CustomModalRef;

  transactionForm!: FormGroup;
  categories: Category[] = [];
  categoryOptions: Array<{label: string, value: string}> = [];
  isEdit = false;
  compactMode = false;
  loading = false;

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
    this.transactionForm = this.fb.group({
      transactionType: ['expense', Validators.required],
      description: ['', [Validators.required, Validators.minLength(2)]],
      amount: [0, [Validators.required, Validators.min(0.01)]],
      category: ['', Validators.required],
      date: [new Date(), Validators.required],
      isCreditCard: [false]
    });

    // Se for edição, preencher dados
    if (this.isEdit && this.data.transaction) {
      const transaction = this.data.transaction;
      this.transactionForm.patchValue({
        transactionType: transaction.amount >= 0 ? 'income' : 'expense',
        description: transaction.description,
        amount: Math.abs(transaction.amount),
        category: transaction.category,
        date: new Date(transaction.date),
        isCreditCard: transaction.isCreditCard || false
      });
    }
  }

  onSave() {
    if (this.transactionForm.valid) {
      this.loading = true;
      
      try {
        const formValue = this.transactionForm.value;
        
        const amount = formValue.transactionType === 'income' 
          ? Math.abs(formValue.amount)
          : Math.abs(formValue.amount) * -1;
        
        const transaction: Transaction = {
          id: this.isEdit && this.data.transaction ? this.data.transaction.id : this.utilsService.generateId(),
          description: formValue.description.trim(),
          amount: amount,
          category: formValue.category,
          date: formValue.date,
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
}
