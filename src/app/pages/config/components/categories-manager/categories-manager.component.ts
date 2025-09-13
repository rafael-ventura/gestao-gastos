import { Component, Input, Output, EventEmitter, OnInit, forwardRef, ChangeDetectorRef, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray, ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { FormInputComponent } from '../../../../shared/components/form-input/form-input.component';
import { UtilsService } from '../../../../core/services/utils.service';
import { Category } from '../../../../core/models/category.model';

@Component({
  selector: 'app-categories-manager',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    FormInputComponent
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CategoriesManagerComponent),
      multi: true
    }
  ],
  templateUrl: './categories-manager.component.html',
  styleUrls: ['./categories-manager.component.scss']
})
export class CategoriesManagerComponent implements OnInit, ControlValueAccessor {
  @Input() categories: Category[] = [];
  @Output() categoriesChange = new EventEmitter<Category[]>();

  categoriesForm!: FormGroup;
  private fb = new FormBuilder();
  private utilsService = new UtilsService();

  // 18 cores fixas variadas e bonitas
  availableColors = [
    '#FF6B6B', // Vermelho pastel
    '#4ECDC4', // Turquesa
    '#45B7D1', // Azul claro
    '#96CEB4', // Verde menta
    '#FFEAA7', // Amarelo pastel
    '#DDA0DD', // Roxo claro
    '#98D8C8', // Verde água
    '#F7DC6F', // Amarelo dourado
    '#BB8FCE', // Lilás
    '#85C1E9', // Azul céu
    '#F8C471', // Laranja pastel
    '#82E0AA', // Verde claro
    '#F1948A', // Rosa salmão
    '#D7BDE2', // Lavanda
    '#A9DFBF', // Verde menta claro
    '#F9E79F', // Amarelo creme
    '#D5A6BD', // Rosa pálido
    '#B8C6DB'  // Cinza azulado
  ];

  constructor(private cdr: ChangeDetectorRef) {}

  // ControlValueAccessor
  private onChange = (value: Category[]) => {};
  private onTouched = () => {};

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    this.categoriesForm = this.fb.group({
      categories: this.fb.array([])
    });

    this.populateCategoriesForm();

    // Emite mudanças
    this.categoriesForm.valueChanges.subscribe(value => {
      const categories = value.categories.map((cat: any) => ({
        id: cat.id,
        name: cat.name.trim(),
        color: cat.color
      }));
      this.onChange(categories);
      this.categoriesChange.emit(categories);
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
  }

  removeCategory(index: number) {
    if (this.categories.length <= 1) {
      return;
    }

    this.categories.splice(index, 1);
    this.categoriesArray.removeAt(index);
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
  }

  getRandomColor(): string {
    return this.availableColors[Math.floor(Math.random() * this.availableColors.length)];
  }

  onColorChange(index: number, newColor: string): void {
    console.log(`Mudando cor da categoria ${index} para:`, newColor);
    
    // Atualiza o valor no form control
    const categoryGroup = this.categoriesArray.at(index);
    categoryGroup.get('color')?.setValue(newColor);
    
    // Atualiza também no array de categorias para sincronização
    if (this.categories[index]) {
      this.categories[index].color = newColor;
    }
    
    // Força a detecção de mudanças para atualizar a UI
    this.categoriesForm.markAsDirty();
    this.cdr.detectChanges();
    
    // Emite as mudanças
    this.onChange(this.categories);
    this.categoriesChange.emit(this.categories);
    
    console.log('Cor atualizada:', categoryGroup.get('color')?.value);
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

  // ControlValueAccessor implementation
  writeValue(value: Category[]): void {
    if (value) {
      this.categories = [...value];
      this.populateCategoriesForm();
    }
  }

  registerOnChange(fn: (value: Category[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.categoriesForm.disable();
    } else {
      this.categoriesForm.enable();
    }
  }

  get formValue() {
    return this.categoriesForm.value;
  }

  get isValid() {
    return this.categoriesForm.valid;
  }
}
