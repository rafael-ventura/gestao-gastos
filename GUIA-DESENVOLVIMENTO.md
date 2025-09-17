# 🚀 GUIA DE DESENVOLVIMENTO - GESTÃO DE GASTOS

## 🎯 Objetivo
Guia completo para desenvolvimento, manutenção e evolução do projeto Gestão de Gastos, consolidando metodologias e processos.

---

## 📋 VISÃO GERAL DO PROJETO

### 🎯 **Objetivo Principal**
App web Angular para controle financeiro pessoal, com arquitetura offline-first e preparado para migração futura para API.

### 🏗️ **Arquitetura Atual**
- **Frontend**: Angular 19 + TypeScript + SCSS
- **UI**: Angular Material + Design System customizado
- **Storage**: LocalStorage (offline-first)
- **PWA**: Service Worker + Manifest
- **Deploy**: Vercel/Netlify

### 🎨 **Design Philosophy**
- **Mobile-first**: Experiência otimizada para mobile
- **Offline-first**: Funciona sem internet
- **Simplicidade**: Interface limpa e intuitiva
- **Consistência**: Design system unificado

---

## 🚀 FASE 1: CONFIGURAÇÃO INICIAL (30 min)

### Passo 1: Setup do Projeto
```bash
# Criar projeto Angular
ng new gestao-gastos --routing --style=scss --skip-git
cd gestao-gastos

# Instalar dependências essenciais
ng add @angular/material
npm install uuid @types/uuid
```

### Passo 2: Configuração TypeScript
```json
// tsconfig.json - Habilitar strict mode
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

### Passo 3: Configurar Locale pt-BR
```typescript
// app.config.ts
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';

registerLocaleData(localePt);

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-BR' }
  ]
};
```

---

## 🏗️ FASE 2: ESTRUTURA DE ARQUITETURA

### Passo 4: Estrutura de Pastas (Meio Termo)
```
app/
├── core/                    # Serviços globais e configurações
│   ├── services/
│   │   ├── storage.service.ts
│   │   ├── calculation.service.ts
│   │   ├── salary.service.ts
│   │   ├── utils.service.ts
│   │   └── pwa.service.ts
│   └── models/
│       ├── transaction.model.ts
│       ├── category.model.ts
│       └── settings.model.ts
├── pages/                   # Páginas principais
│   ├── home/
│   ├── config/
│   └── informacoes/
└── shared/                  # Componentes reutilizáveis
    ├── components/
    │   ├── form-input/
    │   ├── base-dialog/
    │   ├── color-picker/
    │   ├── navigation/
    │   └── save-indicator/
    └── pipes/
```

### Passo 5: Criar Modelos de Dados
```typescript
// core/models/transaction.model.ts
export interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  isCreditCard: boolean;
  createdAt: Date;
}

// core/models/category.model.ts
export interface Category {
  id: string;
  name: string;
  color: string;
}

// core/models/settings.model.ts
export interface Settings {
  salary: number;
  salaryDay: number;
  creditCardDueDay: number;
  categories: Category[];
}
```

---

## 💾 FASE 3: STORAGE E PERSISTÊNCIA (20 min)

### Passo 6: Implementar StorageService
```typescript
// core/services/storage.service.ts
@Injectable({ providedIn: 'root' })
export class StorageService {
  private readonly TRANSACTIONS_KEY = 'gastos_transactions';
  private readonly SETTINGS_KEY = 'gastos_settings';

  getTransactions(): Transaction[] {
    const data = localStorage.getItem(this.TRANSACTIONS_KEY);
    return data ? JSON.parse(data) : [];
  }

  saveTransactions(transactions: Transaction[]): void {
    localStorage.setItem(this.TRANSACTIONS_KEY, JSON.stringify(transactions));
  }

  getSettings(): Settings {
    const data = localStorage.getItem(this.SETTINGS_KEY);
    return data ? JSON.parse(data) : this.getDefaultSettings();
  }

