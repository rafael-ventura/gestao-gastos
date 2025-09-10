import { Injectable, inject } from '@angular/core';
import { StorageService } from './storage.service';
import { UtilsService } from './utils.service';
import { Transaction } from '../models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class SalaryService {
  private storageService = inject(StorageService);
  private utilsService = inject(UtilsService);

  /**
   * Verifica se o salário do mês atual já foi adicionado
   */
  isSalaryAddedForCurrentMonth(): boolean {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const transactions = this.storageService.getTransactions();
    
    return transactions.some(transaction => {
      const transactionDate = new Date(transaction.date);
      return (
        (transaction.description.toLowerCase() === 'salário' || 
         transaction.category === 'Salário') &&
        transaction.amount > 0 &&
        transactionDate.getMonth() === currentMonth &&
        transactionDate.getFullYear() === currentYear
      );
    });
  }

  /**
   * Verifica se deve adicionar o salário (sempre verdadeiro se configurado e não adicionado ainda)
   * A data será sempre a data atual de quando o usuário configurou
   */
  isSalaryDayReached(): boolean {
    const settings = this.storageService.getSettings();
    return !!(settings.salary && settings.salary > 0);
  }

  /**
   * Verifica se deve adicionar o salário automaticamente
   */
  shouldAddSalary(): boolean {
    return this.isSalaryDayReached() && !this.isSalaryAddedForCurrentMonth();
  }

  /**
   * Adiciona o salário do mês atual automaticamente
   * Usa sempre a data atual (quando o usuário configurou)
   */
  addMonthlySalary(): Transaction | null {
    const settings = this.storageService.getSettings();
    
    if (!settings.salary || settings.salary <= 0) {
      return null;
    }

    // Verifica novamente se já não foi adicionado (proteção contra duplicação)
    if (this.isSalaryAddedForCurrentMonth()) {
      console.log('Salário já foi adicionado neste mês');
      return null;
    }

    const today = new Date();

    const salaryTransaction: Transaction = {
      id: this.utilsService.generateId(),
      description: 'Salário',
      amount: settings.salary, // Positivo para receita
      category: 'Salário',
      date: today.toISOString().split('T')[0], // Sempre usa a data atual
      isCreditCard: false,
      createdAt: new Date()
    };

    // Adiciona a categoria de salário se não existir
    this.ensureSalaryCategoryExists();
    
    // Adiciona a transação
    this.storageService.addTransaction(salaryTransaction);
    
    return salaryTransaction;
  }

  /**
   * Garante que a categoria "Salário" existe
   */
  private ensureSalaryCategoryExists(): void {
    const categories = this.storageService.getCategories();
    const salaryCategory = categories.find(cat => cat.name === 'Salário');
    
    if (!salaryCategory) {
      const newCategory = {
        id: this.utilsService.generateId(),
        name: 'Salário',
        color: '#4ade80' // Verde para receita
      };
      
      this.storageService.addCategory(newCategory);
    }
  }

  /**
   * Obtém informações sobre o próximo salário
   */
  getNextSalaryInfo(): { date: Date; daysUntil: number } | null {
    const settings = this.storageService.getSettings();
    
    if (!settings.salaryDay || !settings.salary || settings.salary <= 0) {
      return null;
    }

    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    let nextSalaryDate = new Date(currentYear, currentMonth, settings.salaryDay);
    
    // Se o dia do salário já passou neste mês, calcula para o próximo mês
    if (nextSalaryDate <= today) {
      nextSalaryDate = new Date(currentYear, currentMonth + 1, settings.salaryDay);
    }
    
    const daysUntil = Math.ceil((nextSalaryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    return {
      date: nextSalaryDate,
      daysUntil: daysUntil
    };
  }

  /**
   * Remove salários duplicados do mês atual (mantém apenas o mais recente)
   */
  removeDuplicateSalaries(): void {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const transactions = this.storageService.getTransactions();
    const salaryTransactions = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return (
        (transaction.description.toLowerCase() === 'salário' || 
         transaction.category === 'Salário') &&
        transaction.amount > 0 &&
        transactionDate.getMonth() === currentMonth &&
        transactionDate.getFullYear() === currentYear
      );
    });

    // Se há mais de um salário, remove os extras (mantém o mais recente)
    if (salaryTransactions.length > 1) {
      // Ordena por data de criação (mais recente primeiro)
      salaryTransactions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      // Remove todos exceto o primeiro (mais recente)
      for (let i = 1; i < salaryTransactions.length; i++) {
        this.storageService.deleteTransaction(salaryTransactions[i].id);
      }
      
      console.log(`Removidos ${salaryTransactions.length - 1} salários duplicados`);
    }
  }

  /**
   * Verifica e adiciona salário automaticamente se necessário
   * Retorna true se o salário foi adicionado
   */
  checkAndAddSalaryIfNeeded(): boolean {
    // Primeiro remove duplicatas se existirem
    this.removeDuplicateSalaries();
    
    // Então verifica se deve adicionar
    if (this.shouldAddSalary()) {
      const transaction = this.addMonthlySalary();
      return transaction !== null;
    }
    return false;
  }
}
