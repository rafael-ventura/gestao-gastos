import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { ColorPickerComponent } from '../../shared/components/color-picker/color-picker.component';

import { StorageService } from '../../core/services/storage.service';
import { UtilsService } from '../../core/services/utils.service';
import { Settings } from '../../core/models/settings.model';
import { Category } from '../../core/models/category.model';

@Component({
  selector: 'app-config',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatTooltipModule,
    ColorPickerComponent
  ],
  templateUrl: './config.component.html',
  styleUrl: './config.component.scss'
})
export class ConfigComponent implements OnInit {
  private storageService = inject(StorageService);
  private utilsService = inject(UtilsService);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  // Formulários
  configForm!: FormGroup;
  categoriesForm!: FormGroup;

  // Dados
  settings!: Settings;
  categories: Category[] = [];
  
  // Estados
  loading = false;
  hasChanges = false;
  autoSaveEnabled = true;

  // Opções
  days = Array.from({length: 31}, (_, i) => i + 1);
  colorPresets = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
    '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2'
  ];

  ngOnInit() {
    this.loadSettings();
    this.initializeForms();
  }

  loadSettings() {
    this.settings = this.storageService.getSettings();
    this.categories = [...this.settings.categories];
  }

  initializeForms() {
    // Formulário principal de configurações
    this.configForm = this.fb.group({
      salary: [this.settings.salary, [Validators.min(0)]],
      salaryDay: [this.settings.salaryDay, [Validators.required, Validators.min(1), Validators.max(31)]],
      creditCardDueDay: [this.settings.creditCardDueDay, [Validators.required, Validators.min(1), Validators.max(31)]]
    });

    // Formulário de categorias
    this.categoriesForm = this.fb.group({
      categories: this.fb.array([])
    });

    this.populateCategoriesForm();

    // Detecta mudanças
    this.configForm.valueChanges.subscribe(() => {
      this.hasChanges = true;
      if (this.autoSaveEnabled) {
        this.autoSave();
      }
    });
    this.categoriesForm.valueChanges.subscribe(() => {
      this.hasChanges = true;
      if (this.autoSaveEnabled) {
        this.autoSave();
      }
    });
  }

  populateCategoriesForm() {
    const categoriesArray = this.categoriesForm.get('categories') as FormArray;
    categoriesArray.clear();

    this.categories.forEach(category => {
      categoriesArray.push(this.createCategoryFormGroup(category));
    });
  }

  createCategoryFormGroup(category: Category): FormGroup {
    return this.fb.group({
      id: [category.id],
      name: [category.name, [Validators.required, Validators.minLength(2)]],
      color: [category.color, [Validators.required, this.utilsService.isValidColor.bind(this.utilsService)]]
    });
  }

  get categoriesArray(): FormArray {
    return this.categoriesForm.get('categories') as FormArray;
  }

  // ===== AÇÕES DE CATEGORIAS =====
  addCategory() {
    const newCategory: Category = {
      id: this.utilsService.generateId(),
      name: 'Nova Categoria',
      color: this.getRandomColor()
    };

    this.categories.push(newCategory);
    this.categoriesArray.push(this.createCategoryFormGroup(newCategory));
    this.hasChanges = true;
  }

  removeCategory(index: number) {
    if (this.categories.length <= 1) {
      this.snackBar.open('Deve haver pelo menos uma categoria', 'Fechar', { duration: 3000 });
      return;
    }

    this.categories.splice(index, 1);
    this.categoriesArray.removeAt(index);
    this.hasChanges = true;
  }

  duplicateCategory(index: number) {
    const originalCategory = this.categories[index];
    const duplicatedCategory: Category = {
      id: this.utilsService.generateId(),
      name: `${originalCategory.name} (Cópia)`,
      color: originalCategory.color
    };

    this.categories.splice(index + 1, 0, duplicatedCategory);
    this.categoriesArray.insert(index + 1, this.createCategoryFormGroup(duplicatedCategory));
    this.hasChanges = true;
  }

  // ===== SALVAR CONFIGURAÇÕES =====
  saveConfig() {
    this.loading = true;

    // Verifica se há erros de validação
    const hasErrors = this.configForm.invalid || this.categoriesForm.invalid;
    if (hasErrors) {
      this.snackBar.open('Atenção: Há erros no formulário, mas as configurações válidas serão salvas', 'Fechar', { duration: 4000 });
    }

    try {
      // Atualiza configurações principais
      const configData = this.configForm.value;
      this.settings.salary = configData.salary || 0;
      this.settings.salaryDay = configData.salaryDay;
      this.settings.creditCardDueDay = configData.creditCardDueDay;

      // Atualiza categorias
      const categoriesData = this.categoriesForm.value.categories;
      this.settings.categories = categoriesData.map((cat: any) => ({
        id: cat.id,
        name: cat.name.trim(),
        color: cat.color
      }));

      // Salva no storage
      this.storageService.saveSettings(this.settings);
      
      this.hasChanges = false;
      this.snackBar.open('Configurações salvas com sucesso!', 'Fechar', { duration: 3000 });
      
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      this.snackBar.open('Erro ao salvar configurações', 'Fechar', { duration: 3000 });
    } finally {
      this.loading = false;
    }
  }

  resetConfig() {
    if (this.hasChanges) {
      // TODO: Implementar dialog de confirmação
      this.loadSettings();
      this.initializeForms();
      this.hasChanges = false;
      this.snackBar.open('Configurações restauradas', 'Fechar', { duration: 2000 });
    }
  }

  // ===== UTILITÁRIOS =====
  getRandomColor(): string {
    return this.colorPresets[Math.floor(Math.random() * this.colorPresets.length)];
  }

  formatCurrency(value: number): string {
    return this.utilsService.formatCurrency(value);
  }

  // ===== VALIDAÇÕES =====
  hasFormErrors(): boolean {
    return this.configForm.invalid || this.categoriesForm.invalid;
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
          this.initializeForms();
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

  getCategoryError(index: number, field: string): string {
    const categoryGroup = this.categoriesArray.at(index);
    const fieldControl = categoryGroup.get(field);
    
    if (fieldControl?.errors) {
      if (fieldControl.errors['required']) return 'Campo obrigatório';
      if (fieldControl.errors['minlength']) return 'Mínimo 2 caracteres';
      if (fieldControl.errors['min']) return 'Valor inválido';
      if (fieldControl.errors['max']) return 'Valor inválido';
    }
    
    return '';
  }

  getConfigError(field: string): string {
    const fieldControl = this.configForm.get(field);
    
    if (fieldControl?.errors) {
      if (fieldControl.errors['required']) return 'Campo obrigatório';
      if (fieldControl.errors['min']) return 'Valor deve ser positivo';
      if (fieldControl.errors['max']) return 'Valor inválido';
    }
    
    return '';
  }
}

