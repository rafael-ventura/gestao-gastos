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
      <!-- Header -->
      <div class="modal-header">
        <div class="header-content">
          <mat-icon class="header-icon">warning</mat-icon>
          <div class="header-text">
            <h2 class="modal-title">{{ data.title }}</h2>
            <p class="modal-subtitle">{{ data.message }}</p>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="modal-content">
        <div class="confirmation-details">
          <div class="item-info">
            <mat-icon class="item-icon">receipt_long</mat-icon>
            <div class="item-details">
              <span class="item-type">{{ data.itemType }}</span>
              <span class="item-name">{{ data.itemName }}</span>
            </div>
          </div>
          
          <div class="warning-message">
            <mat-icon class="warning-icon">info</mat-icon>
            <p>Esta ação não pode ser desfeita.</p>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="modal-actions">
        <button type="button" class="cancel-button" (click)="onCancel()">
          <mat-icon>close</mat-icon>
          Cancelar
        </button>
        <button type="button" class="delete-button" (click)="onConfirm()">
          <mat-icon>delete</mat-icon>
          Excluir
        </button>
      </div>
    </div>
  `,
  styles: [`
    .delete-confirmation-modal {
      color: white;
      min-width: 400px;
      max-width: 500px;
    }

    .modal-header {
      display: flex;
      align-items: flex-start;
      padding: 32px 32px 20px 32px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(255, 255, 255, 0.05);
    }

    .header-content {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      flex: 1;
    }

    .header-icon {
      margin-top: 2px;
      color: #f87171;
      font-size: 1.8rem;
      width: 1.8rem;
      height: 1.8rem;
    }

    .modal-title {
      margin: 0;
      font-size: 22px;
      font-weight: 600;
      line-height: 1.2;
      color: white;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }

    .modal-subtitle {
      margin: 4px 0 0 0;
      color: rgba(255, 255, 255, 0.8);
      font-size: 14px;
      line-height: 1.4;
    }

    .modal-content {
      padding: 32px;
      background: transparent;
    }

    .confirmation-details {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .item-info {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .item-icon {
      color: #60a5fa;
      font-size: 1.5rem;
      width: 1.5rem;
      height: 1.5rem;
    }

    .item-details {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .item-type {
      font-size: 0.875rem;
      color: rgba(255, 255, 255, 0.6);
      font-weight: 500;
    }

    .item-name {
      font-size: 1.1rem;
      color: white;
      font-weight: 600;
    }

    .warning-message {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      background: rgba(248, 113, 113, 0.1);
      border-radius: 8px;
      border: 1px solid rgba(248, 113, 113, 0.2);
    }

    .warning-icon {
      color: #f87171;
      font-size: 1.2rem;
      width: 1.2rem;
      height: 1.2rem;
    }

    .warning-message p {
      margin: 0;
      color: rgba(255, 255, 255, 0.9);
      font-size: 0.95rem;
      font-weight: 500;
    }

    .modal-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 32px 32px 32px;
      gap: 12px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(255, 255, 255, 0.05);
    }

    .cancel-button {
      padding: 14px 28px;
      border: 2px solid rgba(255, 255, 255, 0.2);
      border-radius: 12px;
      background: transparent;
      color: rgba(255, 255, 255, 0.8);
      font-weight: 600;
      font-size: 0.95rem;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      align-items: center;
      gap: 8px;
      
      &:hover {
        background: rgba(255, 255, 255, 0.1);
        border-color: rgba(255, 255, 255, 0.4);
        color: white;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(255, 255, 255, 0.1);
      }
    }

    .delete-button {
      padding: 14px 28px;
      border: none;
      border-radius: 12px;
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      color: white;
      font-weight: 600;
      font-size: 0.95rem;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
      position: relative;
      overflow: hidden;
      
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
      
      mat-icon {
        font-size: 1.1rem;
        width: 1.1rem;
        height: 1.1rem;
      }
    }

    @media (max-width: 768px) {
      .delete-confirmation-modal {
        min-width: 320px;
        max-width: 90vw;
      }
      
      .modal-actions {
        flex-direction: column;
        gap: 12px;
        
        button {
          width: 100%;
        }
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
