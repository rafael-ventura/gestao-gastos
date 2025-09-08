# 💰 Gestão de Gastos - PWA

> **App completo para controle de gastos pessoais - funciona offline!**

[![Deploy Status](https://github.com/SEU-USUARIO/gestao-gastos-app/workflows/Deploy%20to%20GitHub%20Pages/badge.svg)](https://github.com/SEU-USUARIO/gestao-gastos-app/actions)
[![PWA](https://img.shields.io/badge/PWA-Ready-brightgreen.svg)](https://web.dev/pwa-checklist/)
[![Angular](https://img.shields.io/badge/Angular-19-red.svg)](https://angular.io/)

## ✨ **Funcionalidades**

### 💸 **Controle de Gastos**
- ✅ Adicionar gastos com descrição, valor e categoria
- ✅ Marcar gastos do cartão de crédito
- ✅ Editar e excluir transações
- ✅ Categorização personalizada com cores

### 📊 **Relatórios e Análises**
- ✅ Dashboard com saldo mensal
- ✅ Gastos por categoria (gráficos)
- ✅ Navegação por meses anteriores
- ✅ Taxa de poupança
- ✅ Gasto médio diário
- ✅ Análise de cartão de crédito

### ⚙️ **Configurações**
- ✅ Configurar salário mensal
- ✅ Dia do salário e vencimento do cartão
- ✅ Gerenciar categorias
- ✅ Colorpicker personalizado (tons pastéis)
- ✅ Export/Import de dados

### 📱 **PWA (Progressive Web App)**
- ✅ **Funciona offline** - dados salvos localmente
- ✅ **Instalável** - adiciona ao home screen
- ✅ **Notificações** - salvamento automático
- ✅ **Responsivo** - mobile e desktop
- ✅ **Rápido** - cache inteligente

---

## 🚀 **Como Usar**

### **1. Acessar o App**
- **URL**: [https://gastos.seudominio.com](https://gastos.seudominio.com)
- **GitHub Pages**: [https://seu-usuario.github.io/gestao-gastos-app](https://seu-usuario.github.io/gestao-gastos-app)

### **2. Instalar no Celular**
1. Abrir no Chrome/Safari
2. Clicar em **"Instalar App"** (aparece automaticamente)
3. Ou: Menu → "Adicionar à tela inicial"

### **3. Usar Offline**
- ✅ Funciona sem internet
- ✅ Dados salvos automaticamente
- ✅ Sincroniza quando voltar online

---

## 🛠️ **Tecnologias**

- **Frontend**: Angular 19 + Angular Material
- **PWA**: Service Worker + Manifest
- **Storage**: localStorage (persistente)
- **Build**: Angular CLI
- **Deploy**: GitHub Actions + GitHub Pages
- **Styling**: SCSS + Material Design

---

## 🎯 **Arquitetura**

```
src/
├── app/
│   ├── core/              # Serviços e modelos
│   │   ├── models/        # Transaction, Category, Settings
│   │   └── services/      # Storage, Calculation, Utils, PWA
│   ├── pages/             # Páginas principais
│   │   ├── home/          # Dashboard principal
│   │   ├── config/        # Configurações
│   │   └── informacoes/   # Relatórios
│   └── shared/            # Componentes reutilizáveis
│       └── components/    # Navigation, Dialogs, ColorPicker
├── assets/                # Ícones PWA
└── manifest.json          # Configuração PWA
```

---

## 💾 **Como os Dados São Salvos**

### **localStorage (Navegador)**
- ✅ **Persistente** - não expira
- ✅ **Offline** - funciona sem internet  
- ✅ **Seguro** - dados ficam no dispositivo
- ✅ **Backup** - botão exportar/importar

### **Compatibilidade**
- ✅ Chrome, Firefox, Safari, Edge
- ✅ Android, iOS
- ✅ Desktop e Mobile

---

## 🔧 **Desenvolvimento**

### **Pré-requisitos**
- Node.js 18+
- Angular CLI 19+

### **Setup Local**
```bash
# Clonar repositório
git clone https://github.com/seu-usuario/gestao-gastos-app.git
cd gestao-gastos-app

# Instalar dependências
npm install

# Rodar localmente
ng serve

# Build para produção
npm run build

# Testar PWA localmente
npm run test:pwa
```

### **Scripts Disponíveis**
```bash
ng serve                    # Desenvolvimento
ng build                    # Build produção
npm run test:pwa           # Testar PWA local
npm run build:github       # Build com base-href
```

---

## 📱 **Screenshots**

### **Desktop**
![Dashboard](docs/desktop-dashboard.png)
![Configurações](docs/desktop-config.png)

### **Mobile**
![Mobile Home](docs/mobile-home.png) ![Mobile PWA](docs/mobile-install.png)

---

## 🔒 **Privacidade e Segurança**

- ✅ **Dados locais** - nunca enviados para servidor
- ✅ **HTTPS** - conexão segura
- ✅ **Sem tracking** - zero analytics
- ✅ **Offline first** - funciona sem internet
- ✅ **Open source** - código auditável

---

## 📈 **Roadmap**

### **v1.0** ✅ *Atual*
- Controle básico de gastos
- PWA completo
- Relatórios mensais

### **v1.1** 🔄 *Próxima*
- Metas de gastos
- Notificações push
- Tema escuro

### **v1.2** 📅 *Futuro*
- Múltiplas contas
- Categorias avançadas
- Gráficos interativos

---

## 🤝 **Contribuindo**

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Commit: `git commit -m 'Adiciona nova funcionalidade'`
4. Push: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

---

## 📄 **Licença**

MIT License - veja [LICENSE](LICENSE) para detalhes.

---

## 💡 **Inspiração**

Criado para casais que querem controlar gastos de forma simples e eficiente, sem depender de apps complexos ou que exigem cadastro.

---

## 🙏 **Agradecimentos**

- [Angular Team](https://angular.io/) - Framework incrível
- [Material Design](https://material.angular.io/) - Componentes lindos
- [PWA Community](https://web.dev/pwa/) - Padrões e boas práticas

---

<div align="center">

**⭐ Se este projeto te ajudou, deixe uma estrela! ⭐**

*Desenvolvido com ❤️ por [Seu Nome](https://github.com/seu-usuario)*

</div>