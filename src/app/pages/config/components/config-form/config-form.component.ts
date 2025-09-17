import { Component, Input, Output, EventEmitter, OnInit, OnChanges, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

// FormInputComponent removido - usando inputs nativos com estilos globais
import { Settings } from '../../../../core/models/settings.model';

@Component({
  selector: 'app-config-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatIconModule
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ConfigFormComponent),
      multi: true
    }
  ],
  templateUrl: './config-form.component.html',
  styleUrls: ['./config-form.component.scss']
})
export class ConfigFormComponent implements OnInit, OnChanges, ControlValueAccessor {
  @Input() settings!: Settings;
  @Output() formChange = new EventEmitter<any>();

  configForm!: FormGroup;
  dayOptions: Array<{label: string, value: number}> = [];

  private fb = new FormBuilder();

  // ControlValueAccessor
  private onChange = (value: any) => {};
  private onTouched = () => {};

  ngOnInit() {
    this.initializeDayOptions();
    this.initializeForm();
  }

  ngOnChanges() {
    // Re-inicializa o formulário quando as settings mudam
    if (this.settings) {
      this.initializeForm();
    }
  }

  initializeDayOptions() {
    this.dayOptions = Array.from({length: 31}, (_, i) => ({
      label: `Dia ${i + 1}`,
      value: i + 1
    }));
  }

  initializeForm() {
    // Usa os valores das settings se disponíveis, senão usa valores padrão
    const salary = this.settings?.salary || 0;
    const salaryDay = this.settings?.salaryDay || 1;
    const creditCardDueDay = this.settings?.creditCardDueDay || 10;

    console.log('Inicializando formulário com:', { salary, salaryDay, creditCardDueDay });

    this.configForm = this.fb.group({
      salary: [salary, [Validators.min(0)]],
      salaryDay: [salaryDay, [Validators.required, Validators.min(1), Validators.max(31)]],
      creditCardDueDay: [creditCardDueDay, [Validators.required, Validators.min(1), Validators.max(31)]]
    });

    // Emite mudanças
    this.configForm.valueChanges.subscribe(value => {
      this.onChange(value);
      this.formChange.emit(value);
    });
  }

  // ControlValueAccessor implementation
  writeValue(value: any): void {
    if (value) {
      this.configForm.patchValue(value);
    }
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.configForm.disable();
    } else {
      this.configForm.enable();
    }
  }

  getFieldError(field: string): string {
    const fieldControl = this.configForm.get(field);
    
    if (fieldControl?.errors && fieldControl.touched) {
      if (fieldControl.errors['required']) return 'Campo obrigatório';
      if (fieldControl.errors['min']) return 'Valor deve ser positivo';
      if (fieldControl.errors['max']) return 'Valor inválido';
    }
    
    return '';
  }

  get formValue() {
    return this.configForm.value;
  }

  get isValid() {
    return this.configForm.valid;
  }
}
