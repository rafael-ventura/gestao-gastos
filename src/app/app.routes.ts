import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { 
    path: 'home', 
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  { 
    path: 'informacoes', 
    loadComponent: () => import('./pages/informacoes/informacoes.component').then(m => m.InformacoesComponent)
  },
  { 
    path: 'config', 
    loadComponent: () => import('./pages/config/config.component').then(m => m.ConfigComponent)
  }
];
