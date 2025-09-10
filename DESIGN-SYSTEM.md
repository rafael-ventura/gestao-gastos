# 🎨 DESIGN SYSTEM - GESTÃO DE GASTOS

## 🎯 Objetivo
Este documento serve como manual de referência para todos os aspectos visuais e de estilização do projeto Gestão de Gastos, garantindo consistência e facilitando futuras modificações.

---

## 🎨 PALETA DE CORES

### 🌈 **Cores Principais**
```scss
// Rosa/Coral Pastel - Cor primária do projeto
--primary-50: #fef7f7;
--primary-100: #fde8e8;
--primary-200: #fccfcf;
--primary-300: #fab4b4;
--primary-400: #f68a8a;
--primary-500: #f56565;  // Cor principal
--primary-600: #e84142;
--primary-700: #d63031;
--primary-800: #b32728;
--primary-900: #8b1f20;
```

### 💰 **Cores Financeiras**
```scss
// Status de saldo
--balance-positive: #10b981;     // Verde para receitas/saldo positivo
--balance-positive-light: #34d399;
--balance-positive-dark: #059669;

--balance-negative: #ef4444;     // Vermelho para gastos/saldo negativo
--balance-negative-light: #f87171;
--balance-negative-dark: #dc2626;

--balance-neutral: #6b7280;      // Cinza para saldo zero
--balance-neutral-light: #9ca3af;
--balance-neutral-dark: #4b5563;
```

### 🎭 **Cores de Status**
```scss
// Sucesso
--success-400: #4ade80;
--success-500: #22c55e;
--success-600: #16a34a;

// Aviso
--warning-400: #fbbf24;
--warning-500: #f59e0b;
--warning-600: #d97706;

// Erro
--error-400: #f87171;
--error-500: #ef4444;
--error-600: #dc2626;
```

### ⚪ **Cores Neutras**
```scss
// Escala de cinzas moderna
--gray-50: #fafbfc;
--gray-100: #f4f6f8;
--gray-200: #e9ecef;
--gray-300: #dee2e6;
--gray-400: #ced4da;
--gray-500: #adb5bd;
--gray-600: #868e96;
--gray-700: #495057;
--gray-800: #343a40;
--gray-900: #212529;
```

### 🌸 **Cores Pastéis (Categorias)**
```scss
--pastel-pink: #FFB3BA;
--pastel-peach: #FFDFBA;
--pastel-yellow: #FFFFBA;
--pastel-mint: #BAFFC9;
--pastel-blue: #BAE1FF;
--pastel-lavender: #D4BAFF;
```

### 💳 **Cores Pastéis para Transações**
```scss
// Fundos pastéis para cards de transação
--income-bg-light: #f0fdf4;    // Verde muito claro para receitas
--income-bg-medium: #dcfce7;   // Verde claro para receitas
--income-bg-hover: #bbf7d0;    // Verde hover para receitas
--income-border: #22c55e;      // Verde da borda esquerda

--expense-bg-light: #fef2f2;   // Vermelho muito claro para gastos
--expense-bg-medium: #fee2e2;  // Vermelho claro para gastos  
--expense-bg-hover: #fecaca;   // Vermelho hover para gastos
--expense-border: #ef4444;     // Vermelho da borda esquerda

--neutral-bg-light: #f9fafb;   // Cinza muito claro para neutro
--neutral-bg-medium: #f3f4f6;  // Cinza claro para neutro
--neutral-bg-hover: #e5e7eb;   // Cinza hover para neutro
--neutral-border: #6b7280;     // Cinza da borda esquerda
```

---

## 🎨 GRADIENTES

### 💳 **Cards de Saldo (Tema Escuro)**
```scss
// Gradientes para fundos escuros com melhor contraste
--gradient-positive: linear-gradient(135deg, #1f2937 0%, #111827 100%);
--gradient-negative: linear-gradient(135deg, #1f1f1f 0%, #0f0f0f 100%);
--gradient-neutral: linear-gradient(135deg, #374151 0%, #1f2937 100%);
--gradient-default: linear-gradient(135deg, #1f2937 0%, #111827 100%);
```