  saveSettings(settings: Settings): void {
    localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
  }

  private getDefaultSettings(): Settings {
    return {
      salary: 0,
      salaryDay: 1,
      creditCardDueDay: 10,
      categories: [
        { id: '1', name: 'Alimentação', color: '#FF6B6B' },
        { id: '2', name: 'Transporte', color: '#4ECDC4' },
        { id: '3', name: 'Lazer', color: '#45B7D1' },
        { id: '4', name: 'Saúde', color: '#96CEB4' },
        { id: '5', name: 'Outros', color: '#FFEAA7' }
      ]
    };
  }
}
```

---

## 🧮 FASE 4: LÓGICA DE NEGÓCIO (25 min)

### Passo 7: Implementar CalculationService
```typescript
// core/services/calculation.service.ts
@Injectable({ providedIn: 'root' })
export class CalculationService {
  constructor(private storageService: StorageService) {}

  getCurrentMonthBalance(): number {
    const transactions = this.storageService.getTransactions();
    const currentMonth = new Date().toISOString().slice(0, 7);
    
    const monthTransactions = transactions.filter(t => 
      t.date.startsWith(currentMonth)
    );

    const income = monthTransactions
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = monthTransactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    return income - expenses;
  }

  getExpensesByCategory(): { category: string; amount: number; color: string }[] {
    const transactions = this.storageService.getTransactions();
    const settings = this.storageService.getSettings();
    const currentMonth = new Date().toISOString().slice(0, 7);
    
    const monthTransactions = transactions.filter(t => 
      t.date.startsWith(currentMonth) && t.amount < 0
    );

    const categoryMap = new Map();
    
    monthTransactions.forEach(transaction => {
      const category = settings.categories.find(c => c.name === transaction.category);
      const amount = Math.abs(transaction.amount);
      
      if (categoryMap.has(transaction.category)) {
        categoryMap.set(transaction.category, 
          categoryMap.get(transaction.category) + amount
        );
      } else {
        categoryMap.set(transaction.category, amount);
      }
    });

    return Array.from(categoryMap.entries()).map(([category, amount]) => ({
      category,
      amount,
      color: settings.categories.find(c => c.name === category)?.color || '#000'
    }));
  }
}
```

### Passo 8: Implementar UtilsService
```typescript
// core/services/utils.service.ts
@Injectable({ providedIn: 'root' })
export class UtilsService {
  generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

