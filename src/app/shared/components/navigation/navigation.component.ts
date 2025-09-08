import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

import { StorageService } from '../../../core/services/storage.service';
import { CalculationService } from '../../../core/services/calculation.service';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  badge?: number;
  tooltip?: string;
}

@Component({
  selector: 'app-navigation',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatTooltipModule
  ],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss'
})
export class NavigationComponent implements OnInit {
  private router = inject(Router);
  private storageService = inject(StorageService);
  private calculationService = inject(CalculationService);
  private breakpointObserver = inject(BreakpointObserver);

  // Estados
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(map(result => result.matches));

  isMobile = false;
  currentRoute = '';
  sidenavOpen = false;

  // Dados
  balance = 0;
  hasData = false;

  // Itens de navegação
  navItems: NavItem[] = [
    {
      label: 'Início',
      icon: 'home',
      route: '/home',
      tooltip: 'Visão geral dos gastos'
    },
    {
      label: 'Informações',
      icon: 'analytics',
      route: '/informacoes',
      tooltip: 'Relatórios e análises'
    },
    {
      label: 'Configurações',
      icon: 'settings',
      route: '/config',
      tooltip: 'Configurar categorias e salário'
    }
  ];

  ngOnInit() {
    // Detecta mudanças de rota
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentRoute = event.url;
      });

    // Detecta se é mobile
    this.isHandset$.subscribe(isHandset => {
      this.isMobile = isHandset;
    });

    // Carrega dados iniciais
    this.loadData();
  }

  loadData() {
    try {
      this.balance = this.calculationService.getCurrentMonthBalance();
      this.hasData = this.storageService.getTransactions().length > 0;
    } catch (error) {
      console.error('Erro ao carregar dados da navegação:', error);
    }
  }

  onNavItemClick(route: string) {
    this.router.navigate([route]);
    
    // Fecha o sidenav no mobile após navegar
    if (this.isMobile) {
      this.sidenavOpen = false;
    }
  }

  toggleSidenav() {
    this.sidenavOpen = !this.sidenavOpen;
  }

  getBalanceColor(): string {
    if (this.balance > 0) return 'positive';
    if (this.balance < 0) return 'negative';
    return 'neutral';
  }

  getBalanceIcon(): string {
    if (this.balance > 0) return 'trending_up';
    if (this.balance < 0) return 'trending_down';
    return 'trending_flat';
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

  isActiveRoute(route: string): boolean {
    return this.currentRoute === route || 
           (route === '/home' && this.currentRoute === '/') ||
           (route !== '/home' && this.currentRoute.startsWith(route));
  }
}
