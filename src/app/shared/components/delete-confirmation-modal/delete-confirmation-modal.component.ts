import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface DeleteConfirmationData {
  title: string;
  message: string;
  itemName: string;
  itemType: string;
}

@Component({
  selector: 'app-delete-confirmation-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="delete-confirmation-modal">
      <!-- Barra superior decorativa -->
      <div class="delete-confirmation-modal__decorative-bar"></div>
      
      <!-- Header -->
      <div class="delete-confirmation-modal__header">
        <div class="delete-confirmation-modal__header-content">
          <mat-icon class="delete-confirmation-modal__header-icon">warning</mat-icon>
          <div class="delete-confirmation-modal__header-text">
            <h2 class="delete-confirmation-modal__title">{{ data.title }}</h2>
            <p class="delete-confirmation-modal__subtitle">{{ data.message }}</p>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="delete-confirmation-modal__content">
        <div class="delete-confirmation-modal__details">
          <div class="delete-confirmation-modal__item-info">
            <mat-icon class="delete-confirmation-modal__item-icon">receipt_long</mat-icon>
            <div class="delete-confirmation-modal__item-details">
              <span class="delete-confirmation-modal__item-type">{{ data.itemType }}</span>
              <span class="delete-confirmation-modal__item-name">{{ data.itemName }}</span>
            </div>
          </div>
          
          <div class="delete-confirmation-modal__warning">
            <mat-icon class="delete-confirmation-modal__warning-icon">info</mat-icon>
            <p class="delete-confirmation-modal__warning-text">Esta ação não pode ser desfeita.</p>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="delete-confirmation-modal__actions">
        <button type="button" class="delete-confirmation-modal__button delete-confirmation-modal__button--cancel" (click)="onCancel()">
          <mat-icon class="delete-confirmation-modal__button-icon">close</mat-icon>
          <span class="delete-confirmation-modal__button-text">Cancelar</span>
        </button>
        <button type="button" class="delete-confirmation-modal__button delete-confirmation-modal__button--delete" (click)="onConfirm()">
          <mat-icon class="delete-confirmation-modal__button-icon">delete</mat-icon>
          <span class="delete-confirmation-modal__button-text">Excluir</span>
        </button>
      </div>
    </div>
  `,
  styles: [`
    // ===== CONTAINER PRINCIPAL =====
    .delete-confirmation-modal {
      min-width: 480px;
      max-width: 600px;
      width: 90vw;
      max-height: 85vh;
      overflow: visible;
      position: relative;
      z-index: 1000;
      color: white;
      background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
      border-radius: var(--radius-2xl);
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    }

    // ===== BARRA DECORATIVA =====
    .delete-confirmation-modal__decorative-bar {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, #ef4444 0%, #dc2626 50%, #b91c1c 100%);
      z-index: 1;
      border-radius: var(--radius-2xl) var(--radius-2xl) 0 0;
    }

    // ===== HEADER =====
    .delete-confirmation-modal__header {
      display: flex;
      align-items: flex-start;
      padding: 32px 32px 20px 32px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(255, 255, 255, 0.05);
      position: relative;
      z-index: 1;
    }

    .delete-confirmation-modal__header-content {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      flex: 1;
    }

    .delete-confirmation-modal__header-icon {
      margin-top: 2px;
      color: #f87171;
      font-size: 2rem;
      width: 2rem;
      height: 2rem;
      background: rgba(248, 113, 113, 0.1);
      border-radius: 50%;
      padding: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .delete-confirmation-modal__header-text {
      flex: 1;
    }

    .delete-confirmation-modal__title {
      margin: 0 0 8px 0;
      font-size: 1.75rem;
      font-weight: 600;
      line-height: 1.2;
      color: white;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }

    .delete-confirmation-modal__subtitle {
      margin: 0;
      color: rgba(255, 255, 255, 0.8);
      font-size: 1rem;
      line-height: 1.4;
      font-weight: 400;
    }

    // ===== CONTENT =====
    .delete-confirmation-modal__content {
      padding: 32px;
      background: transparent;
      position: relative;
      z-index: 1;
    }

    .delete-confirmation-modal__details {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .delete-confirmation-modal__item-info {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: var(--radius-xl);
      border: 1px solid rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
    }

    .delete-confirmation-modal__item-icon {
      color: #60a5fa;
      font-size: 1.5rem;
      width: 1.5rem;
      height: 1.5rem;
      background: rgba(96, 165, 250, 0.1);
      border-radius: 50%;
      padding: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .delete-confirmation-modal__item-details {
      display: flex;
      flex-direction: column;
      gap: 4px;
      flex: 1;
    }

    .delete-confirmation-modal__item-type {
      font-size: 0.875rem;
      color: rgba(255, 255, 255, 0.6);
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .delete-confirmation-modal__item-name {
      font-size: 1.1rem;
      color: white;
      font-weight: 600;
      word-break: break-word;
    }

    .delete-confirmation-modal__warning {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      background: rgba(248, 113, 113, 0.1);
      border-radius: var(--radius-lg);
      border: 1px solid rgba(248, 113, 113, 0.2);
      backdrop-filter: blur(10px);
    }

    .delete-confirmation-modal__warning-icon {
      color: #f87171;
      font-size: 1.2rem;
      width: 1.2rem;
      height: 1.2rem;
      flex-shrink: 0;
    }

    .delete-confirmation-modal__warning-text {
      margin: 0;
      color: rgba(255, 255, 255, 0.9);
      font-size: 0.95rem;
      font-weight: 500;
      line-height: 1.4;
    }

    // ===== ACTIONS =====
    .delete-confirmation-modal__actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 32px 32px 32px;
      gap: 16px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(255, 255, 255, 0.05);
      position: relative;
      z-index: 1;
    }

    .delete-confirmation-modal__button {
      padding: 14px 28px;
      border-radius: var(--radius-lg);
      font-weight: 600;
      font-size: 0.95rem;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      align-items: center;
      gap: 8px;
      position: relative;
      overflow: hidden;
      min-width: 120px;
      justify-content: center;
    }

    .delete-confirmation-modal__button--cancel {
      border: 2px solid rgba(255, 255, 255, 0.2);
      background: transparent;
      color: rgba(255, 255, 255, 0.8);
      
      &:hover {
        background: rgba(255, 255, 255, 0.1);
        border-color: rgba(255, 255, 255, 0.4);
        color: white;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(255, 255, 255, 0.1);
      }
    }

    .delete-confirmation-modal__button--delete {
      border: none;
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      color: white;
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
      
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
        transition: left 0.5s;
      }
      
      &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(239, 68, 68, 0.4);
        
        &::before {
          left: 100%;
        }
      }
      
      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none;
        
        &::before {
          display: none;
        }
      }
    }

    .delete-confirmation-modal__button-icon {
      font-size: 1.1rem;
      width: 1.1rem;
      height: 1.1rem;
    }

    .delete-confirmation-modal__button-text {
      font-weight: 600;
    }

    // ===== RESPONSIVE DESIGN =====
    @media (max-width: 768px) {
      .delete-confirmation-modal {
        min-width: 320px;
        max-width: 95vw;
        margin: 16px;
      }
      
      .delete-confirmation-modal__header {
        padding: 24px 20px 16px 20px;
      }
      
      .delete-confirmation-modal__title {
        font-size: 1.5rem;
      }
      
      .delete-confirmation-modal__subtitle {
        font-size: 0.9rem;
      }
      
      .delete-confirmation-modal__content {
        padding: 24px 20px;
      }
      
      .delete-confirmation-modal__actions {
        flex-direction: column;
        gap: 12px;
        padding: 16px 20px 24px 20px;
        
        .delete-confirmation-modal__button {
          width: 100%;
        }
      }
    }

    @media (max-width: 480px) {
      .delete-confirmation-modal {
        min-width: 300px;
        max-width: 90vw;
      }
      
      .delete-confirmation-modal__header-content {
        gap: 12px;
      }
      
      .delete-confirmation-modal__header-icon {
        font-size: 1.5rem;
        width: 1.5rem;
        height: 1.5rem;
        padding: 6px;
      }
      
      .delete-confirmation-modal__title {
        font-size: 1.3rem;
      }
    }
  `]
})
export class DeleteConfirmationModalComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<DeleteConfirmationModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DeleteConfirmationData
  ) {}

  ngOnInit() {}

  onConfirm() {
    this.dialogRef.close(true);
  }

  onCancel() {
    this.dialogRef.close(false);
  }
}