  formatDateShort(date: Date | string): string {
    // Parse direto da string sem usar Date object para evitar timezone issues
    if (typeof date === 'string') {
      const [year, month, day] = date.split('-').map(Number);
      const dayStr = String(day).padStart(2, '0');
      const monthStr = String(month).padStart(2, '0');
      return `${dayStr}/${monthStr}`;
    }
    
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const dayStr = String(day).padStart(2, '0');
    const monthStr = String(month).padStart(2, '0');
    return `${dayStr}/${monthStr}`;
  }
}
```

---

## 🏠 FASE 5: PÁGINA PRINCIPAL - HOME (30 min)

### Passo 9: Criar HomeComponent
```typescript
// pages/home/home.component.ts
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  balance = 0;
  income = 0;
  expenses = 0;
  recentTransactions: Transaction[] = [];
  expensesByCategory: any[] = [];

  constructor(
    private calculationService: CalculationService,
    private storageService: StorageService,
    private salaryService: SalaryService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadData();
    this.checkAndAddSalary();
  }

  loadData() {
    this.balance = this.calculationService.getCurrentMonthBalance();
    this.income = this.calculationService.getCurrentMonthIncome();
    this.expenses = this.calculationService.getCurrentMonthExpenses();
    this.recentTransactions = this.storageService.getTransactions()
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
    this.expensesByCategory = this.calculationService.getExpensesByCategory();
  }

  checkAndAddSalary() {
    this.salaryService.checkAndAddMonthlySalary();
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(TransactionModalComponent, {
      width: '90vw',
      maxWidth: '500px',
      data: { mode: 'add' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadData();
      }
    });
  }
}
```

### Passo 10: Template da Home
```html
<!-- pages/home/home.component.html -->
<div class="home-container">
  <!-- Card de Saldo Principal -->
  <div class="balance-card" [class]="getBalanceClass()">
    <div class="balance-content">
      <h2>Saldo do Mês</h2>
      <div class="balance-amount">
        {{ balance | currency:'BRL':'symbol':'1.2-2':'pt' }}
      </div>
      <div class="balance-details">
        <span class="income">+ {{ income | currency:'BRL':'symbol':'1.2-2':'pt' }}</span>
        <span class="expenses">- {{ expenses | currency:'BRL':'symbol':'1.2-2':'pt' }}</span>
      </div>
    </div>
  </div>

  <!-- Cards de Detalhes -->
  <div class="details-cards">
    <div class="detail-card">
      <mat-icon>trending_up</mat-icon>
      <div class="detail-content">
        <span class="detail-label">Receitas</span>
        <span class="detail-value positive">{{ income | currency:'BRL':'symbol':'1.2-2':'pt' }}</span>
      </div>
    </div>
    
    <div class="detail-card">
      <mat-icon>trending_down</mat-icon>
      <div class="detail-content">
        <span class="detail-label">Gastos</span>
        <span class="detail-value negative">{{ expenses | currency:'BRL':'symbol':'1.2-2':'pt' }}</span>
      </div>
    </div>
  </div>

  <!-- Lista de Transações Recentes -->
  <div class="transactions-card">
    <div class="card-header">
      <h3>Transações Recentes</h3>
      <button mat-icon-button (click)="openAddDialog()">
        <mat-icon>add</mat-icon>
      </button>
    </div>
    
    <div class="transactions-list">
      <div *ngFor="let transaction of recentTransactions" 
           class="transaction-item"
           [class.income-transaction]="transaction.amount > 0"
           [class.expense-transaction]="transaction.amount < 0">
        <div class="transaction-info">
          <span class="description">{{ transaction.description }}</span>
          <span class="category">{{ transaction.category }}</span>
          <span class="date">{{ formatDate(transaction.date) }}</span>
        </div>
        <div class="transaction-amount">
          {{ transaction.amount | currency:'BRL':'symbol':'1.2-2':'pt' }}
          <mat-icon *ngIf="transaction.isCreditCard" class="credit-icon">credit_card</mat-icon>
        </div>
      </div>
    </div>
  </div>

  <!-- Botão Flutuante -->
  <button mat-fab class="floating-add-button" (click)="openAddDialog()">
    <mat-icon>add</mat-icon>
  </button>
</div>
```

---

## ⚙️ FASE 6: CONFIGURAÇÕES (25 min)

### Passo 11: Criar ConfigComponent
```typescript
// pages/config/config.component.ts
@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss']
})
export class ConfigComponent implements OnInit {
  settings: Settings = this.getDefaultSettings();
  categories: Category[] = [];
  configData = {
    salary: 0,
    salaryDay: 1,
    creditCardDueDay: 10
  };

  constructor(
    private storageService: StorageService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadSettings();
  }

  loadSettings() {
    this.settings = this.storageService.getSettings();
    this.categories = [...this.settings.categories];
    
    this.configData = {
      salary: this.settings.salary,
      salaryDay: this.settings.salaryDay,
      creditCardDueDay: this.settings.creditCardDueDay
    };
  }

  saveConfig() {
    const updatedSettings: Settings = {
      ...this.settings,
      ...this.configData,
      categories: this.categories
    };
    
    this.storageService.saveSettings(updatedSettings);
    this.snackBar.open('Configurações salvas!', 'Fechar', { duration: 3000 });
  }

