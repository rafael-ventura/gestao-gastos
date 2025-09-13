import { Component, Input, forwardRef, Output, EventEmitter, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
// Removido Angular Material datepicker - usando input nativo

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
    MatButtonModule
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormInputComponent),
      multi: true
    }
  ],
  templateUrl: './form-input.component.html',
  styleUrls: ['./form-input.component.scss']
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

  // Removido ViewChild do datepicker - usando input nativo

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
    const value = event.target.value;
    this.value = value;
    this.onChange(value);
    this.inputChange.emit(value);
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