import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';

@Injectable({ providedIn: 'root' })
export class UtilsService {

  // ===== GERAÇÃO DE IDs =====
  generateId(): string {
    return uuidv4();
  }

  generateShortId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // ===== FORMATAÇÃO =====
  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

  formatDate(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('pt-BR').format(dateObj);
  }

  formatDateShort(date: Date | string): string {
    console.log(`🔍 formatDateShort - INPUT:`, {
      input: date,
      type: typeof date
    });
    
    // NOVO MÉTODO: Parse direto da string sem usar Date object
    let day: number;
    let month: number;
    
    if (typeof date === 'string') {
      // Parse direto da string YYYY-MM-DD
      const [year, monthStr, dayStr] = date.split('-').map(Number);
      day = dayStr;
      month = monthStr;
      
      console.log(`🔍 formatDateShort - PARSE DIRETO:`, {
        input: date,
        year, month, day,
        parsed: { year, month, day }
      });
    } else {
      // Se for Date object, extrai diretamente
      day = date.getDate();
      month = date.getMonth() + 1;
      
      console.log(`🔍 formatDateShort - DATE OBJECT:`, {
        input: date.toString(),
        day, month
      });
    }
    
    // Formata manualmente sem usar Date
    const dayStr = String(day).padStart(2, '0');
    const monthStr = String(month).padStart(2, '0');
    const result = `${dayStr}/${monthStr}`;
    
    console.log(`🔍 formatDateShort - RESULTADO FINAL:`, {
      input: date,
      day, month,
      dayStr, monthStr,
      result,
      CORRETO: result.includes('17') // Para dia 17
    });
    
    return result;
  }

  formatMonthYear(monthYear: string): string {
    const [year, month] = monthYear.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return new Intl.DateTimeFormat('pt-BR', {
      year: 'numeric',
      month: 'long'
    }).format(date);
  }

  // ===== VALIDAÇÕES =====
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  isValidAmount(amount: number): boolean {
    return typeof amount === 'number' && !isNaN(amount) && isFinite(amount);
  }

  isValidDate(date: string): boolean {
    const dateObj = new Date(date);
    return dateObj instanceof Date && !isNaN(dateObj.getTime());
  }

  isValidColor(color: string): boolean {
    const colorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    return colorRegex.test(color);
  }

  // ===== MANIPULAÇÃO DE DATAS =====
  getCurrentMonth(): string {
    return new Date().toISOString().slice(0, 7);
  }

  getCurrentDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  getMonthStart(month: string): Date {
    return new Date(month + '-01');
  }

  getMonthEnd(month: string): Date {
    const [year, monthNum] = month.split('-');
    return new Date(parseInt(year), parseInt(monthNum), 0);
  }

  getDaysInMonth(month: string): number {
    return this.getMonthEnd(month).getDate();
  }

  addMonths(month: string, months: number): string {
    const date = new Date(month + '-01');
    date.setMonth(date.getMonth() + months);
    return date.toISOString().slice(0, 7);
  }

