# Passo a Passo - App de Gestão de Gastos

## 📋 Visão Geral
Criar um app web Angular 17+ para controle financeiro pessoal, com arquitetura offline-first e preparado para migração futura para API.

---

## 🚀 FASE 1: Configuração Inicial do Projeto

### Passo 1: Criar Projeto Angular
```bash
ng new gestao-gastos --routing --style=scss --skip-git
cd gestao-gastos
```

### Passo 2: Instalar Dependências
```bash
ng add @angular/material
npm install @angular/cdk
npm install uuid
npm install @types/uuid
```

### Passo 3: Configurar TypeScript Strict
- Editar `tsconfig.json` para habilitar strict mode
- Configurar ESLint e Prettier

---

## 🏗️ FASE 2: Estrutura de Arquitetura

### Passo 4: Criar Estrutura de Pastas (Meio Termo)
```
app/
├── core/                    # Serviços globais e configurações
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── storage.service.ts
│   │   ├── theme.service.ts
│   │   └── calculation.service.ts
│   ├── guards/
│   └── interfaces/          # Interfaces principais (não ports complexos)
├── data/                    # Modelos e tipos
│   ├── models/
│   │   ├── user.model.ts
│   │   ├── transaction.model.ts
│   │   ├── category.model.ts
│   │   └── card.model.ts
│   └── interfaces/
│       ├── storage.interface.ts
│       └── auth.interface.ts
├── features/               # Módulos por funcionalidade
│   ├── auth/
│   │   ├── components/
│   │   ├── services/
│   │   └── auth.module.ts
│   ├── dashboard/
│   ├── transactions/
│   ├── categories/
│   ├── cards/
│   └── settings/
└── shared/                 # Componentes e utilitários reutilizáveis
    ├── components/
    ├── pipes/
    ├── directives/
    └── utils/
```

### Passo 5: Configurar Locale pt-BR
- Configurar `app.config.ts` com locale pt-BR
- Configurar pipes de moeda e data

---

## 🔐 FASE 3: Autenticação Local

### Passo 6: Criar Entidades de Domínio
- `User` (id, name, email?, passwordHash, createdAt, updatedAt, preferences)
- `Settings` (salaryFixedMonthly?, firstDayOfMonth, theme, schemaVersion)

### Passo 7: Criar Interfaces de Storage
```typescript
// data/interfaces/storage.interface.ts
interface StorageInterface {
  load<T>(key: string): Promise<T | null>;
  save<T>(key: string, data: T): Promise<void>;
  remove(key: string): Promise<void>;
}
```

### Passo 8: Implementar StorageService
- Implementar StorageInterface com LocalStorage
- Chaves por usuário: `pf.<userId>.transactions.v1`
- Serialização JSON com schemaVersion
- Métodos utilitários para cada entidade

### Passo 9: Criar Interfaces de Auth
```typescript
// data/interfaces/auth.interface.ts
interface AuthInterface {
  register(userData: RegisterData): Promise<User>;
  login(credentials: LoginData): Promise<User>;
  logout(): Promise<void>;
  getCurrentUser(): User | null;
}
```

### Passo 10: Criar Serviços de Autenticação
- `AuthService` com hash de senha (Web Crypto API)
- `UserService` para gerenciar usuário atual
- Guards para rotas protegidas

### Passo 11: Criar Componentes de Auth
- `LoginComponent`
- `RegisterComponent`
- `AuthGuard`

---

## 💰 FASE 4: Entidades e Repositórios

### Passo 12: Criar Modelos de Dados
- `Transaction` (id, userId, type, date, amount, categoryId, paymentMethod?, cardId?, note?, createdAt, updatedAt)
- `Category` (id, name, kind?, color?, createdAt, updatedAt)
- `Card` (id, label, last4?, createdAt, updatedAt)
- `RecurringModel` (id, label, type, amount, categoryId, paymentMethod?, cardId?, frequency, day?, active, createdAt, updatedAt)

### Passo 13: Criar Serviços por Feature
- `TransactionService` (CRUD + regras de negócio)
- `CategoryService` (CRUD + validações)
- `CardService` (CRUD)
- `RecurringModelService` (CRUD + geração)

### Passo 14: Criar Serviços de Cálculo
- `CalculationService` (KPIs, saldos, relatórios)
- Métodos para cálculos mensais e anuais
- Validações de negócio centralizadas

---

## 🎨 FASE 5: Tema e UI Base

### Passo 15: Configurar Angular Material
- Tema customizado (claro/escuro)
- Configurar paleta de cores
- Configurar tipografia

### Passo 16: Criar ThemeService
- Gerenciar tema atual
- Persistir preferência no localStorage
- Aplicar tema dinamicamente

### Passo 17: Criar Componentes Compartilhados
- `LoadingSpinnerComponent`
- `ConfirmDialogComponent`
- `ToastService`
- `EmptyStateComponent`

### Passo 18: Criar Pipes Customizados
- `CurrencyBrPipe` (formatação R$)
- `DateBrPipe` (formatação pt-BR)
- `TransactionTypePipe`

---

## 📊 FASE 6: Dashboard e Relatórios

### Passo 19: Criar DashboardComponent
- KPIs: Receitas, Despesas, Saldo
- Seletor de mês/ano
- Gráfico por categorias (despesas)

### Passo 20: Implementar Relatório Mensal
- Tabela de transações com filtros
- Filtros: tipo, categoria, cartão, texto
- Paginação ou virtual scroll

