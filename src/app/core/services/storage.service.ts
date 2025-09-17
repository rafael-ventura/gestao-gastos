import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Transaction } from '../models/transaction.model';
import { Settings } from '../models/settings.model';
import { Category } from '../models/category.model';

export interface SaveEvent {
  type: 'transactions' | 'settings';
  timestamp: Date;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class StorageService {
  private readonly TRANSACTIONS_KEY = 'gastos_transactions';
  private readonly SETTINGS_KEY = 'gastos_settings';
  private readonly SCHEMA_VERSION = '1.0.0';

  // Cache para melhor performance - invalidado no hot reload
  private _transactionsCache: Transaction[] | null = null;
  private _settingsCache: Settings | null = null;
  
  // Flag para detectar se é hot reload
  private _isFirstLoad = true;

  // Observable para notificações de salvamento
  private _saveEvents$ = new BehaviorSubject<SaveEvent | null>(null);
  public saveEvents$: Observable<SaveEvent | null> = this._saveEvents$.asObservable();

  // ===== TRANSAÇÕES =====
  getTransactions(): Transaction[] {
    // No desenvolvimento, sempre recarrega do localStorage na primeira chamada
    // para evitar problemas com hot reload
    if (this._transactionsCache && !this._isFirstLoad) {
      return this._transactionsCache;
    }
    
    this._isFirstLoad = false;

    // Verifica se está no browser
    if (typeof window === 'undefined' || !window.localStorage) {
      console.log('LocalStorage não disponível');
      this._transactionsCache = [];
      return this._transactionsCache;
    }

    try {
      const data = localStorage.getItem(this.TRANSACTIONS_KEY);
      
      if (!data) {
        this._transactionsCache = [];
        return this._transactionsCache;
      }

      const parsed = JSON.parse(data);
      
      // Verifica se tem a estrutura de versioning
      const transactionsData = parsed.data ? parsed.data : parsed;
      this._transactionsCache = this.validateTransactions(transactionsData);
      
      return this._transactionsCache;
    } catch (error) {
      console.error('Erro ao carregar transações:', error);
      this._transactionsCache = [];
      return this._transactionsCache;
    }
  }

  saveTransactions(transactions: Transaction[]): void {
    try {
      const dataToSave = {
        version: this.SCHEMA_VERSION,
        data: transactions,
        timestamp: new Date().toISOString()
      };
      
      localStorage.setItem(this.TRANSACTIONS_KEY, JSON.stringify(dataToSave));
      this._transactionsCache = [...transactions]; // Atualiza cache
      
      // Emite evento de salvamento
      this.emitSaveEvent('transactions');
    } catch (error) {
      console.error('Erro ao salvar transações:', error);
      throw new Error('Não foi possível salvar as transações');
    }
  }

  addTransaction(transaction: Transaction): void {
    const transactions = this.getTransactions();
    transactions.push(transaction);
    this.saveTransactions(transactions);
  }

  updateTransaction(id: string, updatedTransaction: Partial<Transaction>): void {
    const transactions = this.getTransactions();
    const index = transactions.findIndex(t => t.id === id);
    
    if (index !== -1) {
      transactions[index] = { ...transactions[index], ...updatedTransaction };
      this.saveTransactions(transactions);
    }
  }

  deleteTransaction(id: string): void {
    const transactions = this.getTransactions();
    const filtered = transactions.filter(t => t.id !== id);
    this.saveTransactions(filtered);
  }

  // ===== CONFIGURAÇÕES =====
  getSettings(): Settings {
    if (this._settingsCache) {
      return this._settingsCache;
    }

    // Verifica se está no browser
    if (typeof window === 'undefined' || !window.localStorage) {
      this._settingsCache = this.getDefaultSettings();
      return this._settingsCache;
    }

    try {
      const data = localStorage.getItem(this.SETTINGS_KEY);
      if (!data) {
        this._settingsCache = this.getDefaultSettings();
        return this._settingsCache;
      }

      const parsed = JSON.parse(data);
      this._settingsCache = this.validateSettings(parsed);
      return this._settingsCache;
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      this._settingsCache = this.getDefaultSettings();
      return this._settingsCache;
    }
  }

  saveSettings(settings: Settings): void {
    try {
      const dataToSave = {
        version: this.SCHEMA_VERSION,
        data: settings,
        timestamp: new Date().toISOString()
      };
      
      localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(dataToSave));
      this._settingsCache = { ...settings }; // Atualiza cache
      
      // Emite evento de salvamento
      this.emitSaveEvent('settings');
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      throw new Error('Não foi possível salvar as configurações');
    }
  }

  // ===== CATEGORIAS =====
  getCategories(): Category[] {
    return this.getSettings().categories;
  }

  addCategory(category: Category): void {
    const settings = this.getSettings();
    settings.categories.push(category);
    this.saveSettings(settings);
  }