  // ===== MANIPULAÇÃO DE ARRAYS =====
  groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
    return array.reduce((groups, item) => {
      const group = String(item[key]);
      groups[group] = groups[group] || [];
      groups[group].push(item);
      return groups;
    }, {} as Record<string, T[]>);
  }

  sortBy<T>(array: T[], key: keyof T, direction: 'asc' | 'desc' = 'asc'): T[] {
    return [...array].sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];
      
      if (aVal < bVal) return direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  }

  // ===== CÁLCULOS =====
  calculatePercentage(part: number, total: number): number {
    if (total === 0) return 0;
    return (part / total) * 100;
  }

  roundToDecimals(value: number, decimals: number = 2): number {
    return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
  }

  // ===== STRINGS =====
  capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }

  // ===== LOCAL STORAGE =====
  isLocalStorageAvailable(): boolean {
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }

  // ===== DEBOUNCE =====
  debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  // ===== DEEP CLONE =====
  deepClone<T>(obj: T): T {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime()) as any;
    if (obj instanceof Array) return obj.map(item => this.deepClone(item)) as any;
    if (typeof obj === 'object') {
      const clonedObj = {} as any;
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          clonedObj[key] = this.deepClone(obj[key]);
        }
      }
      return clonedObj;
    }
    return obj;
  }

  // ===== PADRONIZAÇÃO DE DATAS DE SALÁRIO =====
  
  /**
   * Cria uma data de salário padronizada baseada no dia configurado
   * @param salaryDay Dia do salário (1-31)
   * @param year Ano (opcional, usa o atual se não informado)
   * @param month Mês (opcional, usa o atual se não informado)
   * @returns Data no formato YYYY-MM-DD
   */
  createSalaryDate(salaryDay: number, year?: number, month?: number): string {
    const currentDate = new Date();
    const targetYear = year ?? currentDate.getFullYear();
    const targetMonth = month ?? currentDate.getMonth();
    
    console.log(`🔍 createSalaryDate - INPUT:`, {
      salaryDay,
      year: targetYear,
      month: targetMonth,
      currentDate: currentDate.toString()
    });
    
    // Valida se o dia existe no mês
    const lastDayOfMonth = new Date(targetYear, targetMonth + 1, 0).getDate();
    const validDay = Math.min(salaryDay, lastDayOfMonth);
    
    console.log(`🔍 createSalaryDate - VALIDAÇÃO:`, {
      lastDayOfMonth,
      validDay,
      originalDay: salaryDay
    });
    
    // CORREÇÃO: Usa timezone local para evitar diferença de 1 dia
    const salaryDate = new Date(targetYear, targetMonth, validDay);
    
    console.log(`🔍 createSalaryDate - DATE OBJECT:`, {
      salaryDate: salaryDate.toString(),
      getFullYear: salaryDate.getFullYear(),
      getMonth: salaryDate.getMonth(),
      getDate: salaryDate.getDate(),
      toISOString: salaryDate.toISOString()
    });
    
    // Formata a data no timezone local para evitar problemas de UTC
    const yearStr = salaryDate.getFullYear();
    const monthStr = String(salaryDate.getMonth() + 1).padStart(2, '0');
    const dayStr = String(salaryDate.getDate()).padStart(2, '0');
    
    const result = `${yearStr}-${monthStr}-${dayStr}`;
    
    console.log(`🔍 createSalaryDate - FORMATTING:`, {
      yearStr,
      monthStr,
      dayStr,
      result
    });
    
    console.log(`📅 createSalaryDate - RESULTADO FINAL:`, {
      input: { salaryDay, year: targetYear, month: targetMonth },
      validDay,
      result,
      dateObject: salaryDate.toString(),
      CORRETO: validDay === parseInt(dayStr)
    });
    
    return result;
  }

  /**
   * Extrai o dia de uma data de salário
   * @param dateString Data no formato YYYY-MM-DD
   * @returns Dia da data (1-31)
   */
  extractDayFromSalaryDate(dateString: string): number {
    // CORREÇÃO: Parse da data no timezone local para evitar problemas de UTC
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    
    const result = date.getDate();
    
    console.log(`📅 extractDayFromSalaryDate:`, {
      input: dateString,
      parsed: { year, month, day },
      result
    });
    
    return result;
  }

  /**
   * Verifica se uma data é de salário baseada no dia configurado
   * @param dateString Data no formato YYYY-MM-DD
   * @param salaryDay Dia configurado do salário
   * @returns true se a data corresponde ao dia do salário
   */
  isSalaryDate(dateString: string, salaryDay: number): boolean {
    const day = this.extractDayFromSalaryDate(dateString);
    return day === salaryDay;
  }

  /**
   * Sincroniza o salaryDay com base em uma transação de salário existente
   * @param salaryTransaction Transação de salário
   * @returns Dia extraído da transação
   */
  syncSalaryDayFromTransaction(salaryTransaction: { date: string }): number {
    return this.extractDayFromSalaryDate(salaryTransaction.date);
  }

  /**
   * Valida se um dia de salário é válido para um mês específico
   * @param salaryDay Dia do salário (1-31)
   * @param year Ano
   * @param month Mês (0-11)
   * @returns true se o dia é válido para o mês
   */
  isValidSalaryDay(salaryDay: number, year: number, month: number): boolean {
    const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
    return salaryDay >= 1 && salaryDay <= lastDayOfMonth;
  }

  /**
   * Obtém o último dia válido de um mês
   * @param year Ano
   * @param month Mês (0-11)
   * @returns Último dia do mês
   */
  getLastDayOfMonth(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate();
  }

  /**
   * Normaliza uma data de salário para o dia correto do mês
   * @param dateString Data no formato YYYY-MM-DD
   * @param salaryDay Dia desejado do salário
   * @returns Data normalizada
   */
  normalizeSalaryDate(dateString: string, salaryDay: number): string {
    // CORREÇÃO: Parse da data no timezone local
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    
    const result = this.createSalaryDate(salaryDay, date.getFullYear(), date.getMonth());
    
    console.log(`📅 normalizeSalaryDate:`, {
      input: { dateString, salaryDay },
      parsed: { year, month, day },
      result
    });
    
    return result;
  }

  /**
   * Testa a criação de datas para verificar se não há diferença de timezone
   * @param testDay Dia para testar
   */
  testDateCreation(testDay: number = 14): void {
    console.log(`🧪 TESTANDO CRIAÇÃO DE DATAS - Dia ${testDay}`);
    
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    console.log(`🧪 INFORMAÇÕES DO SISTEMA:`, {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      offset: new Date().getTimezoneOffset(),
      currentDate: currentDate.toString(),
      year,
      month: month + 1
    });
    
    // Testa criação de data
    const createdDate = this.createSalaryDate(testDay);
    const extractedDay = this.extractDayFromSalaryDate(createdDate);
    
    console.log(`🧪 RESULTADO DO TESTE:`, {
      diaSolicitado: testDay,
      dataCriada: createdDate,
      diaExtraido: extractedDay,
      sucesso: testDay === extractedDay
    });
    
    if (testDay === extractedDay) {
      console.log('✅ TESTE PASSOU - Datas estão corretas!');
    } else {
      console.log('❌ TESTE FALHOU - Ainda há problema de timezone!');
    }
  }

  /**
   * Debug completo do fluxo de datas
   */
  debugDateFlow(salaryDay: number): any {
    console.log(`🔍 DEBUG COMPLETO DO FLUXO DE DATAS - Dia ${salaryDay}`);
    
    // 1. Criação da data
    const createdDate = this.createSalaryDate(salaryDay);
    console.log(`1️⃣ Data criada: ${createdDate}`);
    
    // 2. Extração do dia
    const extractedDay = this.extractDayFromSalaryDate(createdDate);
    console.log(`2️⃣ Dia extraído: ${extractedDay}`);
    
    // 3. Verificação de consistência
    const isConsistent = salaryDay === extractedDay;
    console.log(`3️⃣ Consistente: ${isConsistent}`);
    
    // 4. Teste com diferentes métodos
    const [year, month, day] = createdDate.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);
    const dayFromDateObj = dateObj.getDate();
    
    console.log(`4️⃣ Teste manual:`, {
      year, month, day,
      dateObj: dateObj.toString(),
      dayFromDateObj,
      consistent: day === dayFromDateObj
    });
    
    return {
      originalDay: salaryDay,
      createdDate,
      extractedDay,
      isConsistent,
      dayFromDateObj
    };
  }

  /**
   * Testa o problema específico relatado pelo usuário
   * Simula o fluxo: config dia 14 -> home -> config
   */
  testUserProblem(): any {
    console.log('🚨 TESTANDO PROBLEMA DO USUÁRIO - Dia 14');
    
    // Simula o que acontece quando o usuário configura dia 14
    const userInputDay = 14;
    console.log(`👤 Usuário configura dia: ${userInputDay}`);
    
    // 1. Cria data como se fosse uma transação de salário
    const salaryDate = this.createSalaryDate(userInputDay);
    console.log(`📅 Data criada para salário: ${salaryDate}`);
    
    // 2. Simula o que acontece quando extrai o dia da transação
    const extractedDay = this.extractDayFromSalaryDate(salaryDate);
    console.log(`🔍 Dia extraído da transação: ${extractedDay}`);
    
    // 3. Simula o que acontece quando sincroniza de volta para config
    const syncedDay = extractedDay;
    console.log(`🔄 Dia sincronizado de volta: ${syncedDay}`);
    
    // 4. Verifica se há diferença
    const hasProblem = userInputDay !== syncedDay;
    console.log(`❌ PROBLEMA DETECTADO: ${hasProblem}`);
    
    if (hasProblem) {
      console.log(`🚨 ERRO: Usuário configurou ${userInputDay}, mas sistema está usando ${syncedDay}`);
      
      // Debug detalhado
      const [year, month, day] = salaryDate.split('-').map(Number);
      console.log(`🔍 DEBUG DETALHADO:`, {
        userInput: userInputDay,
        salaryDate,
        parsed: { year, month, day },
        extracted: extractedDay,
        synced: syncedDay,
        difference: userInputDay - syncedDay
      });
    } else {
      console.log(`✅ OK: Usuário configurou ${userInputDay} e sistema manteve ${syncedDay}`);
    }
    
    return {
      userInput: userInputDay,
      salaryDate,
      extractedDay,
      syncedDay,
      hasProblem
    };
  }

  /**
   * Teste específico para o problema do dia 14 -> dia 13
   */
  testSpecificProblem(): void {
    console.log('🎯 TESTE ESPECÍFICO - Dia 14 vira 13');
    
    const testDay = 14;
    console.log(`📝 Testando com dia: ${testDay}`);
    
    // Testa criação de data
    const createdDate = this.createSalaryDate(testDay);
    console.log(`📅 Data criada: ${createdDate}`);
    
    // Verifica se contém o dia correto
    const expectedDayStr = String(testDay).padStart(2, '0');
    const containsCorrectDay = createdDate.includes(`-${expectedDayStr}`);
    
    console.log(`🔍 Verificação:`, {
      testDay,
      createdDate,
      expectedDayStr,
      containsCorrectDay,
      PROBLEMA: !containsCorrectDay
    });
    
    if (!containsCorrectDay) {
      console.log('🚨 PROBLEMA CONFIRMADO: Data não contém o dia correto!');
      
      // Debug adicional
      const [year, month, day] = createdDate.split('-').map(Number);
      console.log('🔍 Análise da data criada:', {
        year, month, day,
        expectedDay: testDay,
        actualDay: day,
        difference: testDay - day
      });
    } else {
      console.log('✅ Data criada corretamente!');
    }
  }

  /**
   * Testa o problema de formatação: dados corretos mas exibição 1 dia atrás
   */
  testFormattingProblem(): void {
    console.log('🎯 TESTE DE FORMATAÇÃO - Dia 17 vira 16 na tela');
    
    // Simula o que está acontecendo: dados corretos mas exibição errada
    const correctDate = '2025-09-17';
    console.log(`📅 Data correta nos dados: ${correctDate}`);
    
    // Testa formatação
    const formattedDate = this.formatDateShort(correctDate);
    console.log(`📱 Data formatada para tela: ${formattedDate}`);
    
    // Verifica se há problema
    const hasProblem = !formattedDate.includes('17');
    console.log(`🔍 Verificação de formatação:`, {
      input: correctDate,
      output: formattedDate,
      expected: '17',
      hasProblem
    });
    
    if (hasProblem) {
      console.log('🚨 PROBLEMA DE FORMATAÇÃO CONFIRMADO!');
      console.log('💡 A data está correta nos dados, mas a formatação está 1 dia atrás');
    } else {
      console.log('✅ Formatação funcionando corretamente!');
    }
  }

  /**
   * Testa formatação com diferentes datas para confirmar correção
   */
  testMultipleDates(): void {
    console.log('🧪 TESTE COM MÚLTIPLAS DATAS');
    
    const testDates = [
      '2025-09-17', // Dia 17
      '2025-09-14', // Dia 14
      '2025-09-01', // Dia 1
      '2025-09-30'  // Dia 30
    ];
    
    testDates.forEach(dateStr => {
      const formatted = this.formatDateShort(dateStr);
      const [year, month, day] = dateStr.split('-').map(Number);
      const expected = `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}`;
      
      console.log(`📅 Teste:`, {
        input: dateStr,
        expected,
        actual: formatted,
        correto: formatted === expected
      });
    });
  }
}
