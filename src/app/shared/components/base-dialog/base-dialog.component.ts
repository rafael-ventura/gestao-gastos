import { Component, Input, Output, EventEmitter, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';

export interface DialogAction {
  label: string;
  color?: 'primary' | 'accent' | 'warn';
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  action: () => void | Promise<void>;
}

@Component({
  selector: 'app-base-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule
  ],
  templateUrl: './base-dialog.component.html',
  styleUrl: './base-dialog.component.scss'
})
export class BaseDialogComponent {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() icon = '';
  @Input() iconColor: 'primary' | 'accent' | 'warn' = 'primary';
  @Input() compact = false;
  @Input() loading = false;
  @Input() loadingMessage = '';
  @Input() noPadding = false;
  @Input() hideHeaderDivider = false;

  @Input() showCloseButton = true;
  @Input() showDefaultActions = false;
  @Input() confirmLabel = 'Confirmar';
  @Input() cancelLabel = 'Cancelar';
  @Input() confirmIcon = '';
  @Input() confirmDisabled = false;

  @Input() actions: DialogAction[] = [];

  @Output() closed = new EventEmitter<void>();
  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  async executeAction(action: DialogAction): Promise<void> {
    try {
      action.loading = true;
      const result = action.action();
      if (result instanceof Promise) {
        await result;
      }
    } catch (error) {
      console.error('Erro ao executar ação:', error);
    } finally {
      action.loading = false;
    }
  }

  onClose(): void {
    this.closed.emit();
  }

  onConfirm(): void {
    this.confirmed.emit();
  }

  onCancel(): void {
    this.cancelled.emit();
  }
}