  updateCategory(id: string, updatedCategory: Partial<Category>): void {
    const settings = this.getSettings();
    const index = settings.categories.findIndex(c => c.id === id);
    
    if (index !== -1) {
      settings.categories[index] = { ...settings.categories[index], ...updatedCategory };
      this.saveSettings(settings);
    }
  }

  deleteCategory(id: string): void {
    const settings = this.getSettings();
    settings.categories = settings.categories.filter(c => c.id !== id);
    this.saveSettings(settings);
  }

  // ===== UTILITÁRIOS =====
  clearAllData(): void {
    localStorage.removeItem(this.TRANSACTIONS_KEY);
    localStorage.removeItem(this.SETTINGS_KEY);
    this._transactionsCache = null;
    this._settingsCache = null;
  }

  // ===== BACKUP E RESTORE =====
  exportData(): string {
    const data = {
      version: this.SCHEMA_VERSION,
      timestamp: new Date().toISOString(),
      transactions: this.getTransactions(),
      settings: this.getSettings()
    };
    return JSON.stringify(data, null, 2);
  }

  importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.transactions && Array.isArray(data.transactions)) {
        this.saveTransactions(data.transactions);
      }
      
      if (data.settings && typeof data.settings === 'object') {
        this.saveSettings(data.settings);
      }
      
      return true;
    } catch (error) {
      console.error('Erro ao importar dados:', error);
      return false;
    }
  }

  // ===== VERIFICAÇÃO DE DADOS =====
  hasData(): boolean {
    const transactions = this.getTransactions();
    const settings = this.getSettings();
    return transactions.length > 0 || settings.salary > 0 || settings.categories.length > 5;
  }

  // ===== MIGRAÇÃO E COMPATIBILIDADE =====
  
  /**
   * Migra dados existentes para o formato padronizado
   * Corrige inconsistências entre salaryDay e datas de transações
   */
  migrateDataToStandardFormat(): void {
    console.log('🔄 INICIANDO MIGRAÇÃO DE DADOS...');
    
    try {
      const transactions = this.getTransactions();
      const settings = this.getSettings();
      
      // Busca transações de salário
      const salaryTransactions = transactions.filter(transaction => 
        (transaction.description.toLowerCase() === 'salário' || 
         transaction.category === 'Salário') && 
        transaction.amount > 0
      );
      
      if (salaryTransactions.length > 0) {
        console.log(`📊 Encontradas ${salaryTransactions.length} transações de salário`);
        
        // Pega a transação mais recente para extrair o dia
        const latestSalary = salaryTransactions.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )[0];
        
        // CORREÇÃO: Extrai o dia da transação mais recente no timezone local
        const [year, month, day] = latestSalary.date.split('-').map(Number);
        const extractedDay = new Date(year, month - 1, day).getDate();
        
        console.log(`📅 Dia extraído da transação mais recente: ${extractedDay}`);
        
        // Se o salaryDay está diferente do dia da transação, corrige
        if (settings.salaryDay !== extractedDay) {
          console.log(`🔄 Corrigindo salaryDay de ${settings.salaryDay} para ${extractedDay}`);
          
          const updatedSettings = {
            ...settings,
            salaryDay: extractedDay
          };
          
          this.saveSettings(updatedSettings);
          console.log('✅ SalaryDay corrigido na migração');
        }
        
        // Normaliza todas as datas de salário para o dia correto
        this.normalizeAllSalaryDates(extractedDay);
      }
      
      console.log('✅ MIGRAÇÃO CONCLUÍDA');
    } catch (error) {
      console.error('❌ Erro durante migração:', error);
    }
  }

  /**
   * Normaliza todas as datas de salário para o dia correto
   */
  private normalizeAllSalaryDates(correctDay: number): void {
    const transactions = this.getTransactions();
    let hasChanges = false;
    
    const updatedTransactions = transactions.map(transaction => {
      const isSalary = (transaction.description.toLowerCase() === 'salário' || 
                       transaction.category === 'Salário') && 
                      transaction.amount > 0;
      
      if (isSalary) {
        // CORREÇÃO: Extrai o dia no timezone local
        const [year, month, day] = transaction.date.split('-').map(Number);
        const currentDay = new Date(year, month - 1, day).getDate();
        
        if (currentDay !== correctDay) {
          console.log(`🔄 Normalizando data de salário: ${transaction.date} -> dia ${correctDay}`);
          
          // CORREÇÃO: Parse da data no timezone local
          const [year, month, day] = transaction.date.split('-').map(Number);
          const date = new Date(year, month - 1, day);
          const normalizedDate = new Date(date.getFullYear(), date.getMonth(), correctDay);
          
          // Formata no timezone local
          const yearStr = normalizedDate.getFullYear();
          const monthStr = String(normalizedDate.getMonth() + 1).padStart(2, '0');
          const dayStr = String(normalizedDate.getDate()).padStart(2, '0');
          const normalizedDateString = `${yearStr}-${monthStr}-${dayStr}`;
          
          hasChanges = true;
          
          return {
            ...transaction,
            date: normalizedDateString
          };
        }
      }
      
      return transaction;
    });
    
    if (hasChanges) {
      this.saveTransactions(updatedTransactions);
      console.log('✅ Datas de salário normalizadas');
    }
  }

  // ===== ESTATÍSTICAS =====
  getDataStats(): { transactions: number, categories: number, lastUpdate: string | null } {
    const transactions = this.getTransactions();
    const settings = this.getSettings();
    
    let lastUpdate: string | null = null;
    if (transactions.length > 0) {
      const lastTransaction = transactions.reduce((latest, current) => 
        new Date(current.createdAt) > new Date(latest.createdAt) ? current : latest
      );
      lastUpdate = lastTransaction.createdAt.toISOString();
    }
    
    return {
      transactions: transactions.length,
      categories: settings.categories.length,
      lastUpdate
    };
  }


  // ===== VALIDAÇÕES =====
  private validateTransactions(data: any): Transaction[] {
    if (!Array.isArray(data)) {
      return [];
    }

    return data.filter(item => 
      item && 
      typeof item.id === 'string' &&
      typeof item.description === 'string' &&
      typeof item.amount === 'number' &&
      typeof item.category === 'string' &&
      typeof item.date === 'string' &&
      typeof item.isCreditCard === 'boolean' &&
      item.createdAt
    );
  }

  private validateSettings(data: any): Settings {
    if (!data || typeof data !== 'object') {
      return this.getDefaultSettings();
    }

    return {
      salary: typeof data.salary === 'number' ? data.salary : 0,
      salaryDay: typeof data.salaryDay === 'number' ? data.salaryDay : 1,
      creditCardDueDay: typeof data.creditCardDueDay === 'number' ? data.creditCardDueDay : 10,
      categories: Array.isArray(data.categories) ? data.categories : this.getDefaultSettings().categories
    };
  }

  private getDefaultSettings(): Settings {
    return {
      salary: 0,
      salaryDay: 1,
      creditCardDueDay: 10,
      categories: [
        { id: '1', name: 'Alimentação', color: '#FF6B6B' },
        { id: '2', name: 'Transporte', color: '#4ECDC4' },
        { id: '3', name: 'Lazer', color: '#45B7D1' },
        { id: '4', name: 'Saúde', color: '#96CEB4' },
        { id: '5', name: 'Outros', color: '#FFEAA7' }
      ]
    };
  }

  // ===== DEBUG METHODS =====
  debugLocalStorage(): void {
    console.log('=== DEBUG LOCALSTORAGE ===');
    console.log('Transactions key:', this.TRANSACTIONS_KEY);
    console.log('Settings key:', this.SETTINGS_KEY);
    console.log('First load:', this._isFirstLoad);
    
    // Teste básico do localStorage
    try {
      localStorage.setItem('test', 'test');
      const testValue = localStorage.getItem('test');
      localStorage.removeItem('test');
      console.log('LocalStorage test:', testValue === 'test' ? 'WORKING' : 'FAILED');
    } catch (e) {
      console.error('LocalStorage test failed:', e);
    }
    
    const transactionsData = localStorage.getItem(this.TRANSACTIONS_KEY);
    const settingsData = localStorage.getItem(this.SETTINGS_KEY);
    
    console.log('Transactions in localStorage:', transactionsData ? 'EXISTS' : 'EMPTY');
    console.log('Settings in localStorage:', settingsData ? 'EXISTS' : 'EMPTY');
    
    if (transactionsData) {
      try {
        const parsed = JSON.parse(transactionsData);
        console.log('Parsed transactions structure:', {
          hasData: !!parsed.data,
          hasVersion: !!parsed.version,
          directArray: Array.isArray(parsed),
          length: parsed.data ? parsed.data.length : (Array.isArray(parsed) ? parsed.length : 0)
        });
      } catch (e) {
        console.error('Error parsing transactions:', e);
      }
    }
    
    console.log('Cache state:');
    console.log('- transactionsCache:', this._transactionsCache?.length || 0);
    console.log('- settingsCache:', this._settingsCache ? 'EXISTS' : 'NULL');
    console.log('========================');
  }

  // ===== NOTIFICAÇÕES DE SALVAMENTO =====
  private emitSaveEvent(type: 'transactions' | 'settings'): void {
    const messages = {
      transactions: 'Transações salvas automaticamente',
      settings: 'Configurações salvas automaticamente'
    };

    const event: SaveEvent = {
      type,
      timestamp: new Date(),
      message: messages[type]
    };

    this._saveEvents$.next(event);

    // Limpa o evento após 3 segundos
    setTimeout(() => {
      this._saveEvents$.next(null);
    }, 3000);
  }
}
