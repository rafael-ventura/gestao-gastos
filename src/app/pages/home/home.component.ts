import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { StorageService } from '../../core/services/storage.service';
import { CalculationService } from '../../core/services/calculation.service';
import { UtilsService } from '../../core/services/utils.service';
import { Transaction } from '../../core/models/transaction.model';
import { AddTransactionDialogComponent, AddTransactionDialogData } from '../../shared/components/add-transaction-dialog/add-transaction-dialog.component';

@Component({
  selector: 'app-home',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  private storageService = inject(StorageService);
  private calculationService = inject(CalculationService);
  private utilsService = inject(UtilsService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  // Dados principais
  balance = 0;
  income = 0;
  expenses = 0;
  recentTransactions: Transaction[] = [];
  expensesByCategory: any[] = [];
  
  // Estados
  loading = true;
  hasData = false;

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    
    try {
      // Carrega dados básicos
      this.balance = this.calculationService.getCurrentMonthBalance();
      this.income = this.calculationService.getCurrentMonthIncome();
      this.expenses = this.calculationService.getCurrentMonthExpenses();
      
      // Carrega transações recentes
      this.recentTransactions = this.storageService.getTransactions()
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);
      
      // Carrega gastos por categoria
      this.expensesByCategory = this.calculationService.getExpensesByCategory();
      
      // Verifica se tem dados
      this.hasData = this.recentTransactions.length > 0 || this.balance !== 0;
      
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      this.snackBar.open('Erro ao carregar dados', 'Fechar', { duration: 3000 });
    } finally {
      this.loading = false;
    }
  }

  openAddDialog(compactMode = false) {
    const dialogData: AddTransactionDialogData = {
      compactMode: compactMode
    };

    const dialogRef = this.dialog.open(AddTransactionDialogComponent, {
      data: dialogData,
      width: compactMode ? '400px' : '500px',
      maxWidth: '90vw',
      disableClose: false,
      autoFocus: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Recarrega os dados após adicionar transação
        this.loadData();
      }
    });
  }

  getBalanceColor(): string {
    if (this.balance > 0) return 'positive';
    if (this.balance < 0) return 'negative';
    return 'neutral';
  }

  getBalanceIcon(): string {
    if (this.balance > 0) return 'trending_up';
    if (this.balance < 0) return 'trending_down';
    return 'trending_flat';
  }

  formatCurrency(value: number): string {
    return this.utilsService.formatCurrency(value);
  }

  formatDate(date: string): string {
    return this.utilsService.formatDateShort(date);
  }

  getCategoryColor(categoryName: string): string {
    const category = this.storageService.getCategories().find(c => c.name === categoryName);
    return category?.color || '#000000';
  }
}