### Passo 21: Implementar Relatório Anual
- Tabela 12 meses
- Gráfico de linha (receitas/despesas/saldo)
- Indicador % poupança

### Passo 22: Expandir CalculationService
- Métodos específicos para relatórios
- Preparação de dados para gráficos
- Cálculos comparativos entre meses

---

## 💳 FASE 7: Gestão de Transações

### Passo 23: Criar TransactionModule
- `TransactionListComponent`
- `TransactionFormComponent`
- `TransactionDetailComponent`

### Passo 24: Implementar CRUD de Transações
- Criar transação com validações
- Editar transação (manter updatedAt)
- Excluir com confirmação
- Validações: data válida, valor > 0, categoria existente

### Passo 25: Implementar Filtros e Busca
- Filtro por tipo (Receita/Despesa)
- Filtro por categoria
- Filtro por cartão
- Busca por texto (descrição)

---

## 🏷️ FASE 8: Gestão de Categorias

### Passo 26: Criar CategoryModule
- `CategoryListComponent`
- `CategoryFormComponent`
- `CategoryDeleteDialogComponent`

### Passo 27: Implementar CRUD de Categorias
- Criar/editar categoria
- Excluir com opções:
  - Opção A: excluir lançamentos associados
  - Opção B: reatribuir para outra categoria
- Validação de categoria em uso

---

## 💳 FASE 9: Gestão de Cartões

### Passo 28: Criar CardModule
- `CardListComponent`
- `CardFormComponent`
- `CardDeleteDialogComponent`

### Passo 29: Implementar CRUD de Cartões
- Criar/editar cartão
- Excluir cartão
- Vincular transações ao cartão

---

## ⚙️ FASE 10: Configurações

### Passo 30: Criar SettingsModule
- `SettingsComponent`
- Formulário de configurações

### Passo 31: Implementar Configurações
- Salário fixo mensal
- Dia do mês de recebimento
- Tema (claro/escuro/sistema)
- Import/Export JSON
- Reset do app (confirmação dupla)

### Passo 32: Implementar Modelos de Recorrência
- `RecurringModelService`
- Geração manual de lançamentos
- Revisão antes de salvar

---

## 📱 FASE 11: Responsividade e UX

### Passo 33: Implementar Design Responsivo
- Mobile-first approach
- Breakpoints para tablet/desktop
- Navegação adaptativa

### Passo 34: Melhorar UX
- Atalhos de datas recentes
- Categorias recentes
- Botão "+ Novo" sempre visível
- Empty states didáticos
- Feedbacks com toasts

### Passo 35: Implementar Acessibilidade
- Contraste WCAG AA
- Navegação por teclado
- Screen readers
- ARIA labels

---

## 🧪 FASE 12: Testes e Qualidade

### Passo 36: Configurar Testes
- Testes unitários para services de domínio
- Testes de integração para repositórios
- Mocks para StoragePort

### Passo 37: Implementar Validações
- Validações de formulário
- Validações de negócio
- Tratamento de erros

### Passo 38: Configurar Linting
- ESLint com regras Angular
- Prettier para formatação
- Husky para pre-commit hooks

---

## 🚀 FASE 13: Deploy e Finalização

### Passo 39: Configurar Build
- Build de produção otimizado
- Configurar PWA (opcional)
- Configurar service worker

### Passo 40: Testes Finais
- Teste de performance com milhares de lançamentos
- Teste de responsividade
- Teste de acessibilidade
- Validação de todos os critérios de aceite

---

## 📋 Checklist de Validação

### ✅ Funcionalidades Core
- [ ] Login/Registro local funcionando
- [ ] CRUD de transações completo
- [ ] CRUD de categorias com validações
- [ ] CRUD de cartões
- [ ] Dashboard com KPIs corretos
- [ ] Relatórios mensal e anual
- [ ] Configurações funcionais
- [ ] Tema claro/escuro
- [ ] Export/Import JSON

### ✅ Validações de Negócio
- [ ] Validação de salário duplicado
- [ ] Exclusão de categoria com lançamentos
- [ ] Cálculos de saldo corretos
- [ ] Filtros funcionando
- [ ] Formatação pt-BR

### ✅ UX/UI
- [ ] Design responsivo
- [ ] Navegação intuitiva
- [ ] Feedbacks visuais
- [ ] Empty states
- [ ] Acessibilidade básica

### ✅ Técnico
- [ ] TypeScript strict
- [ ] ESLint/Prettier configurado
- [ ] Testes unitários
- [ ] Performance otimizada
- [ ] Arquitetura limpa

---

## 🔄 Próximas Fases (Futuro)

### Fase 2: Melhorias
- IndexedDB para maior volume
- Fechamento mensal
- Orçamentos por categoria
- Filtros avançados

### Fase 3: Backend
- API real com JWT
- Sincronização multi-dispositivo
- Recorrências automáticas
- Consolidação por fatura

---

## 💡 Dicas Importantes

1. **Padronização**: Decida se valores serão em centavos ou decimais e mantenha consistência
2. **Performance**: Use virtual scroll para listas grandes
3. **Arquitetura**: Mantenha interfaces simples, evite over-engineering
4. **UX**: Sempre pense mobile-first
5. **Testes**: Foque nos services de cálculo primeiro
6. **Validações**: Implemente validações tanto no frontend quanto nas regras de negócio
7. **Evolução**: Prepare para migração futura sem complexidade desnecessária

---

**Tempo estimado total: 2-3 semanas (desenvolvimento em tempo parcial)**
