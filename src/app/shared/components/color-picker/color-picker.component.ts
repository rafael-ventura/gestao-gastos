import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-color-picker',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ColorPickerComponent),
      multi: true
    }
  ],
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss']
})
export class ColorPickerComponent implements ControlValueAccessor {
  @Input() compact = false;
  @Input() value = '#FFB3BA';

  @Output() colorSelected = new EventEmitter<string>();

  selectedColor = '#FFB3BA';
  componentId = Math.random().toString(36).substr(2, 9);

  // Cores pastéis sugeridas - mais modernas e suaves
  suggestedColors = [
    '#FFB3BA', // Rosa suave
    '#FFDFBA', // Pêssego
    '#FFFFBA', // Amarelo claro
    '#BAFFC9', // Verde menta
    '#BAE1FF', // Azul bebê
    '#D4BAFF', // Lilás
    '#FFB3E6', // Rosa vibrante
    '#B3FFF7', // Turquesa claro
    '#FFC9B3', // Laranja suave
    '#C9FFB3', // Verde claro
    '#E1B3FF', // Roxo claro
    '#FFE1B3', // Amarelo pêssego
    '#B3FFE1', // Verde água
    '#B3C9FF', // Azul periwinkle
    '#F0B3FF'  // Rosa lavanda
  ];

  // Nomes amigáveis para as cores
  private colorNames: {[key: string]: string} = {
    '#FFB3BA': 'Rosa Suave',
    '#FFDFBA': 'Pêssego',
    '#FFFFBA': 'Amarelo Claro',
    '#BAFFC9': 'Verde Menta',
    '#BAE1FF': 'Azul Bebê',
    '#D4BAFF': 'Lilás',
    '#FFB3E6': 'Rosa Vibrante',
    '#B3FFF7': 'Turquesa Claro',
    '#FFC9B3': 'Laranja Suave',
    '#C9FFB3': 'Verde Claro',
    '#E1B3FF': 'Roxo Claro',
    '#FFE1B3': 'Amarelo Pêssego',
    '#B3FFE1': 'Verde Água',
    '#B3C9FF': 'Azul Periwinkle',
    '#F0B3FF': 'Rosa Lavanda'
  };

  // ControlValueAccessor
  private onChange = (value: string) => {};
  private onTouched = () => {};

  get isCustomColor(): boolean {
    return !this.suggestedColors.includes(this.selectedColor);
  }

  writeValue(value: string): void {
    console.log('Color picker - writeValue chamado com:', value);
    if (value) {
      this.selectedColor = value;
      this.value = value;
      
      // Adiciona cor customizada à lista se não existir
      this.addCustomColorIfNeeded(value);
    } else {
      // Se não há valor, usa a primeira cor sugerida
      this.selectedColor = this.suggestedColors[0];
      this.value = this.suggestedColors[0];
    }
    console.log('Color picker - selectedColor definido para:', this.selectedColor);
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  selectColor(color: string): void {
    console.log('Color picker - selecionando cor:', color);
    this.selectedColor = color;
    this.value = color;
    this.onChange(color);
    this.onTouched();
    this.colorSelected.emit(color);
  }

  onNgModelChange(color: string): void {
    console.log('Color picker - ngModelChange:', color);
    this.selectedColor = color;
    this.value = color;
    this.onChange(color);
    this.onTouched();
  }

  openCustomPicker(): void {
    // Usa o ID único para encontrar o input de cor específico deste componente
    const colorInput = document.getElementById('color-input-' + this.componentId) as HTMLInputElement;
    if (colorInput) {
      colorInput.click();
    } else {
      console.warn('Color input not found with ID:', 'color-input-' + this.componentId);
    }
  }

  onCustomColorChange(event: any): void {
    const color = event.target.value;
    this.addCustomColorIfNeeded(color);
    this.selectColor(color);
  }

  addCustomColorIfNeeded(color: string): void {
    // Adiciona cor customizada à lista se não existir
    if (color && !this.suggestedColors.includes(color)) {
      this.suggestedColors.push(color);
      
      // Adiciona nome genérico para cor customizada
      this.colorNames[color] = `Cor Personalizada`;
    }
  }

  getColorName(color: string): string {
    return this.colorNames[color] || 'Cor Personalizada';
  }
}