# Passo a Passo - MVP Simplificado (Hackathon Style)

## 🎯 Objetivo
App web super simples para controle de gastos pessoais - você e sua esposa. Foco em funcionalidades essenciais, máximo de coisas prontas, deploy rápido.

---

## 🚀 FASE 1: Setup Rápido (30 min)

### Passo 1: Criar Projeto Angular
```bash
ng new gastos-simples --routing --style=scss --skip-git
cd gastos-simples
```

### Passo 2: Instalar Dependências Essenciais
```bash
ng add @angular/material
npm install uuid
npm install @types/uuid
```

### Passo 3: Configurar Locale pt-BR
- Editar `app.config.ts` para locale pt-BR
- Configurar pipes de moeda e data

---

## 🏗️ FASE 2: Estrutura Super Simples (15 min)

### Passo 4: Criar Estrutura Mínima
```
app/
├── core/
│   ├── services/
│   │   ├── storage.service.ts
│   │   └── calculation.service.ts
│   └── models/
│       ├── transaction.model.ts
│       ├── category.model.ts
│       └── settings.model.ts
├── pages/
│   ├── home/
│   ├── config/
│   └── dashboard/
└── shared/
    ├── components/
    └── pipes/
```

### Passo 5: Criar Modelos Básicos
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

## 💾 FASE 3: Storage Local Simples (20 min)

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

