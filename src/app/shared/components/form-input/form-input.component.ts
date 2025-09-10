import { Component, Input, Output, EventEmitter, forwardRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule, MatDatepicker } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

export type InputType = 'text' | 'number' | 'email' | 'password' | 'tel' | 'date' | 'select' | 'textarea';

@Component({
  selector: 'app-form-input',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormInputComponent),
      multi: true
    }
  ],
  template: `
    <div class="form-input-container" [class.has-error]="hasError" [class.focused]="focused">
      
      <!-- Input padrão -->
      <mat-form-field 
        *ngIf="type !== 'select' && type !== 'textarea'"
        appearance="outline" 
        class="modern-input">
        
        <mat-label>{{ label }}</mat-label>
        
        <!-- Prefixo -->
        <span *ngIf="prefix" matTextPrefix>{{ prefix }}&nbsp;</span>
        
        <!-- Ícone de prefixo -->
        <mat-icon *ngIf="prefixIcon" matIconPrefix>{{ prefixIcon }}</mat-icon>
        
        <!-- Input -->
        <input 
          *ngIf="type !== 'date'"
          matInput
          [type]="type"
          [placeholder]="placeholder"
          [value]="value"
          [disabled]="disabled"
          [readonly]="readonly"
          [min]="min"
          [max]="max"
          [step]="step"
          [attr.maxlength]="maxLength"
          (input)="onInput($event)"
          (blur)="onBlur()"
          (focus)="onFocus()">
        
        <!-- Date Input -->
        <input 
          *ngIf="type === 'date'"
          matInput
          [matDatepicker]="datePicker"
          [placeholder]="placeholder"
          [value]="value"
          [disabled]="disabled"
          [readonly]="readonly"
          (input)="onInput($event)"
          (blur)="onBlur()"
          (focus)="onFocus()">
        
        <!-- Date picker -->
        <mat-datepicker-toggle 
          *ngIf="type === 'date'" 
          matIconSuffix 
          [for]="datePicker">
        </mat-datepicker-toggle>
        <mat-datepicker *ngIf="type === 'date'" #datePicker></mat-datepicker>
        
        <!-- Ícone de sufixo -->
        <mat-icon *ngIf="suffixIcon" matIconSuffix>{{ suffixIcon }}</mat-icon>
        
        <!-- Botão de limpar -->
        <button 
          *ngIf="clearable && value && !disabled && !readonly"
          mat-icon-button
          matIconSuffix
          type="button"
          (click)="clearValue()"
          matTooltip="Limpar">
          <mat-icon>close</mat-icon>
        </button>
        
        <!-- Hint -->
        <mat-hint *ngIf="hint">{{ hint }}</mat-hint>
        
        <!-- Error -->
        <mat-error *ngIf="errorMessage">{{ errorMessage }}</mat-error>
        
      </mat-form-field>
      
      <!-- Select -->
      <mat-form-field 
        *ngIf="type === 'select'"
        appearance="outline" 
        class="modern-input">
        
        <mat-label>{{ label }}</mat-label>
        
        <!-- Ícone de prefixo -->
        <mat-icon *ngIf="prefixIcon" matIconPrefix>{{ prefixIcon }}</mat-icon>
        
        <mat-select 
          [value]="value"
          [disabled]="disabled"
          [placeholder]="placeholder"
          (selectionChange)="onSelectChange($event)">
          
          <mat-option 
            *ngFor="let option of options" 
            [value]="option.value">
            {{ option.label }}
          </mat-option>
          
        </mat-select>
        
        <!-- Hint -->
        <mat-hint *ngIf="hint">{{ hint }}</mat-hint>
        
        <!-- Error -->
        <mat-error *ngIf="errorMessage">{{ errorMessage }}</mat-error>
        
      </mat-form-field>
      
      <!-- Textarea -->
      <mat-form-field 
        *ngIf="type === 'textarea'"
        appearance="outline" 
        class="modern-input">
        
        <mat-label>{{ label }}</mat-label>
        
        <textarea 
          matInput
          [placeholder]="placeholder"
          [value]="value"
          [disabled]="disabled"
          [readonly]="readonly"
          [rows]="rows || 3"
          [attr.maxlength]="maxLength"
          (input)="onInput($event)"
          (blur)="onBlur()"
          (focus)="onFocus()">
        </textarea>
        
        <!-- Hint -->
        <mat-hint *ngIf="hint">{{ hint }}</mat-hint>
        
        <!-- Error -->
        <mat-error *ngIf="errorMessage">{{ errorMessage }}</mat-error>
        
      </mat-form-field>
      
    </div>
  `,
  styles: [`
    .form-input-container {
      position: relative;
      width: 100%;
      
      .modern-input {
        width: 100%;
        
        ::ng-deep {
          .mat-mdc-text-field-wrapper {
            background: white;
            border: 2px solid var(--gray-200);
            border-radius: 12px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            
            &:hover {
              border-color: var(--gray-300);
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
              transform: translateY(-1px);
            }
            
            &.mdc-text-field--focused {
              border-color: var(--primary-400);
              box-shadow: 0 0 0 4px var(--primary-100), 0 4px 12px rgba(0, 0, 0, 0.1);
              transform: translateY(-2px);
            }
          }
          
          .mat-mdc-form-field-label {
            color: var(--gray-600);
            font-weight: 500;
            transition: all 0.2s ease;
            
            &.mdc-floating-label--float-above {
              color: var(--primary-600);
              font-weight: 600;
            }
          }
          
          .mat-mdc-input-element,
          .mat-mdc-select-value {
            color: var(--gray-800);
            font-weight: 500;
            
            &::placeholder {
              color: var(--gray-400);
              opacity: 1;
            }
          }
          
          .mat-mdc-form-field-hint {
            color: var(--gray-500);
            font-size: 0.875rem;
            font-weight: 500;
          }
          
          .mat-mdc-form-field-error {
            color: var(--error-500);
            font-weight: 600;
            font-size: 0.875rem;
          }
          
          .mat-mdc-form-field-icon-prefix,
          .mat-mdc-form-field-icon-suffix {
            color: var(--gray-500);
            transition: color 0.2s ease;
          }
          
          // Estados especiais
          .mat-mdc-form-field-disabled {
            .mat-mdc-text-field-wrapper {
              background: var(--gray-100);
              border-color: var(--gray-200);
              opacity: 0.7;
              
              &:hover {
                transform: none;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
              }
            }
          }
        }
      }
      
      &.has-error {
        .modern-input ::ng-deep {
          .mat-mdc-text-field-wrapper {
            border-color: var(--error-500);
            background: var(--error-50);
            
            &:hover {
              border-color: var(--error-600);
            }
            
            &.mdc-text-field--focused {
              border-color: var(--error-500);
              box-shadow: 0 0 0 4px rgba(245, 101, 101, 0.2), 0 4px 12px rgba(245, 101, 101, 0.1);
            }
          }
        }
      }
      
      &.focused {
        .modern-input ::ng-deep {
          .mat-mdc-form-field-icon-prefix,
          .mat-mdc-form-field-icon-suffix {
            color: var(--primary-600);
          }
        }
      }
    }
    
    // Animações suaves
    @keyframes inputFocus {
      from {
        transform: translateY(0);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
      }
      to {
        transform: translateY(-2px);
        box-shadow: 0 0 0 4px var(--primary-100), 0 4px 12px rgba(0, 0, 0, 0.1);
      }
    }
    
    // Responsivo
    @media (max-width: 768px) {
      .form-input-container {
        .modern-input ::ng-deep {
          .mat-mdc-text-field-wrapper {
            &:hover {
              transform: none;
            }
            
            &.mdc-text-field--focused {
              transform: none;
            }
          }
        }
      }
    }
  `]
})
export class FormInputComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() placeholder = '';
  @Input() type: InputType = 'text';
  @Input() hint = '';
  @Input() errorMessage = '';
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() required = false;
  @Input() clearable = false;
  
  // ViewChild para o datepicker
  @ViewChild('datePicker') datePicker!: MatDatepicker<Date>;
  
  // Ícones
  @Input() prefixIcon = '';
  @Input() suffixIcon = '';
  @Input() prefix = '';
  
  // Validações
  @Input() min: string | number = '';
  @Input() max: string | number = '';
  @Input() step: string | number = '';
  @Input() maxLength: number | null = null;
  
  // Para select
  @Input() options: Array<{label: string, value: any}> = [];
  
  // Para textarea
  @Input() rows: number | null = null;
  
  @Output() inputChange = new EventEmitter<any>();
  @Output() inputBlur = new EventEmitter<void>();
  @Output() inputFocus = new EventEmitter<void>();
  
  value: any = '';
  focused = false;
  hasError = false;
  
  // ControlValueAccessor
  private onChange = (value: any) => {};
  private onTouched = () => {};
  
  writeValue(value: any): void {
    this.value = value || '';
  }
  
  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }
  
  registerOnTouched(fn: () => void): void {
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
  
  onFocus(): void {
    this.focused = true;
    this.inputFocus.emit();
  }
  
  onBlur(): void {
    this.focused = false;
    this.onTouched();
    this.inputBlur.emit();
  }
  
  clearValue(): void {
    this.value = this.type === 'number' ? null : '';
    this.onChange(this.value);
    this.inputChange.emit(this.value);
  }
}