### ✨ **Gradientes Decorativos**
```scss
--gradient-primary: linear-gradient(135deg, var(--primary-400) 0%, var(--primary-500) 100%);
--gradient-success: linear-gradient(135deg, var(--success-400) 0%, var(--success-500) 100%);
--gradient-warning: linear-gradient(135deg, var(--warning-400) 0%, var(--warning-500) 100%);
```

---

## 🌫️ SOMBRAS

### 📦 **Sombras Padrão**
```scss
--shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.03);
--shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.06), 0 1px 2px 0 rgba(0, 0, 0, 0.04);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.04);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.03);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.02);
```

### 🎨 **Sombras Coloridas (Cards)**
```scss
--shadow-positive: 0 10px 25px -5px rgba(16, 185, 129, 0.2), 0 10px 10px -5px rgba(16, 185, 129, 0.1);
--shadow-negative: 0 10px 25px -5px rgba(239, 68, 68, 0.2), 0 10px 10px -5px rgba(239, 68, 68, 0.1);
--shadow-neutral: 0 10px 25px -5px rgba(107, 114, 128, 0.2), 0 10px 10px -5px rgba(107, 114, 128, 0.1);
--shadow-default: 0 10px 25px -5px rgba(245, 101, 101, 0.2), 0 10px 10px -5px rgba(245, 101, 101, 0.1);
```

---

## 🔘 BORDAS E RAIOS

### 📐 **Border Radius**
```scss
--radius-sm: 8px;    // Elementos pequenos
--radius-md: 12px;   // Botões, inputs
--radius-lg: 16px;   // Cards menores
--radius-xl: 20px;   // Cards principais
--radius-2xl: 24px;  // Modais, containers grandes
--radius-3xl: 32px;  // Elementos especiais
```

### 📋 **Uso Recomendado:**
- **sm (8px)**: Chips, badges, elementos pequenos
- **md (12px)**: Botões, inputs, form fields
- **lg (16px)**: Cards de categoria, elementos médios
- **xl (20px)**: Cards principais, seções
- **2xl (24px)**: Modais, containers principais
- **3xl (32px)**: Elementos especiais, hero sections

---

## 🔤 TIPOGRAFIA

### 📝 **Fonte Principal**
```scss
font-family: 'Inter', 'Roboto', "Helvetica Neue", Arial, sans-serif;
```

### 📏 **Escala Tipográfica**
```scss
// Títulos
h1: 2.25rem (36px) - font-weight: 700
h2: 1.875rem (30px) - font-weight: 600
h3: 1.5rem (24px) - font-weight: 600
h4: 1.25rem (20px) - font-weight: 500

// Textos
body: 1rem (16px) - font-weight: 400
small: 0.875rem (14px) - font-weight: 400
caption: 0.75rem (12px) - font-weight: 400
```

### 🎨 **Cores de Texto**
```scss
// Sobre fundo claro
--text-primary: var(--gray-900);
--text-secondary: var(--gray-700);
--text-muted: var(--gray-500);

// Sobre fundo escuro
--text-white: #ffffff;
--text-white-muted: rgba(255, 255, 255, 0.8);
--text-white-subtle: rgba(255, 255, 255, 0.6);
```

---

## 📦 COMPONENTES PADRONIZADOS

### 🃏 **Cards**

#### 💳 **Card de Saldo Principal**
```scss
.balance-card {
  background: var(--gradient-default); // ou positive/negative baseado no saldo
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-default);
  color: white;
  padding: 32px;
  
  &.positive { background: var(--gradient-positive); }
  &.negative { background: var(--gradient-negative); }
  &.neutral { background: var(--gradient-neutral); }
}
```

#### 📋 **Cards de Transações**
```scss
.transactions-card {
  background: white;
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  color: var(--gray-800);
  margin-bottom: 24px;
}

// Itens de transação com cores pastéis
.transaction-item {
  padding: 16px;
  margin: 8px 0;
  border-radius: var(--radius-lg);
  border-left: 4px solid transparent;
  transition: all 0.2s ease;
  
  // Receitas (ganhos) - Verde pastel
  &.income-transaction {
    background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
    border-left-color: #22c55e;
    
    &:hover {
      background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
      transform: translateX(4px);
    }
  }
  
  // Gastos (perdas) - Vermelho pastel
  &.expense-transaction {
    background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
    border-left-color: #ef4444;
    
    &:hover {
      background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
      transform: translateX(4px);
    }
  }
}
```