  addCategory() {
    this.categories.push({
      id: this.utilsService.generateId(),
      name: 'Nova Categoria',
      color: '#FF6B6B'
    });
  }

  removeCategory(index: number) {
    this.categories.splice(index, 1);
  }
}
```

---

## 📊 FASE 7: RELATÓRIOS E ANÁLISES (20 min)

### Passo 12: Criar InformacoesComponent
```typescript
// pages/informacoes/informacoes.component.ts
@Component({
  selector: 'app-informacoes',
  templateUrl: './informacoes.component.html',
  styleUrls: ['./informacoes.component.scss']
})
export class InformacoesComponent implements OnInit {
  selectedMonth = new Date();
  monthData: any = {};

  constructor(
    private calculationService: CalculationService,
    private storageService: StorageService
  ) {}

  ngOnInit() {
    this.loadMonthData();
  }

  loadMonthData() {
    const monthStr = this.selectedMonth.toISOString().slice(0, 7);
    this.monthData = this.calculationService.getMonthAnalysis(monthStr);
  }

  onMonthChange() {
    this.loadMonthData();
  }
}
```

---

## 🧩 FASE 8: COMPONENTES COMPARTILHADOS (30 min)

### Passo 13: FormInputComponent
```typescript
// shared/components/form-input/form-input.component.ts
@Component({
  selector: 'app-form-input',
  templateUrl: './form-input.component.html',
  styleUrls: ['./form-input.component.scss']
})
export class FormInputComponent {
  @Input() label = '';
  @Input() type = 'text';
  @Input() placeholder = '';
  @Input() value = '';
  @Input() required = false;
  @Input() disabled = false;
  @Input() hint = '';
  @Input() error = '';
  @Input() icon = '';
  @Input() prefix = '';
  @Input() suffix = '';
  @Input() clearable = false;

  @Output() valueChange = new EventEmitter<string>();
  @Output() clear = new EventEmitter<void>();

  onInput(event: any) {
    this.valueChange.emit(event.target.value);
  }

  onClear() {
    this.value = '';
    this.valueChange.emit('');
    this.clear.emit();
  }
}
```

### Passo 14: BaseDialogComponent
```typescript
// shared/components/base-dialog/base-dialog.component.ts
@Component({
  selector: 'app-base-dialog',
  templateUrl: './base-dialog.component.html',
  styleUrls: ['./base-dialog.component.scss']
})
export class BaseDialogComponent {
  @Input() title = '';
  @Input() showClose = true;
  @Input() loading = false;
  @Input() actions: DialogAction[] = [];

  @Output() close = new EventEmitter<void>();
  @Output() action = new EventEmitter<string>();

  onClose() {
    this.close.emit();
  }

  onAction(actionId: string) {
    this.action.emit(actionId);
  }
}
```

---

## 🧭 FASE 9: NAVEGAÇÃO E ROTEAMENTO (15 min)

### Passo 15: Configurar Rotas
```typescript
// app.routes.ts
export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'config', component: ConfigComponent },
  { path: 'informacoes', component: InformacoesComponent }
];
```

### Passo 16: NavigationComponent
```typescript
// shared/components/navigation/navigation.component.ts
@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {
  navItems = [
    { path: '/home', icon: 'home', label: 'Início' },
    { path: '/config', icon: 'settings', label: 'Configurações' },
    { path: '/informacoes', icon: 'analytics', label: 'Relatórios' }
  ];
}
```

---

## 📱 FASE 10: PWA E RESPONSIVIDADE (20 min)

### Passo 17: Configurar PWA
```typescript
// core/services/pwa.service.ts
@Injectable({ providedIn: 'root' })
export class PwaService {
  private promptEvent: any;

