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
   * Consulta DIRETAMENTE o localStorage
   */
  isSalaryAddedForCurrentMonth(): boolean {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    // Consulta DIRETA do localStorage
    const transactions = this.storageService.getTransactions();
    
    // Mostra TODOS os salários no localStorage
    const allSalaries = transactions.filter(transaction => 
      (transaction.description.toLowerCase() === 'salário' || 
       transaction.category === 'Salário') && transaction.amount > 0
    );
    
    console.log(`📊 TOTAL DE SALÁRIOS NO LOCALSTORAGE: ${allSalaries.length}`);
    allSalaries.forEach((salary, index) => {
      const transactionDate = new Date(salary.date);
      console.log(`💰 Salário ${index + 1}: ${salary.date} - R$ ${salary.amount} (mês ${transactionDate.getMonth() + 1}/${transactionDate.getFullYear()})`);
    });
    
    // Busca SIMPLES: salário no mês atual
    for (const transaction of transactions) {
      const transactionDate = new Date(transaction.date);
      const isSalary = (transaction.description.toLowerCase() === 'salário' || 
                       transaction.category === 'Salário') &&
                      transaction.amount > 0;
      const isCurrentMonth = transactionDate.getMonth() === currentMonth &&
                            transactionDate.getFullYear() === currentYear;
      
      if (isSalary && isCurrentMonth) {
        console.log(`✅ SALÁRIO JÁ EXISTE NO MÊS ATUAL: ${transaction.date} - R$ ${transaction.amount}`);
        return true;
      }
    }
    
    console.log(`❌ NENHUM SALÁRIO encontrado no mês ${currentMonth + 1}/${currentYear}`);
    return false;
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
    const settings = this.storageService.getSettings();
    const hasSalary = this.isSalaryAddedForCurrentMonth();
    
    // SIMPLES: tem salário configurado E não tem salário no mês atual
    const shouldAdd = settings.salary > 0 && !hasSalary;
    
    console.log(`🤔 Deve adicionar salário?`, {
      salarioConfigurado: settings.salary,
      jaTemSalario: hasSalary,
      deveAdicionar: shouldAdd
    });
    
    return shouldAdd;
  }

  /**
   * Adiciona o salário do mês atual automaticamente
   * Usa a data baseada nas configurações (dia do salário)
   */
  addMonthlySalary(): Transaction | null {
    const settings = this.storageService.getSettings();
    
    console.log('💰 addMonthlySalary - CONFIGURAÇÕES:', {
      salary: settings.salary,
      salaryDay: settings.salaryDay,
      creditCardDueDay: settings.creditCardDueDay
    });
    
    if (!settings.salary || settings.salary <= 0) {
      console.log('❌ SALÁRIO NÃO CONFIGURADO');
      return null;
    }

    console.log('🔍 addMonthlySalary - ANTES DE CRIAR DATA:', {
      salaryDay: settings.salaryDay,
      currentDate: new Date().toString()
    });

    // Usa o método padronizado para criar a data do salário
    const salaryDate = this.utilsService.createSalaryDate(settings.salaryDay);
    
    console.log('🔍 addMonthlySalary - APÓS CRIAR DATA:', {
      salaryDay: settings.salaryDay,
      salaryDate,
      CORRETO: salaryDate.includes(`-${String(settings.salaryDay).padStart(2, '0')}`)
    });
    
    const salaryTransaction: Transaction = {
      id: this.utilsService.generateId(),
      description: 'Salário',
      amount: settings.salary,
      category: 'Salário',
      date: salaryDate,
      isCreditCard: false,
      createdAt: new Date()
    };

    console.log('💰 CRIANDO SALÁRIO:', {
      data: salaryDate,
      valor: settings.salary,
      dia: settings.salaryDay,
      transaction: salaryTransaction
    });

    // Adiciona a categoria de salário se não existir
    this.ensureSalaryCategoryExists();
    
    // Adiciona a transação
    this.storageService.addTransaction(salaryTransaction);
    
    console.log('✅ SALÁRIO ADICIONADO AO LOCALSTORAGE');
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

    if (salaryTransactions.length > 1) {
      // Ordena por data de criação (mais recente primeiro)
      salaryTransactions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      // Remove todos exceto o primeiro (mais recente)
      for (let i = 1; i < salaryTransactions.length; i++) {
        this.storageService.deleteTransaction(salaryTransactions[i].id);
      }
      
      console.log(`✅ Removidos ${salaryTransactions.length - 1} salários duplicados`);
    }
  }

  /**
   * Verifica e adiciona salário automaticamente se necessário
   * Retorna true se o salário foi adicionado
   */
  checkAndAddSalaryIfNeeded(): boolean {
    console.log('🔍 VERIFICANDO SALÁRIO...');
    
    // PRIMEIRO: limpa duplicatas
    this.cleanAllDuplicateSalaries();
    
    // SEGUNDO: verifica se já tem salário
    if (this.isSalaryAddedForCurrentMonth()) {
      console.log('✅ SALÁRIO JÁ EXISTE - NÃO ADICIONA');
      return false;
    }
    
    // TERCEIRO: se não tem salário, adiciona
    console.log('➕ ADICIONANDO NOVO SALÁRIO...');
    const transaction = this.addMonthlySalary();
    return transaction !== null;
  }

  /**
   * Encontra o salário existente do mês atual
   */
  findCurrentMonthSalary(): Transaction | null {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const transactions = this.storageService.getTransactions();
    
    console.log(`🔍 Procurando salário do mês atual:`, {
      mesAtual: currentMonth + 1,
      anoAtual: currentYear,
      totalTransacoes: transactions.length
    });
    
    const salaryTransactions = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      const isSalary = (transaction.description.toLowerCase() === 'salário' || 
                       transaction.category === 'Salário') &&
                      transaction.amount > 0;
      const isCurrentMonth = transactionDate.getMonth() === currentMonth &&
                            transactionDate.getFullYear() === currentYear;
      
      if (isSalary) {
        console.log(`💰 Salário encontrado:`, {
          id: transaction.id,
          data: transaction.date,
          mes: transactionDate.getMonth() + 1,
          ano: transactionDate.getFullYear(),
          valor: transaction.amount,
          isCurrentMonth: isCurrentMonth
        });
      }
      
      return isSalary && isCurrentMonth;
    });
    
    const result = salaryTransactions.length > 0 ? salaryTransactions[0] : null;
    console.log(`✅ Salário do mês atual:`, result ? 'Encontrado' : 'Não encontrado');
    
    return result;
  }

  /**
   * Atualiza o salário existente com novas configurações
   * Retorna true se o salário foi atualizado
   */
  updateExistingSalary(): boolean {
    const settings = this.storageService.getSettings();
    const existingSalary = this.findCurrentMonthSalary();
    
    if (!existingSalary) {
      console.log('❌ Nenhum salário existente encontrado para atualizar');
      return false;
    }
    
    if (!settings.salary || settings.salary <= 0) {
      console.log('❌ Salário não configurado ou inválido');
      return false;
    }

    // Usa o método padronizado para criar a nova data
    const newSalaryDate = this.utilsService.createSalaryDate(settings.salaryDay);

    // Verifica se precisa atualizar
    const needsUpdate = 
      existingSalary.amount !== settings.salary ||
      newSalaryDate !== existingSalary.date;

    console.log(`🔍 Verificando atualização:`, {
      valorAtual: existingSalary.amount,
      valorNovo: settings.salary,
      dataAtual: existingSalary.date,
      dataNova: newSalaryDate,
      precisaAtualizar: needsUpdate
    });

    if (!needsUpdate) {
      console.log('✅ Salário já está atualizado');
      return false;
    }

    // Atualiza o salário existente
    const updatedTransaction: Partial<Transaction> = {
      amount: settings.salary,
      date: newSalaryDate
    };

    this.storageService.updateTransaction(existingSalary.id, updatedTransaction);
    
    console.log('✅ SALÁRIO ATUALIZADO:', {
      valor: settings.salary,
      data: newSalaryDate,
      dia: settings.salaryDay
    });

    return true;
  }

  /**
   * Calcula a data do salário baseada nas configurações
   * Usa exatamente o dia configurado, mesmo em feriados
   */
  private getSalaryDateFromSettings(): string {
    const settings = this.storageService.getSettings();
    
    // Usa o método padronizado para criar a data
    const result = this.utilsService.createSalaryDate(settings.salaryDay);
    
    console.log(`📅 Data do salário calculada:`, {
      diaConfigurado: settings.salaryDay,
      dataFinal: result
    });
    
    return result;
  }

  /**
   * Sincroniza o salário com as configurações atuais
   * Atualiza salário existente ou cria novo se necessário
   */
  syncSalaryWithSettings(): boolean {
    console.log('🔄 SINCRONIZANDO SALÁRIO COM CONFIGURAÇÕES...');
    
    const settings = this.storageService.getSettings();
    
    // Se não há salário configurado, remove salários existentes
    if (!settings.salary || settings.salary <= 0) {
      console.log('❌ Salário não configurado - removendo salários existentes');
      this.removeCurrentMonthSalaries();
      return false;
    }

    // PRIMEIRO: limpa duplicatas
    this.cleanAllDuplicateSalaries();
    
    // SEGUNDO: verifica se existe salário no mês atual
    const existingSalary = this.findCurrentMonthSalary();
    
    if (existingSalary) {
      console.log('✅ Salário existente encontrado - atualizando...');
      return this.updateExistingSalary();
    } else {
      console.log('➕ Nenhum salário encontrado - criando novo...');
      const transaction = this.addMonthlySalary();
      return transaction !== null;
    }
  }

  /**
   * Sincroniza o salaryDay com base nas transações de salário existentes
   * Útil para corrigir inconsistências após refresh
   */
  syncSalaryDayFromExistingTransactions(): boolean {
    console.log('🔄 SINCRONIZANDO SALARY DAY COM TRANSAÇÕES EXISTENTES...');
    
    const settings = this.storageService.getSettings();
    const transactions = this.storageService.getTransactions();
    
    // Busca transações de salário
    const salaryTransactions = transactions.filter(transaction => 
      (transaction.description.toLowerCase() === 'salário' || 
       transaction.category === 'Salário') && 
      transaction.amount > 0
    );
    
    if (salaryTransactions.length === 0) {
      console.log('❌ Nenhuma transação de salário encontrada');
      return false;
    }
    
    // Pega a transação mais recente
    const latestSalary = salaryTransactions.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];
    
    // Extrai o dia da transação
    const extractedDay = this.utilsService.syncSalaryDayFromTransaction(latestSalary);
    
    console.log(`📅 Dia extraído da transação: ${extractedDay} (data: ${latestSalary.date})`);
    
    // Se o dia extraído é diferente do configurado, atualiza
    if (extractedDay !== settings.salaryDay) {
      console.log(`🔄 Atualizando salaryDay de ${settings.salaryDay} para ${extractedDay}`);
      
      const updatedSettings = {
        ...settings,
        salaryDay: extractedDay
      };
      
      this.storageService.saveSettings(updatedSettings);
      
      console.log('✅ SalaryDay sincronizado com transações existentes');
      return true;
    }
    
    console.log('✅ SalaryDay já está sincronizado');
    return false;
  }

  /**
   * Corrige a data da transação de salário existente para o dia correto
   */
  fixExistingSalaryDate(): boolean {
    console.log('🔧 CORRIGINDO DATA DA TRANSAÇÃO DE SALÁRIO EXISTENTE...');
    
    const settings = this.storageService.getSettings();
    const transactions = this.storageService.getTransactions();
    
    // Busca transações de salário
    const salaryTransactions = transactions.filter(transaction => 
      (transaction.description.toLowerCase() === 'salário' || 
       transaction.category === 'Salário') && 
      transaction.amount > 0
    );
    
    if (salaryTransactions.length === 0) {
      console.log('❌ Nenhuma transação de salário encontrada');
      return false;
    }
    
    let hasChanges = false;
    
    // Corrige cada transação de salário
    const updatedTransactions = transactions.map(transaction => {
      const isSalary = (transaction.description.toLowerCase() === 'salário' || 
                       transaction.category === 'Salário') && 
                      transaction.amount > 0;
      
      if (isSalary) {
        // Cria a data correta baseada no salaryDay configurado
        const correctDate = this.utilsService.createSalaryDate(settings.salaryDay);
        
        console.log(`🔧 Corrigindo transação:`, {
          id: transaction.id,
          dataAtual: transaction.date,
          dataCorreta: correctDate,
          precisaCorrigir: transaction.date !== correctDate
        });
        
        if (transaction.date !== correctDate) {
          hasChanges = true;
          return {
            ...transaction,
            date: correctDate
          };
        }
      }
      
      return transaction;
    });
    
    if (hasChanges) {
      this.storageService.saveTransactions(updatedTransactions);
      console.log('✅ Data da transação de salário corrigida!');
      return true;
    }
    
    console.log('✅ Transação de salário já está com data correta');
    return false;
  }

  /**
   * Remove todos os salários do mês atual
   */
  private removeCurrentMonthSalaries(): void {
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

    salaryTransactions.forEach(transaction => {
      this.storageService.deleteTransaction(transaction.id);
    });

    console.log(`Removidos ${salaryTransactions.length} salários do mês atual`);
  }

  /**
   * Limpa todos os salários duplicados de todos os meses
   * Mantém apenas um salário por mês, sempre na data correta
   */
  cleanAllDuplicateSalaries(): void {
    const settings = this.storageService.getSettings();
    const transactions = this.storageService.getTransactions();
    
    console.log('🧹 LIMPANDO TODOS OS SALÁRIOS DUPLICADOS...');
    
    // Agrupa salários por mês
    const salaryByMonth = new Map<string, any[]>();
    
    transactions.forEach(transaction => {
      if ((transaction.description.toLowerCase() === 'salário' || 
           transaction.category === 'Salário') && transaction.amount > 0) {
        const monthKey = transaction.date.slice(0, 7); // YYYY-MM
        
        if (!salaryByMonth.has(monthKey)) {
          salaryByMonth.set(monthKey, []);
        }
        salaryByMonth.get(monthKey)!.push(transaction);
      }
    });

    console.log(`🔍 Encontrados salários em ${salaryByMonth.size} meses diferentes`);

    // Para cada mês, mantém apenas um salário
    salaryByMonth.forEach((salaries, monthKey) => {
      if (salaries.length > 1) {
        console.log(`📅 Mês ${monthKey}: ${salaries.length} salários encontrados - REMOVENDO DUPLICATAS`);
        
        // Ordena por data de criação (mais recente primeiro)
        salaries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        
        // Remove todos exceto o primeiro
        for (let i = 1; i < salaries.length; i++) {
          console.log(`🗑️ Removendo: ${salaries[i].date} - R$ ${salaries[i].amount}`);
          this.storageService.deleteTransaction(salaries[i].id);
        }
        
        console.log(`✅ Mês ${monthKey}: Mantido 1 salário, removidos ${salaries.length - 1} duplicatas`);
      } else {
        console.log(`✅ Mês ${monthKey}: Apenas 1 salário (OK)`);
      }
    });
  }

  /**
   * Calcula a data correta do salário para um mês específico
   * Usa exatamente o dia configurado, mesmo em feriados
   */
  private getCorrectSalaryDateForMonth(monthKey: string): string {
    const settings = this.storageService.getSettings();
    const [year, month] = monthKey.split('-').map(Number);
    
    // Usa o método padronizado para criar a data
    const result = this.utilsService.createSalaryDate(settings.salaryDay, year, month - 1);
    
    console.log(`📅 Corrigindo data do salário para mês ${monthKey}:`, {
      diaConfigurado: settings.salaryDay,
      dataFinal: result
    });
    
    return result;
  }
}
