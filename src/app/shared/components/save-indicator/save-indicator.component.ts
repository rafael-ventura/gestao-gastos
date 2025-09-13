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
  templateUrl: './save-indicator.component.html',
  styleUrl: './save-indicator.component.scss'
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