#### 🏷️ **Cards de Categoria**
```scss
.category-card {
  background: white;
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  padding: 16px;
  transition: all 0.2s ease;
  
  &:hover {
    box-shadow: var(--shadow-md);
    transform: translateY(-2px);
  }
}
```

### 🔘 **Botões**

#### 🎯 **Botão Principal**
```scss
.primary-button {
  background: var(--gradient-primary);
  color: white;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  font-weight: 500;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }
}
```

#### ⚡ **Botão de Ação Rápida**
```scss
.quick-action-button {
  background: var(--gradient-warning);
  color: white;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  box-shadow: var(--shadow-md);
  
  &:hover {
    transform: translateY(-2px) scale(1.1);
  }
}
```

### 📝 **Inputs e Forms**

#### 📋 **FormInputComponent (Padrão)**
```scss
.form-input {
  background: white;
  border: 2px solid var(--gray-300);
  border-radius: var(--radius-lg);
  transition: all 0.2s ease;
  
  &:hover { border-color: var(--primary-400); }
  &:focus { 
    border-color: var(--primary-500);
    box-shadow: 0 0 0 3px rgba(245, 101, 101, 0.1);
  }
}
```

#### 🔄 **Seletor de Tipo de Transação**
```scss
.transaction-type-selector {
  margin-bottom: 24px;
  
  .type-toggle-container {
    display: flex;
    background: var(--gray-100);
    border-radius: var(--radius-xl);
    padding: 4px;
    gap: 4px;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.06);
  }
  
  .type-button {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px 16px;
    border-radius: var(--radius-lg);
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    
    &.active.expense-button {
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      color: white;
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
    }
    
    &.active.income-button {
      background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
      color: white;
      box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
    }
  }
}
```

### 🪟 **Modais**

#### 💬 **Modal Padrão**
```scss
.modal-container {
  background: #fafbfc;
  border-radius: var(--radius-2xl);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
  border: 1px solid var(--gray-300);
}

.modal-backdrop {
  background: rgba(0, 0, 0, 0.4); // Menos escuro
}
```

---

## 🎭 ESTADOS VISUAIS

### 💰 **Estados Financeiros**
```scss
// Valores positivos (receitas)
.positive-value {
  color: #51cf66; // Verde mais claro para melhor contraste
  text-shadow: 0 2px 4px rgba(81, 207, 102, 0.3);
}

// Valores negativos (gastos)
.negative-value {
  color: #ff6b6b; // Vermelho mais claro para melhor contraste
  text-shadow: 0 2px 4px rgba(255, 107, 107, 0.3);
}

// Valores neutros
.neutral-value {
  color: #9ca3af;
}
```

### 🎯 **Estados de Interação**
```scss
// Hover padrão
.hover-effect {
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }
}

// Loading
.loading-state {
  opacity: 0.5;
  pointer-events: none;
}
```

---

## 📱 RESPONSIVIDADE

### 📐 **Breakpoints**
```scss
// Mobile first
$mobile: 0px;
$tablet: 768px;
$desktop: 1024px;
$large: 1200px;

@media (max-width: 767px) { /* Mobile */ }
@media (min-width: 768px) and (max-width: 1023px) { /* Tablet */ }
@media (min-width: 1024px) { /* Desktop */ }
```

### 📋 **Regras Responsivas**
- **Mobile**: Padding reduzido (8px), botões full-width, navbar-aware spacing
- **Tablet**: Layout em colunas, padding médio (16px)  
- **Desktop**: Layout completo, padding padrão (24px)

### 📱 **Ajustes para PWA Mobile**
```scss
// Botão flutuante acima da navbar
.floating-add-button {
  @media (max-width: 768px) {
    bottom: 80px; // Acima da navbar mobile
  }
  
  @media (max-width: 480px) {
    bottom: 72px; // Ajuste para telas pequenas
  }
}

// Container com espaço para navbar
.home-container {
  @media (max-width: 768px) {
    padding-bottom: 120px; // Espaço para navbar + botão
  }
}

// Snackbar acima da navbar
.mat-mdc-snack-bar-container {
  @media (max-width: 768px) {
    bottom: 80px !important;
  }
}
```

