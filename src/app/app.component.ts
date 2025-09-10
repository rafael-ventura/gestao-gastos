import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationComponent } from './shared/components/navigation/navigation.component';
import { SaveIndicatorComponent } from './shared/components/save-indicator/save-indicator.component';
import { PwaService } from './core/services/pwa.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavigationComponent, SaveIndicatorComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'gastos-simples';
  private pwaService = inject(PwaService);

  ngOnInit() {
    // Inicializa o serviço PWA silenciosamente
    try {
      const pwaInfo = this.pwaService.getAppInfo();
      if (pwaInfo.isServiceWorkerEnabled) {
        console.log('🚀 PWA ativo');
      }
    } catch (error) {
      // Silenciosamente ignora erros do PWA em desenvolvimento
    }
  }
}
