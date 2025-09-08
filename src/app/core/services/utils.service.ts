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
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit'
    }).format(dateObj);
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
}
