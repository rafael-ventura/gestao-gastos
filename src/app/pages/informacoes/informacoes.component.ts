import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar } from '@angular/material/snack-bar';

import { StorageService } from '../../core/services/storage.service';
import { CalculationService, MonthlySummary, CategorySummary } from '../../core/services/calculation.service';
import { UtilsService } from '../../core/services/utils.service';
import { Transaction } from '../../core/models/transaction.model';

@Component({
  selector: 'app-informacoes',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatSelectModule,
    MatFormFieldModule
  ],
  templateUrl: './informacoes.component.html',
  styleUrl: './informacoes.component.scss'
})
export class InformacoesComponent implements OnInit {
  private storageService = inject(StorageService);
  private calculationService = inject(CalculationService);
  private utilsService = inject(UtilsService);
  private snackBar = inject(MatSnackBar);

  // Dados principais
  currentMonth = this.utilsService.getCurrentMonth();
  selectedMonth = this.currentMonth;
  
  // KPIs
  balance = 0;
  income = 0;
  expenses = 0;
  salary = 0;
  savingsRate = 0;
  averageDailyExpense = 0;
  
  // Dados detalhados
  expensesByCategory: CategorySummary[] = [];
  creditCardExpenses = 0;
  creditCardExpensesByCategory: CategorySummary[] = [];
  monthTransactions: Transaction[] = [];
  monthlySummaries: MonthlySummary[] = [];
  largestExpense: Transaction | null = null;
  highestExpenseDay: { date: string; totalExpenses: number; transactionCount: number } | null = null;
  
  // GIFs aleatórios
  randomGif1: string = '';
  randomGif2: string = '';
  
  // Estados
  loading = true;
  hasData = false;
  selectedTab = 0;

  // Filtros
  selectedCategoryFilter: string | null = null;
  filteredTransactions: Transaction[] = [];

  // Opções
  months = this.getLast12MonthsList();

  ngOnInit() {
    this.generateRandomGif();
    this.loadData();
  }
  
  private generateRandomGif(): void {
    // Gera 2 números aleatórios diferentes de 1 a 5
    const randomNumber1 = Math.floor(Math.random() * 5) + 1;
    let randomNumber2 = Math.floor(Math.random() * 5) + 1;
    
    // Garante que os 2 GIFs sejam diferentes
    while (randomNumber2 === randomNumber1) {
      randomNumber2 = Math.floor(Math.random() * 5) + 1;
    }
    
    this.randomGif1 = `/assets/gif${randomNumber1}.webp`;
    this.randomGif2 = `/assets/gif${randomNumber2}.webp`;
    
    console.log(`🎲 GIFs selecionados: gif${randomNumber1}.webp e gif${randomNumber2}.webp`);
  }
  
  // Método público para regenerar GIFs (caso queira usar em algum botão futuramente)
  public regenerateRandomGif(): void {
    this.generateRandomGif();
  }

  loadData() {
    this.loading = true;
    
    try {
      // Carrega dados do mês atual
      this.loadMonthData(this.selectedMonth);
      
      // Carrega resumos dos últimos 12 meses
      this.monthlySummaries = this.calculationService.getLast12Months();
      
      // Verifica se tem dados
      this.hasData = this.monthTransactions.length > 0 || this.balance !== 0;
      
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      this.snackBar.open('Erro ao carregar informações', 'Fechar', { duration: 3000 });
    } finally {
      this.loading = false;
    }
  }

  loadMonthData(month: string) {
    // Corrigir para usar o mês selecionado ao invés do atual
    const monthTransactions = this.storageService.getTransactions()
      .filter(t => t.date.startsWith(month));
    
    this.income = monthTransactions
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);
    
    this.expenses = monthTransactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
      
    this.balance = this.income - this.expenses;
    this.salary = this.calculationService.getSalary();
    this.savingsRate = this.calculationService.getSavingsRate(month);
    this.averageDailyExpense = this.calculationService.getAverageDailyExpense(month);
    
    this.expensesByCategory = this.calculationService.getExpensesByCategory(month);
    this.creditCardExpenses = this.calculationService.getCreditCardExpenses(month);
    this.creditCardExpensesByCategory = this.calculationService.getCreditCardExpensesByCategory(month);
    this.largestExpense = this.calculationService.getLargestExpense(month);
    this.highestExpenseDay = this.calculationService.getHighestExpenseDay(month);
    
    this.monthTransactions = this.storageService.getTransactions()
      .filter(t => t.date.startsWith(month))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  onMonthChange(month: string) {
    this.selectedMonth = month;
    this.loadMonthData(month);
  }

  // ===== UTILITÁRIOS =====
  formatCurrency(value: number): string {
    return this.utilsService.formatCurrency(value);
  }

  formatDate(date: string): string {
    return this.utilsService.formatDateShort(date);
  }

  formatMonthYear(month: string): string {
    return this.utilsService.formatMonthYear(month);
  }

  getCategoryColor(categoryName: string): string {
    const category = this.storageService.getCategories().find(c => c.name === categoryName);
    return category?.color || '#000000';
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

  getSavingsRateColor(): string {
    if (this.savingsRate >= 20) return 'positive';
    if (this.savingsRate >= 10) return 'warning';
    return 'negative';
  }

  getSavingsRateIcon(): string {
    if (this.savingsRate >= 20) return 'savings';
    if (this.savingsRate >= 10) return 'account_balance_wallet';
    return 'warning';
  }

  private getLast12MonthsList(): string[] {
    const transactions = this.storageService.getTransactions();
    if (transactions.length === 0) {
      // Se não há transações, retorna apenas o mês atual
      return [this.currentMonth];
    }

    // Encontra a primeira transação para determinar o mês inicial
    const firstTransaction = transactions.reduce((earliest, current) => 
      new Date(current.date) < new Date(earliest.date) ? current : earliest
    );
    
    const firstMonth = firstTransaction.date.slice(0, 7);
    const currentMonth = this.currentMonth;
    
    const months: string[] = [];
    const start = new Date(firstMonth + '-01');
    const end = new Date(currentMonth + '-01');
    
    // Gera lista de meses do primeiro mês até o atual
    while (start <= end) {
      months.push(start.toISOString().slice(0, 7));
      start.setMonth(start.getMonth() + 1);
    }
    
    return months.reverse(); // Mais recente primeiro
  }

  // Métodos de filtro por categoria
  filterByCategory(category: string) {
    if (this.selectedCategoryFilter === category) {
      // Se já está filtrado pela mesma categoria, remove o filtro
      this.selectedCategoryFilter = null;
      this.filteredTransactions = [];
    } else {
      // Aplica filtro da categoria
      this.selectedCategoryFilter = category;
      this.filteredTransactions = this.monthTransactions.filter(t => t.category === category);
    }
  }

  clearCategoryFilter() {
    this.selectedCategoryFilter = null;
    this.filteredTransactions = [];
  }

  getDisplayTransactions(): Transaction[] {
    return this.selectedCategoryFilter ? this.filteredTransactions : this.monthTransactions;
  }
}

