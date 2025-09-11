import { Component, OnInit, OnDestroy, inject, ChangeDetectionStrategy, ChangeDetectorRef, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { MatTooltipModule } from '@angular/material/tooltip';

import { StorageService } from '../../core/services/storage.service';
import { CalculationService } from '../../core/services/calculation.service';
import { UtilsService } from '../../core/services/utils.service';
import { SalaryService } from '../../core/services/salary.service';
import { Transaction } from '../../core/models/transaction.model';
import { CustomModalService } from '../../shared/components/custom-modal/custom-modal.service';
import { TransactionModalComponent, TransactionModalData } from '../../shared/components/transaction-modal/transaction-modal.component';

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
export class HomeComponent implements OnInit, OnDestroy {
  private storageService = inject(StorageService);
  private calculationService = inject(CalculationService);
  private utilsService = inject(UtilsService);
  private salaryService = inject(SalaryService);
  private customModal = inject(CustomModalService);
  private snackBar = inject(MatSnackBar);
  private cdr = inject(ChangeDetectorRef);
  private viewContainer = inject(ViewContainerRef);

  // Dados principais
  balance = 0;
  income = 0;
  expenses = 0;
  recentTransactions: Transaction[] = [];
  monthlyTransactionCount = 0;
  
  // Estados
  loading = true;
  hasData = false;
  
  // Subscriptions
  private storageSubscription?: Subscription;

  ngOnInit() {
    this.checkAndAddSalary();
    this.loadData();
    this.subscribeToStorageChanges();
  }

  ngOnDestroy() {
    if (this.storageSubscription) {
      this.storageSubscription.unsubscribe();
    }
  }

  private subscribeToStorageChanges() {
    this.storageSubscription = this.storageService.saveEvents$
      .pipe(
        filter(event => event !== null && event.type === 'transactions')
      )
      .subscribe(() => {
        // Atualização automática quando houver mudança nas transações
        this.loadData();
      });
  }

  loadData() {
    // Não mostrar loading para atualizações após adicionar transações
    // Apenas para carregamento inicial
    if (this.recentTransactions.length === 0 && this.balance === 0) {
      this.loading = true;
    }
    
    try {
      // Carrega dados básicos
      this.balance = this.calculationService.getCurrentMonthBalance();
      this.income = this.calculationService.getCurrentMonthIncome();
      this.expenses = this.calculationService.getCurrentMonthExpenses();
      
      // Carrega transações recentes (ordenadas por data de criação - mais recente primeiro)
      this.recentTransactions = this.storageService.getTransactions()
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 10); // Aumentado para 10 transações
      
      // Calcula número de transações do mês atual
      this.monthlyTransactionCount = this.calculateMonthlyTransactionCount();
      
      // Verifica se tem dados
      this.hasData = this.recentTransactions.length > 0 || this.balance !== 0;
      
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      this.snackBar.open('Erro ao carregar dados', 'Fechar', { duration: 3000 });
    } finally {
      this.loading = false;
      // Força detecção de mudanças imediata para componentes OnPush
      this.cdr.markForCheck();
      this.cdr.detectChanges();
    }
  }

  openAddDialog(compactMode = false) {
    // Configurar container para o modal service
    this.customModal.setContainer(this.viewContainer);
    
    const modalData: TransactionModalData = {
      compactMode: compactMode
    };

    const modalRef = this.customModal.open(TransactionModalComponent, {
      data: modalData,
      width: compactMode ? '500px' : '700px',
      maxWidth: '90vw'
    });

    modalRef.afterClosed().subscribe(result => {
      if (result) {
        // A atualização será automática via subscribeToStorageChanges()
        // Não precisamos mais chamar loadData() manualmente
      }
    });
  }

  getBalanceColor(): string {
    // Se não há dados, usa estado padrão com gradiente do tema
    if (!this.hasData && this.balance === 0) {
      return 'default';
    }
    
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

  getCurrentMonthName(): string {
    const months = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return months[new Date().getMonth()];
  }

  getBalanceTrendText(): string {
    if (this.balance > 0) {
      return 'Saldo positivo 📈';
    } else if (this.balance < 0) {
      return 'Atenção aos gastos 📉';
    }
    return 'Saldo zerado ⚖️';
  }

  getAbsoluteValue(value: number): number {
    return Math.abs(value);
  }

  /**
   * Verifica e adiciona salário automaticamente se necessário
   */
  private checkAndAddSalary(): void {
    try {
      const salaryAdded = this.salaryService.checkAndAddSalaryIfNeeded();
      
      if (salaryAdded) {
        const settings = this.storageService.getSettings();
        const salaryAmount = this.utilsService.formatCurrency(settings.salary || 0);
        
        this.snackBar.open(
          `Salário de ${salaryAmount} adicionado automaticamente! 💰`,
          'Ver',
          { 
            duration: 5000,
            panelClass: ['success-snackbar']
          }
        ).onAction().subscribe(() => {
          // Scroll para a seção de transações ou mostra detalhes
          this.scrollToTransactions();
        });
      }
    } catch (error) {
      console.error('Erro ao verificar salário:', error);
      // Não mostra erro para o usuário, pois é uma funcionalidade automática
    }
  }

  /**
   * Faz scroll suave para a seção de transações
   */
  private scrollToTransactions(): void {
    const transactionsElement = document.querySelector('.transactions-card');
    if (transactionsElement) {
      transactionsElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  }

  calculateMonthlyTransactionCount(): number {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return this.storageService.getTransactions().filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate.getMonth() === currentMonth && 
             transactionDate.getFullYear() === currentYear;
    }).length;
  }

  getTransactionCountText(): string {
    if (this.monthlyTransactionCount === 0) return '';
    if (this.monthlyTransactionCount === 1) return '1 lançamento este mês';
    return `${this.monthlyTransactionCount} lançamentos este mês`;
  }
}