  constructor() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.promptEvent = e;
    });
  }

  installPwa(): Promise<void> {
    if (this.promptEvent) {
      this.promptEvent.prompt();
      return this.promptEvent.userChoice.then(() => {
        this.promptEvent = null;
      });
    }
    return Promise.reject('PWA install not available');
  }
}
```

### Passo 18: Manifest.json
```json
{
  "name": "Gestão de Gastos",
  "short_name": "Gastos",
  "theme_color": "#f56565",
  "background_color": "#ffffff",
  "display": "standalone",
  "scope": "/",
  "start_url": "/",
  "icons": [
    {
      "src": "assets/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "assets/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

---

## 🚀 FASE 11: DEPLOY E FINALIZAÇÃO (15 min)

### Passo 19: Build de Produção
```bash
# Build otimizado
ng build --configuration production

# Verificar bundle size
ng build --stats-json
npx webpack-bundle-analyzer dist/gastos-simples/stats.json
```

### Passo 20: Deploy
```bash
# Deploy no Vercel
vercel --prod

# Ou no Netlify
netlify deploy --prod --dir=dist/gastos-simples
```

---

## 📋 CHECKLIST DE VALIDAÇÃO

### ✅ **Funcionalidades Core**
- [ ] Adicionar/editar/excluir transações
- [ ] Configurações de salário e categorias
- [ ] Dashboard com saldo mensal
- [ ] Relatórios por categoria
- [ ] PWA funcionando offline
- [ ] Responsividade mobile

### ✅ **Validações de Negócio**
- [ ] Validação de campos obrigatórios
- [ ] Formatação de moeda pt-BR
- [ ] Cálculos de saldo corretos
- [ ] Prevenção de duplicatas

### ✅ **UX/UI**
- [ ] Design responsivo
- [ ] Navegação intuitiva
- [ ] Feedbacks visuais
- [ ] Empty states
- [ ] Loading states

### ✅ **Técnico**
- [ ] TypeScript strict
- [ ] Performance otimizada
- [ ] Código limpo e comentado
- [ ] Arquitetura escalável

---

## 🔄 PRÓXIMAS FASES (FUTURO)

### Fase 2: Melhorias
- [ ] Tema escuro completo
- [ ] Gráficos interativos
- [ ] Filtros avançados
- [ ] Export para Excel
- [ ] Backup automático

### Fase 3: Backend
- [ ] API real com autenticação
- [ ] Sincronização multi-dispositivo
- [ ] Recorrências automáticas
- [ ] Notificações push

---

## 💡 DICAS IMPORTANTES

1. **Padronização**: Use sempre o FormInputComponent para inputs
2. **Performance**: Lazy loading para módulos grandes
3. **Arquitetura**: Mantenha services focados em uma responsabilidade
4. **UX**: Mobile-first sempre
5. **Testes**: Foque nos services de cálculo primeiro
6. **Validações**: Implemente tanto no frontend quanto nas regras de negócio
7. **Evolução**: Prepare para migração futura sem over-engineering

---

## 🎯 METODOLOGIA DE DESENVOLVIMENTO

### 🚀 **Abordagem Hackathon-Style**
- **Funcionalidade primeiro**: Implemente o essencial rapidamente
- **Iteração rápida**: Melhore incrementalmente
- **Deploy frequente**: Teste em produção cedo
- **Feedback contínuo**: Use o app diariamente

### 📱 **Mobile-First**
- **Design responsivo**: Comece pelo mobile
- **Touch-friendly**: Botões adequados para dedos
- **Performance**: Otimizado para conexões lentas
- **PWA**: Funciona como app nativo

### 🎨 **Design System**
- **Consistência**: Use sempre as variáveis CSS definidas
- **Componentes**: Reutilize ao máximo
- **Tema unificado**: Cores e espaçamentos padronizados
- **Acessibilidade**: Contraste e navegação por teclado

---

**Tempo estimado total: 4-6 horas (desenvolvimento em tempo parcial)**

*Documento criado em: Setembro 2025*  
*Última atualização: Setembro 2025*  
*Versão: 1.0 (Consolidado)*
