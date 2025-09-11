import { Component, Input, forwardRef, Output, EventEmitter, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule, MatDatepicker } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

export interface FormInputOption {
  label: string;
  value: any;
  disabled?: boolean;
}

@Component({
  selector: 'app-form-input',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormInputComponent),
      multi: true
    }
  ],
  template: `
    <div class="form-input-container">
      <mat-form-field class="modern-input" appearance="outline">
        <!-- Input de texto/número -->
        <input 
          *ngIf="type !== 'select' && type !== 'textarea' && type !== 'date'"
          matInput
          [type]="type"
          [placeholder]="placeholder"
          [value]="value || ''"
          [disabled]="disabled"
          [readonly]="readonly"
          [attr.maxlength]="maxLength"
          [min]="min"
          [max]="max"
          [step]="step"
          (input)="onInput($event)"
          (blur)="onBlur()"
          (focus)="onFocus()">

        <!-- Input de data -->
        <input 
          *ngIf="type === 'date'"
          matInput
          [matDatepicker]="picker"
          [placeholder]="placeholder"
          [value]="value || ''"
          [disabled]="disabled"
          [readonly]="readonly"
          (dateInput)="onDateInput($event)"
          (blur)="onBlur()"
          (focus)="onFocus()">

        <!-- Select -->
        <mat-select 
          *ngIf="type === 'select'"
          [placeholder]="placeholder"
          [value]="value || ''"
          [disabled]="disabled"
          (selectionChange)="onSelectChange($event)">
          <mat-option *ngFor="let option of options" [value]="option.value" [disabled]="option.disabled">
            {{ option.label }}
          </mat-option>
        </mat-select>

        <!-- Textarea -->
        <textarea 
          *ngIf="type === 'textarea'"
          matInput
          [placeholder]="placeholder"
          [value]="value || ''"
          [disabled]="disabled"
          [readonly]="readonly"
          [attr.maxlength]="maxLength"
          [rows]="rows"
          (input)="onInput($event)"
          (blur)="onBlur()"
          (focus)="onFocus()">
        </textarea>

        <!-- Label -->
        <mat-label *ngIf="label">{{ label }}</mat-label>

        <!-- Prefixo -->
        <span *ngIf="prefix" matTextPrefix>{{ prefix }}</span>

        <!-- Ícone de prefixo -->
        <mat-icon *ngIf="prefixIcon" matIconPrefix>{{ prefixIcon }}</mat-icon>

        <!-- Ícone de sufixo -->
        <mat-icon *ngIf="suffixIcon" matIconSuffix>{{ suffixIcon }}</mat-icon>

        <!-- Botão de limpar -->
        <button *ngIf="clearable && value" matIconSuffix mat-icon-button (click)="clear()">
          <mat-icon>clear</mat-icon>
        </button>

        <!-- Datepicker -->
        <mat-datepicker-toggle *ngIf="type === 'date'" matIconSuffix [for]="picker"></mat-datepicker-toggle>
        <mat-datepicker #picker *ngIf="type === 'date'"></mat-datepicker>

        <!-- Hint -->
        <mat-hint *ngIf="hint">{{ hint }}</mat-hint>

        <!-- Error -->
        <mat-error *ngIf="errorMessage">{{ errorMessage }}</mat-error>
      </mat-form-field>
    </div>
  `,
  styles: [`
    .form-input-container {
      width: 100%;
      
      .modern-input {
        width: 100%;
        
        ::ng-deep {
          // Container principal
          .mat-mdc-text-field-wrapper {
            background: rgba(255, 255, 255, 0.1) !important;
            border: 2px solid rgba(255, 255, 255, 0.2) !important;
            border-radius: 12px !important;
            height: 48px !important;
            transition: all 0.3s ease !important;
            
            &:hover {
              border-color: rgba(255, 255, 255, 0.3) !important;
            }
            
            &.mdc-text-field--focused {
              border-color: #60a5fa !important;
              box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.2) !important;
            }
          }
          
          // Remover outline padrão
          .mdc-notched-outline {
            display: none !important;
          }
          
          // Input - posicionamento limpo
          .mat-mdc-input-element {
            color: white !important;
            font-weight: 500 !important;
            padding: -6 -16px !important;
            height: 44px !important;
            line-height: 44px !important;
            background: transparent !important;
            border: none !important;
            
            &::placeholder {
              color: rgba(255, 255, 255, 0.5) !important;
            }
          }
          
          // Select
          .mat-mdc-select-value {
            color: white !important;
            padding: 0 16px !important;
            line-height: 44px !important;
          }
          
          // Label - posicionamento simples
          .mat-mdc-form-field-label {
            color: rgba(255, 255, 255, 0.6) !important;
            font-weight: 500 !important;
            left: 16px !important;
            
            &.mdc-floating-label--float-above {
              color: #60a5fa !important;
              font-weight: 600 !important;
            }
          }
          
          // Prefixo R$
          .mat-mdc-form-field-text-prefix {
            color: rgba(255, 255, 255, 0.8) !important;
            font-weight: 600 !important;
            padding-left: 16px !important;
            line-height: 44px !important;
          }
          
          // Ícones
          .mat-mdc-form-field-icon-prefix,
          .mat-mdc-form-field-icon-suffix {
            color: rgba(255, 255, 255, 0.7) !important;
          }
          
          // Hints e erros
          .mat-mdc-form-field-hint {
            color: rgba(255, 255, 255, 0.6) !important;
            font-size: 0.875rem !important;
          }
          
          .mat-mdc-form-field-error {
            color: #f87171 !important;
            font-size: 0.875rem !important;
            font-weight: 600 !important;
          }
        }
      }
    }
  `]
})
export class FormInputComponent implements ControlValueAccessor {
  @Input() type: 'text' | 'number' | 'email' | 'password' | 'tel' | 'date' | 'select' | 'textarea' = 'text';
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() hint: string = '';
  @Input() errorMessage: string = '';
  @Input() disabled: boolean = false;
  @Input() readonly: boolean = false;
  @Input() maxLength: number | null = null;
  @Input() min: number | null = null;
  @Input() max: number | null = null;
  @Input() step: number | null = null;
  @Input() rows: number = 3;
  @Input() prefix: string = '';
  @Input() prefixIcon: string = '';
  @Input() suffixIcon: string = '';
  @Input() clearable: boolean = false;
  @Input() options: FormInputOption[] = [];

  @Output() inputChange = new EventEmitter<any>();
  @Output() inputFocus = new EventEmitter<void>();
  @Output() inputBlur = new EventEmitter<void>();

  @ViewChild('picker') picker!: MatDatepicker<Date>;

  value: any = '';

  private onChange = (value: any) => {};
  private onTouched = () => {};

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInput(event: any): void {
    const value = event.target.value;
    this.value = this.type === 'number' ? (value ? Number(value) : null) : value;
    this.onChange(this.value);
    this.inputChange.emit(this.value);
  }

  onSelectChange(event: any): void {
    this.value = event.value;
    this.onChange(this.value);
    this.inputChange.emit(this.value);
  }

  onDateInput(event: any): void {
    this.value = event.value;
    this.onChange(this.value);
    this.inputChange.emit(this.value);
  }

  onFocus(): void {
    this.inputFocus.emit();
  }

  onBlur(): void {
    this.onTouched();
    this.inputBlur.emit();
  }

  clear(): void {
    this.value = this.type === 'number' ? null : '';
    this.onChange(this.value);
    this.inputChange.emit(this.value);
  }
}