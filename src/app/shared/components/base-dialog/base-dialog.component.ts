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
  template: `
    <div class="dialog-container" [class.compact]="compact">
      <!-- Header -->
      <div class="dialog-header" *ngIf="title || subtitle || showCloseButton">
        <div class="header-content">
          <div class="header-icon" *ngIf="icon">
            <mat-icon [color]="iconColor">{{ icon }}</mat-icon>
          </div>
          <div class="header-text">
            <h2 mat-dialog-title *ngIf="title" class="dialog-title">{{ title }}</h2>
            <p class="dialog-subtitle" *ngIf="subtitle">{{ subtitle }}</p>
          </div>
        </div>
        <button 
          *ngIf="showCloseButton"
          mat-icon-button 
          class="close-button"
          (click)="onClose()"
          [disabled]="loading">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <mat-divider *ngIf="(title || subtitle) && !hideHeaderDivider"></mat-divider>

      <!-- Content -->
      <div mat-dialog-content class="dialog-content" [class.no-padding]="noPadding">
        <div *ngIf="loading" class="loading-overlay">
          <mat-spinner diameter="40"></mat-spinner>
          <p *ngIf="loadingMessage">{{ loadingMessage }}</p>
        </div>
        
        <div class="content-wrapper" [class.loading]="loading">
          <ng-content></ng-content>
        </div>
      </div>

      <!-- Actions -->
      <div mat-dialog-actions class="dialog-actions" *ngIf="actions.length > 0 || showDefaultActions">
        <div class="actions-left">
          <ng-content select="[slot=actions-left]"></ng-content>
        </div>
        
        <div class="actions-right">
          <!-- Ações customizadas -->
          <button
            *ngFor="let action of actions"
            mat-button
            [color]="action.color || 'primary'"
            [disabled]="action.disabled || loading"
            (click)="executeAction(action)"
            class="action-button">
            <mat-icon *ngIf="action.icon && !action.loading">{{ action.icon }}</mat-icon>
            <mat-spinner *ngIf="action.loading" diameter="16"></mat-spinner>
            {{ action.label }}
          </button>

          <!-- Ações padrão -->
          <ng-container *ngIf="showDefaultActions">
            <button 
              mat-button 
              (click)="onCancel()"
              [disabled]="loading"
              class="cancel-button">
              {{ cancelLabel }}
            </button>
            <button 
              mat-raised-button 
              color="primary"
              (click)="onConfirm()"
              [disabled]="confirmDisabled || loading"
              class="confirm-button">
              <mat-spinner *ngIf="loading" diameter="16"></mat-spinner>
              <mat-icon *ngIf="confirmIcon && !loading">{{ confirmIcon }}</mat-icon>
              {{ confirmLabel }}
            </button>
          </ng-container>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dialog-container {
      min-width: 320px;
      max-width: 90vw;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
    }

    .dialog-container.compact {
      min-width: 280px;
    }

    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 24px 24px 16px 24px;
      gap: 16px;
    }

    .header-content {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      flex: 1;
    }

    .header-icon {
      margin-top: 2px;
    }

    .header-text {
      flex: 1;
    }

    .dialog-title {
      margin: 0;
      font-size: 20px;
      font-weight: 500;
      line-height: 1.2;
    }

    .dialog-subtitle {
      margin: 4px 0 0 0;
      color: rgba(0, 0, 0, 0.6);
      font-size: 14px;
      line-height: 1.4;
    }

    .close-button {
      margin-top: -8px;
      margin-right: -8px;
    }

    .dialog-content {
      flex: 1;
      position: relative;
      overflow: auto;
      padding: 0 24px;
    }

    .dialog-content.no-padding {
      padding: 0;
    }

    .loading-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.8);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 12px;
      z-index: 10;
    }

    .loading-overlay p {
      margin: 0;
      color: rgba(0, 0, 0, 0.6);
      font-size: 14px;
    }

    .content-wrapper {
      transition: opacity 0.2s ease;
    }

    .content-wrapper.loading {
      opacity: 0.5;
      pointer-events: none;
    }

    .dialog-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 24px 24px 24px;
      gap: 8px;
    }

    .actions-left {
      display: flex;
      gap: 8px;
    }

    .actions-right {
      display: flex;
      gap: 8px;
      margin-left: auto;
    }

    .action-button {
      min-width: 64px;
    }

    .action-button mat-spinner {
      margin-right: 8px;
    }

    .confirm-button mat-spinner {
      margin-right: 8px;
    }

    /* Responsive */
    @media (max-width: 600px) {
      .dialog-container {
        min-width: 280px;
        max-width: 95vw;
      }

      .dialog-header {
        padding: 16px 16px 12px 16px;
      }

      .dialog-content {
        padding: 0 16px;
      }

      .dialog-actions {
        padding: 12px 16px 16px 16px;
        flex-wrap: wrap;
      }

      .actions-right {
        width: 100%;
        justify-content: flex-end;
      }

      .dialog-title {
        font-size: 18px;
      }
    }
  `]
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