### 📏 **Espaçamentos Padrão**
```scss
// Container principal
.home-container {
  padding: 16px;
  padding-bottom: 100px; // Espaço para botão flutuante
  gap: 32px; // Entre seções principais
}

// Cards de transação
.transaction-item {
  padding: 16px;
  margin: 8px 0; // Entre itens individuais
}

.transactions-card {
  margin-bottom: 24px; // Entre cards principais
}
```

---

## ✨ ANIMAÇÕES

### 🎬 **Animações Padrão**
```scss
// Entrada suave
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// Pulso para elementos importantes
@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}
```

### ⚡ **Transições**
```scss
// Transição padrão
transition: all 0.2s ease;

// Transição suave
transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
```

---

## 🎨 TEMAS ESPECÍFICOS

### 🌙 **Tema Escuro (Cards)**
Aplicado nos cards de transações para melhor contraste:
```scss
background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
color: #e0e0e0;
border: 1px solid #3a3a3a;

// Textos
.text-muted { color: rgba(224, 224, 224, 0.7); }
.text-primary { color: #e0e0e0; }
```

### 🌅 **Tema Claro (Modais/Forms)**
Aplicado em modais e formulários:
```scss
background: #fafbfc;
color: var(--gray-800);
border: 1px solid var(--gray-300);
```

---

## 🛠️ UTILITÁRIOS CSS

### 🎨 **Classes Utilitárias**
```scss
// Bordas arredondadas
.rounded-sm { border-radius: var(--radius-sm); }
.rounded-md { border-radius: var(--radius-md); }
.rounded-lg { border-radius: var(--radius-lg); }
.rounded-xl { border-radius: var(--radius-xl); }

// Sombras
.shadow-sm { box-shadow: var(--shadow-sm); }
.shadow-md { box-shadow: var(--shadow-md); }
.shadow-lg { box-shadow: var(--shadow-lg); }

// Cores de texto
.text-positive { color: var(--balance-positive); }
.text-negative { color: var(--balance-negative); }
.text-muted { color: var(--gray-500); }
```

---

## 📋 CHECKLIST DE CONSISTÊNCIA

### ✅ **Ao Criar Novos Componentes**
- [ ] Usar variáveis CSS definidas no design system
- [ ] Aplicar border-radius consistente
- [ ] Usar sombras padronizadas
- [ ] Seguir escala tipográfica
- [ ] Implementar estados hover/focus
- [ ] Considerar versão mobile
- [ ] Aplicar cores financeiras adequadas

### 🎯 **Ao Modificar Estilos Existentes**
- [ ] Verificar impacto em outros componentes
- [ ] Manter consistência de cores
- [ ] Atualizar este documento se necessário
- [ ] Testar em diferentes tamanhos de tela
- [ ] Validar contraste de cores

---

## 🔧 MANUTENÇÃO

### 📅 **Atualizações Regulares**
- Revisar cores e contrastes mensalmente
- Verificar consistência entre componentes
- Atualizar este documento com mudanças
- Testar responsividade em novos dispositivos

### 🎨 **Futuras Melhorias**
- Implementar tema escuro completo
- Adicionar mais variações de cores pastéis
- Criar componentes de gráficos padronizados
- Implementar sistema de tokens mais robusto

---

## 📝 NOTAS IMPORTANTES

### ⚠️ **Cuidados Especiais**
- **Contraste**: Sempre verificar acessibilidade de cores
- **Performance**: Evitar animações desnecessárias
- **Consistência**: Usar sempre as variáveis CSS definidas
- **Mobile**: Priorizar experiência mobile-first

### 🎯 **Filosofia do Design**
- **Simplicidade**: Visual limpo e organizado
- **Clareza**: Informações financeiras sempre visíveis
- **Modernidade**: Design atual com elementos glassmorphism
- **Funcionalidade**: Estética nunca deve comprometer usabilidade

---

*Documento criado em: Setembro 2025*  
*Última atualização: Setembro 2025*  
*Versão: 1.0*
