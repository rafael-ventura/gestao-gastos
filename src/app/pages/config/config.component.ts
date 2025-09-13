import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ConfigFormComponent } from './components/config-form/config-form.component';
import { CategoriesManagerComponent } from './components/categories-manager/categories-manager.component';

import { StorageService } from '../../core/services/storage.service';
import { UtilsService } from '../../core/services/utils.service';
import { SalaryService } from '../../core/services/salary.service';
import { Settings } from '../../core/models/settings.model';
import { Category } from '../../core/models/category.model';

@Component({
  selector: 'app-config',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    ConfigFormComponent,
    CategoriesManagerComponent
  ],
  templateUrl: './config.component.html',
  styleUrl: './config.component.scss'
})
export class ConfigComponent implements OnInit {
  private storageService = inject(StorageService);
  private utilsService = inject(UtilsService);
  private salaryService = inject(SalaryService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  // Dados
  settings!: Settings;
  categories: Category[] = [];
  
  // Estados
  loading = false;
  hasChanges = false;
  autoSaveEnabled = true;

  // Dados dos formulários
  configData: any = {};
  categoriesData: Category[] = [];

  ngOnInit() {
    this.loadSettings();
  }

  loadSettings() {
    this.settings = this.storageService.getSettings();
    this.categories = [...this.settings.categories];
    this.categoriesData = [...this.categories];
    
    // Inicializa os dados do formulário com os valores salvos
    this.configData = {
      salary: this.settings.salary,
      salaryDay: this.settings.salaryDay,
      creditCardDueDay: this.settings.creditCardDueDay
    };
    
    // Debug: Verificar configurações carregadas
    console.log('🔍 DEBUG - Config Component:');
    console.log('📊 Settings loaded:', this.settings);
    console.log('💰 Salary from settings:', this.settings.salary);
    console.log('📅 Salary day from settings:', this.settings.salaryDay);
    console.log('💳 Credit card due day:', this.settings.creditCardDueDay);
    console.log('📝 Config data initialized:', this.configData);
    
    // Verificar transações de salário existentes
    const transactions = this.storageService.getTransactions();
    const salaryTransactions = transactions.filter(t => 
      t.category === 'Salário' || t.description.toLowerCase() === 'salário'
    );
    console.log('💳 Existing salary transactions:', salaryTransactions);
  }

  // ===== HANDLERS DOS SUBCOMPONENTES =====
  onConfigFormChange(data: any) {
    this.configData = data;
    this.hasChanges = true;
    if (this.autoSaveEnabled) {
      this.autoSave();
    }
  }

  onCategoriesChange(categories: Category[]) {
    this.categoriesData = categories;
    this.hasChanges = true;
    if (this.autoSaveEnabled) {
      this.autoSave();
    }
  }

  // ===== SALVAR CONFIGURAÇÕES =====
  saveConfig() {
    this.loading = true;

    try {
      // Armazena valores anteriores para comparação
      const previousSalary = this.settings.salary;
      const previousSalaryDay = this.settings.salaryDay;

      // Atualiza configurações principais
      this.settings.salary = this.configData.salary || 0;
      this.settings.salaryDay = this.configData.salaryDay;
      this.settings.creditCardDueDay = this.configData.creditCardDueDay;

      // Atualiza categorias
      this.settings.categories = this.categoriesData.map((cat: Category) => ({
        id: cat.id,
        name: cat.name.trim(),
        color: cat.color
      }));

      // Salva no storage
      this.storageService.saveSettings(this.settings);
      
      // Sincroniza salário se houve mudanças relevantes
      this.syncSalaryIfNeeded(previousSalary, previousSalaryDay);
      
      this.hasChanges = false;
      this.snackBar.open('Configurações salvas com sucesso!', 'Fechar', { duration: 3000 });
      
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      this.snackBar.open('Erro ao salvar configurações', 'Fechar', { duration: 3000 });
    } finally {
      this.loading = false;
    }
  }

  /**
   * Sincroniza o salário se houve mudanças relevantes
   */
  private syncSalaryIfNeeded(previousSalary: number, previousSalaryDay: number): void {
    const currentSalary = this.settings.salary;
    const currentSalaryDay = this.settings.salaryDay;

    // Verifica se houve mudanças no salário ou no dia
    const salaryChanged = previousSalary !== currentSalary;
    const salaryDayChanged = previousSalaryDay !== currentSalaryDay;

    if (salaryChanged || salaryDayChanged) {
      try {
        const updated = this.salaryService.syncSalaryWithSettings();
        
        if (updated) {
          const salaryAmount = this.utilsService.formatCurrency(currentSalary);
          const salaryDay = currentSalaryDay;
          
          this.snackBar.open(
            `Salário atualizado: ${salaryAmount} no dia ${salaryDay} 💰`,
            'Ver',
            { 
              duration: 4000,
              panelClass: ['success-snackbar']
            }
          );
        }
      } catch (error) {
        console.error('Erro ao sincronizar salário:', error);
        // Não mostra erro para o usuário, pois é uma funcionalidade secundária
      }
    }
  }

  resetConfig() {
    if (this.hasChanges) {
      // TODO: Implementar dialog de confirmação
      this.loadSettings();
      this.hasChanges = false;
      this.snackBar.open('Configurações restauradas', 'Fechar', { duration: 2000 });
    }
  }

  // ===== UTILITÁRIOS =====
  formatCurrency(value: number): string {
    return this.utilsService.formatCurrency(value);
  }

  onEnterKey(): void {
    if (!this.loading) {
      this.saveConfig();
    }
  }

  private autoSave() {
    // Debounce para evitar muitas chamadas
    setTimeout(() => {
      if (this.hasChanges && !this.loading) {
        this.saveConfig();
      }
    }, 2000); // Salva automaticamente após 2 segundos de inatividade
  }

  // ===== BACKUP E RESTORE =====
  exportData() {
    try {
      const data = this.storageService.exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `gastos-backup-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      window.URL.revokeObjectURL(url);
      
      this.snackBar.open('Dados exportados com sucesso!', 'Fechar', { duration: 3000 });
    } catch (error) {
      console.error('Erro ao exportar dados:', error);
      this.snackBar.open('Erro ao exportar dados', 'Fechar', { duration: 3000 });
    }
  }

  importData() {
    // Simula clique no input file
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      try {
        const jsonData = e.target.result;
        const success = this.storageService.importData(jsonData);
        
        if (success) {
          this.loadSettings();
          this.snackBar.open('Dados importados com sucesso!', 'Fechar', { duration: 3000 });
        } else {
          this.snackBar.open('Erro ao importar dados - arquivo inválido', 'Fechar', { duration: 3000 });
        }
      } catch (error) {
        console.error('Erro ao ler arquivo:', error);
        this.snackBar.open('Erro ao ler arquivo', 'Fechar', { duration: 3000 });
      }
    };
    
    reader.readAsText(file);
  }

}

