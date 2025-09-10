import { Injectable } from '@angular/core';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { MatSnackBar } from '@angular/material/snack-bar';
import { filter, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class PwaService {
  private promptEvent: any;

  constructor(
    private swUpdate: SwUpdate,
    private snackBar: MatSnackBar
  ) {
    // Só inicializa no browser
    if (typeof window !== 'undefined' && swUpdate.isEnabled) {
      this.checkForUpdates();
      this.handleInstallPrompt();
    }
  }

  private checkForUpdates() {
    // Verifica atualizações a cada 6 horas
    setInterval(() => {
      this.swUpdate.checkForUpdate();
    }, 6 * 60 * 60 * 1000);

    // Escuta por novas versões
    this.swUpdate.versionUpdates
      .pipe(
        filter((evt: any): evt is VersionReadyEvent => evt.type === 'VERSION_READY'),
        map((evt: any) => ({
          type: 'UPDATE_AVAILABLE',
          current: evt.currentVersion,
          available: evt.latestVersion,
        }))
      )
      .subscribe(() => {
        this.showUpdateSnackBar();
      });
  }

  private showUpdateSnackBar() {
    const snackBarRef = this.snackBar.open(
      'Nova versão disponível!', 
      'ATUALIZAR',
      {
        duration: 0, // Não fecha automaticamente
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      }
    );

    snackBarRef.onAction().subscribe(() => {
      this.swUpdate.activateUpdate().then(() => {
        window.location.reload();
      });
    });
  }

  private handleInstallPrompt() {
    if (typeof window === 'undefined') return;
    
    window.addEventListener('beforeinstallprompt', (e) => {
      // Previne o prompt automático
      e.preventDefault();
      // Guarda o evento para uso posterior
      this.promptEvent = e;
      
      // Mostra notificação para instalar o app
      this.showInstallSnackBar();
    });

    // Detecta quando o app foi instalado
    window.addEventListener('appinstalled', () => {
      this.snackBar.open(
        '✅ App instalado com sucesso!', 
        'Fechar',
        { duration: 3000 }
      );
      this.promptEvent = null;
    });
  }

  private showInstallSnackBar() {
    const snackBarRef = this.snackBar.open(
      '📱 Instalar app no seu dispositivo?', 
      'INSTALAR',
      {
        duration: 8000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      }
    );

    snackBarRef.onAction().subscribe(() => {
      this.installApp();
    });
  }

  // Método público para instalar o app
  installApp() {
    if (this.promptEvent) {
      this.promptEvent.prompt();
      this.promptEvent.userChoice.then((result: any) => {
        if (result.outcome === 'accepted') {
          console.log('PWA instalado pelo usuário');
        }
        this.promptEvent = null;
      });
    }
  }

  // Verifica se o app está rodando como PWA
  isStandalone(): boolean {
    if (typeof window === 'undefined') return false;
    
    try {
      return window.matchMedia('(display-mode: standalone)').matches ||
             (window.navigator as any).standalone === true;
    } catch (error) {
      return false;
    }
  }

  // Verifica se o app pode ser instalado
  canInstall(): boolean {
    return !!this.promptEvent;
  }

  // Força verificação de atualizações
  checkForUpdate() {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.checkForUpdate();
    }
  }

  // Informações sobre o app
  getAppInfo() {
    try {
      return {
        isStandalone: typeof window !== 'undefined' ? this.isStandalone() : false,
        canInstall: this.canInstall(),
        isServiceWorkerEnabled: this.swUpdate.isEnabled,
        isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true
      };
    } catch (error) {
      console.warn('Erro ao obter informações do PWA:', error);
      return {
        isStandalone: false,
        canInstall: false,
        isServiceWorkerEnabled: false,
        isOnline: true
      };
    }
  }
}
