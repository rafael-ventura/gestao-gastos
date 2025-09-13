import { Component, OnInit, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { FormInputComponent } from '../../../../shared/components/form-input/form-input.component';
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
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormInputComponent
  ],
  templateUrl: './transaction-modal.component.html',
  styleUrl: './transaction-modal.component.scss'
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
