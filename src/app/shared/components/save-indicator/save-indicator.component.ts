import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { StorageService, SaveEvent } from '../../../core/services/storage.service';

@Component({
  selector: 'app-save-indicator',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div 
      *ngIf="currentEvent" 
      class="save-indicator"
      [class.show]="showIndicator">
      <mat-icon class="save-icon">cloud_done</mat-icon>
      <span class="save-message">{{ currentEvent.message }}</span>
      <div class="save-timestamp">{{ formatTime(currentEvent.timestamp) }}</div>
    </div>
  `,
  styles: [`
    .save-indicator {
      position: fixed;
      top: 80px;
      right: 24px;
      z-index: 2000;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 16px;
      background: rgba(76, 175, 80, 0.95);
      color: white;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      backdrop-filter: blur(10px);
      transform: translateX(120%);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      max-width: 300px;
    }

    .save-indicator.show {
      transform: translateX(0);
    }

    .save-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
      color: white;
    }

    .save-message {
      font-size: 14px;
      font-weight: 500;
      flex: 1;
    }

    .save-timestamp {
      font-size: 11px;
      opacity: 0.8;
      white-space: nowrap;
    }

    /* Mobile */
    @media (max-width: 768px) {
      .save-indicator {
        top: 70px;
        right: 16px;
        left: 16px;
        max-width: none;
        transform: translateY(-120%);
      }

      .save-indicator.show {
        transform: translateY(0);
      }
    }

    /* Animação de pulso */
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }

    .save-indicator.show .save-icon {
      animation: pulse 0.6s ease-in-out;
    }
  `]
})
export class SaveIndicatorComponent implements OnInit, OnDestroy {
  private storageService = inject(StorageService);
  private snackBar = inject(MatSnackBar);

  currentEvent: SaveEvent | null = null;
  showIndicator = false;
  private subscription?: Subscription;

  ngOnInit() {
    this.subscription = this.storageService.saveEvents$
      .pipe(filter(event => event !== null))
      .subscribe(event => {
        if (event) {
          this.showSaveIndicator(event);
        }
      });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  private showSaveIndicator(event: SaveEvent) {
    this.currentEvent = event;
    
    // Pequeno delay para garantir que a animação funcione
    setTimeout(() => {
      this.showIndicator = true;
    }, 50);

    // Esconde após 2.5 segundos
    setTimeout(() => {
      this.showIndicator = false;
      
      // Remove o evento após a animação
      setTimeout(() => {
        this.currentEvent = null;
      }, 300);
    }, 2500);
  }

  formatTime(timestamp: Date): string {
    return timestamp.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }
}
