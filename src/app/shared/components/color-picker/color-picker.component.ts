import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-color-picker',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatTooltipModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ColorPickerComponent),
      multi: true
    }
  ],
  template: `
    <div class="color-picker-container" [class.compact]="compact">
      
      <!-- Cores Pastéis Sugeridas -->
      <div class="suggested-colors">
        <div class="colors-grid">
          <button
            *ngFor="let color of suggestedColors"
            type="button"
            class="color-button"
            [class.selected]="selectedColor === color"
            [style.background-color]="color"
            [matTooltip]="getColorName(color)"
            (click)="selectColor(color)">
            <mat-icon *ngIf="selectedColor === color" class="check-icon">check</mat-icon>
          </button>
          
          <!-- Botão para Cor Personalizada -->
          <button
            type="button"
            class="color-button custom-button"
            [class.selected]="isCustomColor"
            (click)="openCustomPicker()"
            matTooltip="Escolher cor personalizada">
            <mat-icon class="custom-icon">palette</mat-icon>
          </button>
        </div>
      </div>

      <!-- Input de cor personalizada (oculto) -->
      <input
        #colorInput
        type="color"
        class="hidden-color-input"
        [value]="selectedColor"
        (input)="onCustomColorChange($event)">

      <!-- Preview da cor selecionada (apenas se não for compacto) -->
      <div class="selected-preview" *ngIf="!compact && selectedColor">
        <div class="preview-dot" [style.background-color]="selectedColor"></div>
        <span class="preview-text">{{ getColorName(selectedColor) || selectedColor }}</span>
      </div>
      
    </div>
  `,
  styles: [`
    .color-picker-container {
      padding: 12px;
      
      &.compact {
        padding: 8px;
      }
    }

    .suggested-colors {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .colors-grid {
      display: grid;
      grid-template-columns: repeat(8, 1fr);
      gap: 8px;
      
      .color-picker-container.compact & {
        grid-template-columns: repeat(6, 1fr);
        gap: 6px;
      }
    }

    .color-button {
      width: 36px;
      height: 36px;
      border: 2px solid var(--gray-200);
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
      box-shadow: var(--shadow-xs);
      
      .color-picker-container.compact & {
        width: 32px;
        height: 32px;
        border-radius: 10px;
      }
      
      &:hover {
        transform: translateY(-2px) scale(1.05);
        border-color: var(--gray-300);
        box-shadow: var(--shadow-md);
      }
      
      &.selected {
        border-color: var(--primary-400);
        border-width: 3px;
        transform: translateY(-2px) scale(1.1);
        box-shadow: 0 0 0 3px var(--primary-100), var(--shadow-lg);
      }
      
      .check-icon {
        color: white;
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
        font-size: 18px;
        width: 18px;
        height: 18px;
        
        .color-picker-container.compact & {
          font-size: 16px;
          width: 16px;
          height: 16px;
        }
      }
    }

    .custom-button {
      background: linear-gradient(135deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #ffeaa7, #dda0dd);
      background-size: 200% 200%;
      animation: gradientShift 3s ease infinite;
      
      .custom-icon {
        color: white;
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
        font-size: 18px;
        width: 18px;
        height: 18px;
        
        .color-picker-container.compact & {
          font-size: 16px;
          width: 16px;
          height: 16px;
        }
      }
      
      &:hover {
        animation-duration: 1s;
      }
      
      &.selected {
        border-color: var(--primary-400);
        animation-duration: 0.5s;
      }
    }

    .hidden-color-input {
      position: absolute;
      left: -9999px;
      opacity: 0;
      pointer-events: none;
    }

    .selected-preview {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-top: 16px;
      padding-top: 12px;
      border-top: 1px solid var(--gray-200);
    }

    .preview-dot {
      width: 20px;
      height: 20px;
      border: 2px solid var(--gray-200);
      border-radius: 50%;
      box-shadow: var(--shadow-xs);
    }

    .preview-text {
      font-size: 0.875rem;
      color: var(--gray-700);
      font-weight: 500;
    }

    @keyframes gradientShift {
      0% {
        background-position: 0% 50%;
      }
      50% {
        background-position: 100% 50%;
      }
      100% {
        background-position: 0% 50%;
      }
    }
    
    // Responsivo
    @media (max-width: 768px) {
      .colors-grid {
        grid-template-columns: repeat(6, 1fr);
        gap: 6px;
      }
      
      .color-button {
        width: 32px;
        height: 32px;
        
        &:hover {
          transform: scale(1.05);
        }
        
        &.selected {
          transform: scale(1.1);
        }
      }
    }
  `]
})
export class ColorPickerComponent implements ControlValueAccessor {
  @Input() compact = false;
  @Input() value = '#FFB3BA';

  @Output() colorSelected = new EventEmitter<string>();

  selectedColor = '#FFB3BA';

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
    if (value) {
      this.selectedColor = value;
      this.value = value;
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  selectColor(color: string): void {
    this.selectedColor = color;
    this.onChange(color);
    this.onTouched();
    this.colorSelected.emit(color);
  }

  openCustomPicker(): void {
    // Simula um clique no input de cor oculto
    const colorInput = document.querySelector('.hidden-color-input') as HTMLInputElement;
    if (colorInput) {
      colorInput.click();
    }
  }

  onCustomColorChange(event: any): void {
    const color = event.target.value;
    this.selectColor(color);
  }

  getColorName(color: string): string {
    return this.colorNames[color] || '';
  }
}