## 🧮 FASE 4: Cálculos Básicos (15 min)

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

  getSalary(): number {
    return this.storageService.getSettings().salary;
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

---

## 🏠 FASE 5: Tela Principal (Home) - 30 min

### Passo 8: Criar HomeComponent
```typescript
// pages/home/home.component.ts
@Component({
  selector: 'app-home',
  template: `
    <div class="home-container">
      <!-- Saldo Principal -->
      <mat-card class="balance-card">
        <mat-card-content>
          <h2>Saldo do Mês</h2>
          <div class="balance-amount" [class.positive]="balance >= 0" [class.negative]="balance < 0">
            {{ balance | currency:'BRL':'symbol':'1.2-2':'pt' }}
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Botão Adicionar Gasto -->
      <button mat-fab color="primary" class="add-button" (click)="openAddDialog()">
        <mat-icon>add</mat-icon>
      </button>

      <!-- Lista de Gastos Recentes -->
      <mat-card class="transactions-card">
        <mat-card-header>
          <mat-card-title>Gastos Recentes</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div *ngFor="let transaction of recentTransactions" class="transaction-item">
            <div class="transaction-info">
              <span class="description">{{ transaction.description }}</span>
              <span class="category">{{ transaction.category }}</span>
            </div>
            <div class="transaction-amount" [class.credit-card]="transaction.isCreditCard">
              {{ transaction.amount | currency:'BRL':'symbol':'1.2-2':'pt' }}
              <mat-icon *ngIf="transaction.isCreditCard" class="credit-icon">credit_card</mat-icon>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .home-container { padding: 16px; }
    .balance-card { margin-bottom: 24px; text-align: center; }
    .balance-amount { font-size: 2.5em; font-weight: bold; }
    .positive { color: #4CAF50; }
    .negative { color: #F44336; }
    .add-button { position: fixed; bottom: 24px; right: 24px; }
    .transaction-item { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #eee; }
    .credit-card { color: #FF9800; }
    .credit-icon { font-size: 16px; margin-left: 4px; }
  `]
})
export class HomeComponent {
  balance = 0;
  recentTransactions: Transaction[] = [];

  constructor(
    private calculationService: CalculationService,
    private storageService: StorageService,
    private dialog: MatDialog
  ) {
    this.loadData();
  }

  loadData() {
    this.balance = this.calculationService.getCurrentMonthBalance();
    this.recentTransactions = this.storageService.getTransactions()
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }

  openAddDialog() {
    // Implementar dialog de adicionar gasto
  }
}
```

---

## ⚙️ FASE 6: Tela de Configurações (20 min)

### Passo 9: Criar ConfigComponent
```typescript
// pages/config/config.component.ts
@Component({
  selector: 'app-config',
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Configurações</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <form [formGroup]="configForm">
          <!-- Salário -->
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Salário Mensal</mat-label>
            <input matInput type="number" formControlName="salary" placeholder="3000">
            <span matPrefix>R$&nbsp;</span>
          </mat-form-field>

          <!-- Dia do Salário -->
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Dia do Salário</mat-label>
            <mat-select formControlName="salaryDay">
              <mat-option *ngFor="let day of days" [value]="day">{{ day }}</mat-option>
            </mat-select>
          </mat-form-field>

          <!-- Vencimento do Cartão -->
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Vencimento do Cartão</mat-label>
            <mat-select formControlName="creditCardDueDay">
              <mat-option *ngFor="let day of days" [value]="day">{{ day }}</mat-option>
            </mat-select>
          </mat-form-field>

          <!-- Categorias -->
          <div class="categories-section">
            <h3>Categorias</h3>
            <div *ngFor="let category of categories; let i = index" class="category-item">
              <mat-form-field appearance="outline">
                <mat-label>Nome</mat-label>
                <input matInput [(ngModel)]="category.name" [ngModelOptions]="{standalone: true}">
              </mat-form-field>
              <input type="color" [(ngModel)]="category.color" [ngModelOptions]="{standalone: true}">
              <button mat-icon-button color="warn" (click)="removeCategory(i)">
                <mat-icon>delete</mat-icon>
              </button>
            </div>
            <button mat-stroked-button (click)="addCategory()">
              <mat-icon>add</mat-icon>
              Adicionar Categoria
            </button>
          </div>

          <button mat-raised-button color="primary" (click)="saveConfig()" class="save-button">
            Salvar Configurações
          </button>
        </form>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .full-width { width: 100%; margin-bottom: 16px; }
    .categories-section { margin-top: 24px; }
    .category-item { display: flex; align-items: center; gap: 16px; margin-bottom: 16px; }
    .save-button { margin-top: 24px; }
  `]
})
export class ConfigComponent {
  configForm: FormGroup;
  categories: Category[] = [];
  days = Array.from({length: 31}, (_, i) => i + 1);

  constructor(
    private fb: FormBuilder,
    private storageService: StorageService,
    private snackBar: MatSnackBar
  ) {
    this.loadConfig();
  }

  loadConfig() {
    const settings = this.storageService.getSettings();
    this.categories = [...settings.categories];
    
    this.configForm = this.fb.group({
      salary: [settings.salary],
      salaryDay: [settings.salaryDay],
      creditCardDueDay: [settings.creditCardDueDay]
    });
  }

  addCategory() {
    this.categories.push({
      id: Date.now().toString(),
      name: 'Nova Categoria',
      color: '#000000'
    });
  }

  removeCategory(index: number) {
    this.categories.splice(index, 1);
  }

  saveConfig() {
    const formValue = this.configForm.value;
    const settings: Settings = {
      ...formValue,
      categories: this.categories
    };
    
    this.storageService.saveSettings(settings);
    this.snackBar.open('Configurações salvas!', 'Fechar', { duration: 3000 });
  }
}
```

---

## 📊 FASE 7: Dashboard/BI Simples (25 min)

### Passo 10: Criar DashboardComponent
```typescript
// pages/dashboard/dashboard.component.ts
@Component({
  selector: 'app-dashboard',
  template: `
    <div class="dashboard-container">
      <!-- KPIs -->
      <div class="kpis">
        <mat-card class="kpi-card">
          <mat-card-content>
            <h3>Saldo do Mês</h3>
            <div class="kpi-value" [class.positive]="balance >= 0" [class.negative]="balance < 0">
              {{ balance | currency:'BRL':'symbol':'1.2-2':'pt' }}
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="kpi-card">
          <mat-card-content>
            <h3>Salário</h3>
            <div class="kpi-value">{{ salary | currency:'BRL':'symbol':'1.2-2':'pt' }}</div>
          </mat-card-content>
        </mat-card>

        <mat-card class="kpi-card">
          <mat-card-content>
            <h3>Gastos</h3>
            <div class="kpi-value">{{ totalExpenses | currency:'BRL':'symbol':'1.2-2':'pt' }}</div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Gráfico por Categoria -->
      <mat-card class="chart-card">
        <mat-card-header>
          <mat-card-title>Gastos por Categoria</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div *ngFor="let item of expensesByCategory" class="category-bar">
            <div class="category-info">
              <span class="category-name">{{ item.category }}</span>
              <span class="category-amount">{{ item.amount | currency:'BRL':'symbol':'1.2-2':'pt' }}</span>
            </div>
            <div class="category-bar-fill" [style.width.%]="getPercentage(item.amount)" [style.background-color]="item.color"></div>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Lista de Transações -->
      <mat-card class="transactions-card">
        <mat-card-header>
          <mat-card-title>Transações do Mês</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div *ngFor="let transaction of monthTransactions" class="transaction-item">
            <div class="transaction-info">
              <span class="description">{{ transaction.description }}</span>
              <span class="category">{{ transaction.category }}</span>
              <span class="date">{{ transaction.date | date:'dd/MM' }}</span>
            </div>
            <div class="transaction-amount" [class.credit-card]="transaction.isCreditCard">
              {{ transaction.amount | currency:'BRL':'symbol':'1.2-2':'pt' }}
              <mat-icon *ngIf="transaction.isCreditCard" class="credit-icon">credit_card</mat-icon>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .dashboard-container { padding: 16px; }
    .kpis { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px; }
    .kpi-card { text-align: center; }
    .kpi-value { font-size: 2em; font-weight: bold; margin-top: 8px; }
    .positive { color: #4CAF50; }
    .negative { color: #F44336; }
    .category-bar { margin-bottom: 16px; }
    .category-info { display: flex; justify-content: space-between; margin-bottom: 4px; }
    .category-bar-fill { height: 20px; border-radius: 10px; }
    .transaction-item { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #eee; }
    .credit-card { color: #FF9800; }
  `]
})
export class DashboardComponent {
  balance = 0;
  salary = 0;
  totalExpenses = 0;
  expensesByCategory: any[] = [];
  monthTransactions: Transaction[] = [];

  constructor(
    private calculationService: CalculationService,
    private storageService: StorageService
  ) {
    this.loadData();
  }

  loadData() {
    this.balance = this.calculationService.getCurrentMonthBalance();
    this.salary = this.calculationService.getSalary();
    this.expensesByCategory = this.calculationService.getExpensesByCategory();
    
    this.totalExpenses = this.expensesByCategory.reduce((sum, item) => sum + item.amount, 0);
    
    this.monthTransactions = this.storageService.getTransactions()
      .filter(t => t.date.startsWith(new Date().toISOString().slice(0, 7)))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  getPercentage(amount: number): number {
    if (this.totalExpenses === 0) return 0;
    return (amount / this.totalExpenses) * 100;
  }
}
```

---

## ➕ FASE 8: Dialog de Adicionar Gasto (20 min)

### Passo 11: Criar AddTransactionDialog
```typescript
// shared/components/add-transaction-dialog.component.ts
@Component({
  selector: 'app-add-transaction-dialog',
  template: `
    <h2 mat-dialog-title>Adicionar Gasto</h2>
    <mat-dialog-content>
      <form [formGroup]="transactionForm">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Descrição</mat-label>
          <input matInput formControlName="description" placeholder="Ex: Almoço">
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Valor</mat-label>
          <input matInput type="number" formControlName="amount" placeholder="35.50">
          <span matPrefix>R$&nbsp;</span>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Categoria</mat-label>
          <mat-select formControlName="category">
            <mat-option *ngFor="let category of categories" [value]="category.name">
              {{ category.name }}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Data</mat-label>
          <input matInput [matDatepicker]="picker" formControlName="date">
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>

        <mat-checkbox formControlName="isCreditCard">Cartão de Crédito</mat-checkbox>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button (click)="onCancel()">Cancelar</button>
      <button mat-raised-button color="primary" (click)="onSave()" [disabled]="!transactionForm.valid">
        Salvar
      </button>
    </mat-dialog-actions>
  `,
  styles: [`.full-width { width: 100%; margin-bottom: 16px; }`]
})
export class AddTransactionDialogComponent {
  transactionForm: FormGroup;
  categories: Category[] = [];

  constructor(
    private fb: FormBuilder,
    private storageService: StorageService,
    private dialogRef: MatDialogRef<AddTransactionDialogComponent>
  ) {
    this.categories = this.storageService.getSettings().categories;
    
    this.transactionForm = this.fb.group({
      description: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      category: ['', Validators.required],
      date: [new Date(), Validators.required],
      isCreditCard: [false]
    });
  }

  onSave() {
    if (this.transactionForm.valid) {
      const formValue = this.transactionForm.value;
      const transaction: Transaction = {
        id: Date.now().toString(),
        description: formValue.description,
        amount: -Math.abs(formValue.amount), // Sempre negativo para gastos
        category: formValue.category,
        date: formValue.date.toISOString().split('T')[0],
        isCreditCard: formValue.isCreditCard,
        createdAt: new Date()
      };

      const transactions = this.storageService.getTransactions();
      transactions.push(transaction);
      this.storageService.saveTransactions(transactions);

      this.dialogRef.close(transaction);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
```

---

## 🧭 FASE 9: Navegação e App Principal (15 min)

### Passo 12: Criar AppComponent e Navegação
```typescript
// app.component.ts
@Component({
  selector: 'app-root',
  template: `
    <mat-toolbar color="primary">
      <span>Gastos Simples</span>
      <span class="spacer"></span>
      <button mat-icon-button [matMenuTriggerFor]="menu">
        <mat-icon>menu</mat-icon>
      </button>
    </mat-toolbar>

    <mat-menu #menu="matMenu">
      <button mat-menu-item routerLink="/home">
        <mat-icon>home</mat-icon>
        <span>Início</span>
      </button>
      <button mat-menu-item routerLink="/dashboard">
        <mat-icon>dashboard</mat-icon>
        <span>Dashboard</span>
      </button>
      <button mat-menu-item routerLink="/config">
        <mat-icon>settings</mat-icon>
        <span>Configurações</span>
      </button>
    </mat-menu>

    <router-outlet></router-outlet>
  `,
  styles: [`
    .spacer { flex: 1 1 auto; }
    mat-toolbar { position: sticky; top: 0; z-index: 1000; }
  `]
})
export class AppComponent {}

// app.routes.ts
export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'config', component: ConfigComponent }
];
```

---

## 🚀 FASE 10: Deploy Rápido (10 min)

### Passo 13: Build e Deploy
```bash
# Build para produção
ng build --configuration production

# Deploy no Netlify/Vercel/GitHub Pages
# Ou usar ng deploy se configurado
```

---

## 📋 Checklist Final

### ✅ Funcionalidades Essenciais
- [ ] Adicionar gasto com descrição, valor, categoria e data
- [ ] Marcar se é cartão de crédito
- [ ] Configurar salário e dia do salário
- [ ] Configurar vencimento do cartão
- [ ] Gerenciar categorias (adicionar/editar/remover)
- [ ] Ver saldo do mês na tela principal
- [ ] Dashboard com gastos por categoria
- [ ] Lista de transações do mês

### ✅ UX Básica
- [ ] Design responsivo (mobile-first)
- [ ] Navegação simples entre telas
- [ ] Feedback visual (toasts)
- [ ] Validações de formulário

### ✅ Técnico
- [ ] Dados salvos no localStorage
- [ ] Formatação pt-BR (moeda e data)
- [ ] Código limpo e comentado

---

## ⏱️ Tempo Total Estimado: 3-4 horas

**Perfeito para um hackathon de fim de semana!** 🎉

---

## 💡 Dicas para Hackathon

1. **Foque no essencial** - não tente fazer tudo perfeito
2. **Use Angular Material** - componentes prontos e bonitos
3. **LocalStorage** - simples e funciona offline
4. **Mobile-first** - teste no celular
5. **Deploy rápido** - Netlify ou Vercel
6. **Itere rápido** - funcionalidade primeiro, perfeição depois

---

## 🔄 Próximos Passos (Se Sobrar Tempo)

- [ ] Tema escuro
- [ ] Exportar dados para Excel
- [ ] Gráficos mais bonitos
- [ ] Notificações
- [ ] Backup automático
