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
    <div class="color-picker-container">
      <div class="color-palette">
        <!-- Tons Pastéis -->
        <div class="color-section" *ngIf="showPastels">
          <h4 class="section-title">Tons Pastéis</h4>
          <div class="color-grid">
            <button
              *ngFor="let color of pastelColors"
              type="button"
              class="color-option"
              [class.selected]="selectedColor === color"
              [style.background-color]="color"
              [matTooltip]="color"
              (click)="selectColor(color)">
              <mat-icon *ngIf="selectedColor === color">check</mat-icon>
            </button>
          </div>
        </div>

        <!-- Tons Vibrantes -->
        <div class="color-section" *ngIf="showVibrant">
          <h4 class="section-title">Tons Vibrantes</h4>
          <div class="color-grid">
            <button
              *ngFor="let color of vibrantColors"
              type="button"
              class="color-option"
              [class.selected]="selectedColor === color"
              [style.background-color]="color"
              [matTooltip]="color"
              (click)="selectColor(color)">
              <mat-icon *ngIf="selectedColor === color">check</mat-icon>
            </button>
          </div>
        </div>

        <!-- Tons Neutros -->
        <div class="color-section" *ngIf="showNeutrals">
          <h4 class="section-title">Tons Neutros</h4>
          <div class="color-grid">
            <button
              *ngFor="let color of neutralColors"
              type="button"
              class="color-option"
              [class.selected]="selectedColor === color"
              [style.background-color]="color"
              [matTooltip]="color"
              (click)="selectColor(color)">
              <mat-icon *ngIf="selectedColor === color">check</mat-icon>
            </button>
          </div>
        </div>

        <!-- Cor Personalizada -->
        <div class="color-section custom-section" *ngIf="showCustom">
          <h4 class="section-title">Cor Personalizada</h4>
          <div class="custom-color-container">
            <input
              type="color"
              class="custom-color-input"
              [value]="selectedColor"
              (input)="onCustomColorChange($event)"
              [matTooltip]="'Escolher cor personalizada'">
            <div class="custom-color-preview" [style.background-color]="selectedColor"></div>
          </div>
        </div>
      </div>

      <!-- Preview da cor selecionada -->
      <div class="selected-color-preview" *ngIf="selectedColor">
        <div class="preview-container">
          <div class="preview-color" [style.background-color]="selectedColor"></div>
          <div class="preview-info">
            <span class="preview-label">Cor selecionada:</span>
            <span class="preview-value">{{ selectedColor }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .color-picker-container {
      padding: 8px;
    }

    .color-section {
      margin-bottom: 16px;
    }

    .section-title {
      font-size: 12px;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.6);
      margin: 0 0 8px 0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .color-grid {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      gap: 6px;
    }

    .color-option {
      width: 32px;
      height: 32px;
      border: 2px solid rgba(0, 0, 0, 0.1);
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
    }

    .color-option:hover {
      transform: scale(1.1);
      border-color: rgba(0, 0, 0, 0.3);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    }

    .color-option.selected {
      border-color: #1976d2;
      border-width: 3px;
      transform: scale(1.1);
      box-shadow: 0 2px 8px rgba(25, 118, 210, 0.3);
    }

    .color-option mat-icon {
      color: white;
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    .custom-section {
      border-top: 1px solid rgba(0, 0, 0, 0.1);
      padding-top: 12px;
    }

    .custom-color-container {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .custom-color-input {
      width: 40px;
      height: 32px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      padding: 0;
    }

    .custom-color-input::-webkit-color-swatch-wrapper {
      padding: 0;
    }

    .custom-color-input::-webkit-color-swatch {
      border: none;
      border-radius: 8px;
    }

    .custom-color-preview {
      width: 32px;
      height: 32px;
      border: 2px solid rgba(0, 0, 0, 0.1);
      border-radius: 8px;
    }

    .selected-color-preview {
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px solid rgba(0, 0, 0, 0.1);
    }

    .preview-container {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .preview-color {
      width: 24px;
      height: 24px;
      border: 2px solid rgba(0, 0, 0, 0.1);
      border-radius: 6px;
    }

    .preview-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .preview-label {
      font-size: 11px;
      color: rgba(0, 0, 0, 0.6);
      font-weight: 500;
    }

    .preview-value {
      font-size: 12px;
      color: rgba(0, 0, 0, 0.87);
      font-family: monospace;
      font-weight: 500;
    }
  `]
})
export class ColorPickerComponent implements ControlValueAccessor {
  @Input() showPastels = true;
  @Input() showVibrant = false;
  @Input() showNeutrals = false;
  @Input() showCustom = true;
  @Input() compact = false;
  @Input() value = '#FF6B6B';

  @Output() colorSelected = new EventEmitter<string>();

  selectedColor = '#FF6B6B';

  // Tons pastéis suaves e agradáveis
  pastelColors = [
    '#FFB3BA', '#FFDFBA', '#FFFFBA', '#BAFFC9', '#BAE1FF', '#D4BAFF',
    '#FFB3E6', '#FFB3C1', '#FFC9B3', '#C9FFB3', '#B3FFF7', '#B3D4FF',
    '#E1B3FF', '#FFB3D4', '#FFCAB3', '#D4FFB3', '#B3FFE1', '#B3C9FF',
    '#F0B3FF', '#FFE1B3', '#B3FFB3', '#B3FFFF', '#C1B3FF', '#FFD4B3'
  ];

  // Tons vibrantes para quem prefere mais cor
  vibrantColors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD',
    '#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3', '#FF9F43', '#FF3838',
    '#FF6348', '#FF4757', '#3742FA', '#2F3542', '#A4B0BE', '#57606F'
  ];

  // Tons neutros e profissionais
  neutralColors = [
    '#F8F9FA', '#E9ECEF', '#DEE2E6', '#CED4DA', '#ADB5BD', '#6C757D',
    '#495057', '#343A40', '#212529', '#FFF3CD', '#D1ECF1', '#D4EDDA',
    '#F8D7DA', '#E2E3E5', '#D6D8DB', '#C6C8CA', '#BDC1C6', '#9AA0A6'
  ];

  // ControlValueAccessor
  private onChange = (value: string) => {};
  private onTouched = () => {};

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

  onCustomColorChange(event: any): void {
    const color = event.target.value;
    this.selectColor(color);
  }
}
