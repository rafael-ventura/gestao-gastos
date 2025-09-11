import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { Transaction } from '../models/transaction.model';

export interface MonthlySummary {
  month: string;
  income: number;
  expenses: number;
  balance: number;
  transactionCount: number;
}

export interface CategorySummary {
  category: string;
  amount: number;
  color: string;
  percentage: number;
  transactionCount: number;
}

@Injectable({ providedIn: 'root' })
export class CalculationService {
  constructor(private storageService: StorageService) {}

  // ===== CÁLCULOS MENSАIS =====
  getCurrentMonthBalance(): number {
    const currentMonth = this.getCurrentMonth();
    return this.getMonthBalance(currentMonth);
  }

  getMonthBalance(month: string): number {
    const transactions = this.getMonthTransactions(month);
    const income = this.getMonthIncome(transactions);
    const expenses = this.getMonthExpenses(transactions);
    return income - expenses;
  }

  getCurrentMonthIncome(): number {
    const currentMonth = this.getCurrentMonth();
    const transactions = this.getMonthTransactions(currentMonth);
    return this.getMonthIncome(transactions);
  }

  getCurrentMonthExpenses(): number {
    const currentMonth = this.getCurrentMonth();
    const transactions = this.getMonthTransactions(currentMonth);
    return this.getMonthExpenses(transactions);
  }

  // ===== CONFIGURAÇÕES =====
  getSalary(): number {
    return this.storageService.getSettings().salary;
  }

  getSalaryDay(): number {
    return this.storageService.getSettings().salaryDay;
  }

  getCreditCardDueDay(): number {
    return this.storageService.getSettings().creditCardDueDay;
  }

  // ===== CATEGORIAS =====
  getExpensesByCategory(month?: string): CategorySummary[] {
    const targetMonth = month || this.getCurrentMonth();
    const transactions = this.getMonthTransactions(targetMonth);
    const settings = this.storageService.getSettings();
    
    const expenseTransactions = transactions.filter(t => t.amount < 0);
    const totalExpenses = this.getMonthExpenses(expenseTransactions);

    const categoryMap = new Map<string, { amount: number; count: number }>();

    expenseTransactions.forEach(transaction => {
      const amount = Math.abs(transaction.amount);
      const existing = categoryMap.get(transaction.category);
      
      if (existing) {
        existing.amount += amount;
        existing.count += 1;
      } else {
        categoryMap.set(transaction.category, { amount, count: 1 });
      }
    });

    return Array.from(categoryMap.entries()).map(([category, data]) => {
      const categoryInfo = settings.categories.find(c => c.name === category);
      return {
        category,
        amount: data.amount,
        color: categoryInfo?.color || '#000000',
        percentage: totalExpenses > 0 ? (data.amount / totalExpenses) * 100 : 0,
        transactionCount: data.count
      };
    }).sort((a, b) => b.amount - a.amount);
  }

  // ===== RELATÓRIOS =====
  getMonthlySummary(month: string): MonthlySummary {
    const transactions = this.getMonthTransactions(month);
    const income = this.getMonthIncome(transactions);
    const expenses = this.getMonthExpenses(transactions);
    
    return {
      month,
      income,
      expenses,
      balance: income - expenses,
      transactionCount: transactions.length
    };
  }

  getLast12Months(): MonthlySummary[] {
    const months = this.getLast12MonthsList();
    return months.map(month => this.getMonthlySummary(month));
  }

  // ===== CARTÃO DE CRÉDITO =====
  getCreditCardExpenses(month?: string): number {
    const targetMonth = month || this.getCurrentMonth();
    const transactions = this.getMonthTransactions(targetMonth);
    
    return transactions
      .filter(t => t.isCreditCard && t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  }

  getCreditCardExpensesByCategory(month?: string): CategorySummary[] {
    const targetMonth = month || this.getCurrentMonth();
    const transactions = this.getMonthTransactions(targetMonth);
    const settings = this.storageService.getSettings();
    
    const creditCardTransactions = transactions.filter(t => t.isCreditCard && t.amount < 0);
    const totalExpenses = creditCardTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const categoryMap = new Map<string, { amount: number; count: number }>();

    creditCardTransactions.forEach(transaction => {
      const amount = Math.abs(transaction.amount);
      const existing = categoryMap.get(transaction.category);
      
      if (existing) {
        existing.amount += amount;
        existing.count += 1;
      } else {
        categoryMap.set(transaction.category, { amount, count: 1 });
      }
    });

    return Array.from(categoryMap.entries()).map(([category, data]) => {
      const categoryInfo = settings.categories.find(c => c.name === category);
      return {
        category,
        amount: data.amount,
        color: categoryInfo?.color || '#000000',
        percentage: totalExpenses > 0 ? (data.amount / totalExpenses) * 100 : 0,
        transactionCount: data.count
      };
    }).sort((a, b) => b.amount - a.amount);
  }

  // ===== MÉTRICAS AVANÇADAS =====
  getSavingsRate(month?: string): number {
    const targetMonth = month || this.getCurrentMonth();
    const income = this.getMonthIncome(this.getMonthTransactions(targetMonth));
    const expenses = this.getMonthExpenses(this.getMonthTransactions(targetMonth));
    
    if (income === 0) return 0;
    return ((income - expenses) / income) * 100;
  }

  getAverageDailyExpense(month?: string): number {
    const targetMonth = month || this.getCurrentMonth();
    const expenses = this.getMonthExpenses(this.getMonthTransactions(targetMonth));
    const daysInMonth = new Date(targetMonth + '-01').getDate();
    
    return expenses / daysInMonth;
  }

  getLargestExpense(month?: string): Transaction | null {
    const targetMonth = month || this.getCurrentMonth();
    const transactions = this.getMonthTransactions(targetMonth);
    
    const expenseTransactions = transactions.filter(t => t.amount < 0);
    if (expenseTransactions.length === 0) return null;
    
    return expenseTransactions.reduce((largest, current) => 
      Math.abs(current.amount) > Math.abs(largest.amount) ? current : largest
    );
  }

  // ===== MÉTODOS AUXILIARES =====
  // ===== ANÁLISES ESPECIAIS =====
  getHighestExpenseDay(month?: string): { date: string; totalExpenses: number; transactionCount: number } | null {
    const targetMonth = month || this.getCurrentMonth();
    const transactions = this.getMonthTransactions(targetMonth)
      .filter(t => t.amount < 0); // Apenas gastos
    
    if (transactions.length === 0) {
      return null;
    }
    
    // Agrupa por dia
    const dailyExpenses = new Map<string, { total: number; count: number }>();
    
    transactions.forEach(transaction => {
      const day = transaction.date; // Já está no formato YYYY-MM-DD
      const amount = Math.abs(transaction.amount);
      
      if (dailyExpenses.has(day)) {
        const existing = dailyExpenses.get(day)!;
        existing.total += amount;
        existing.count += 1;
      } else {
        dailyExpenses.set(day, { total: amount, count: 1 });
      }
    });
    
    // Encontra o dia com maior gasto
    let highestDay = '';
    let highestAmount = 0;
    let highestCount = 0;
    
    dailyExpenses.forEach((value, day) => {
      if (value.total > highestAmount) {
        highestAmount = value.total;
        highestDay = day;
        highestCount = value.count;
      }
    });
    
    return {
      date: highestDay,
      totalExpenses: highestAmount,
      transactionCount: highestCount
    };
  }

  private getCurrentMonth(): string {
    return new Date().toISOString().slice(0, 7);
  }

  private getMonthTransactions(month: string): Transaction[] {
    const transactions = this.storageService.getTransactions();
    return transactions.filter(t => t.date.startsWith(month));
  }

  private getMonthIncome(transactions: Transaction[]): number {
    return transactions
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);
  }

  private getMonthExpenses(transactions: Transaction[]): number {
    return transactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  }

  private getLast12MonthsList(): string[] {
    const months: string[] = [];
    const now = new Date();
    
    // Inclui o mês atual (i = 0) até 11 meses atrás
    for (let i = 0; i < 12; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push(date.toISOString().slice(0, 7));
    }
    
    // Retorna em ordem cronológica (mais antigo primeiro)
    return months.reverse();
  }
}

