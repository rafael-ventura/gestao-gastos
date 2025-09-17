# 💰 Gestão de Gastos

> **PWA para controle de gastos pessoais - funciona offline!**

[![Angular](https://img.shields.io/badge/Angular-19-red)](https://angular.io/)
[![PWA](https://img.shields.io/badge/PWA-Ready-brightgreen)](https://web.dev/pwa-checklist/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

## 🎯 **Sobre o Projeto**

App web moderno para controle financeiro pessoal, desenvolvido com Angular 19 e foco em simplicidade e funcionalidade. Funciona 100% offline, salvando dados no seu navegador, sem necessidade de cadastro ou login.

### 🌟 **Destaques**
- **100% Offline** - Funciona sem internet
- **PWA Completo** - Instala como app nativo
- **Design Moderno** - Interface limpa e intuitiva
- **Mobile-First** - Otimizado para celular
- **Zero Tracking** - Sua privacidade é respeitada

---

## 🚀 **Funcionalidades**

### 💰 **Gestão Financeira**
- ✅ **Controle de gastos** - Adicionar, editar, categorizar transações
- ✅ **Salário automático** - Adiciona salário mensal automaticamente
- ✅ **Categorias personalizadas** - Organize seus gastos por categoria
- ✅ **Cartão de crédito** - Marque gastos no cartão
- ✅ **Dashboard inteligente** - Saldo mensal, receitas vs gastos

### 📊 **Relatórios e Análises**
- ✅ **KPIs financeiros** - Métricas principais do mês
- ✅ **Gastos por categoria** - Breakdown detalhado
- ✅ **Histórico mensal** - Comparativo entre 12 meses
- ✅ **Taxa de poupança** - Percentual poupado
- ✅ **Maior gasto** - Transação de maior valor

### ⚙️ **Configurações**
- ✅ **Salário mensal** - Configure seu salário
- ✅ **Dias importantes** - Dia do salário e vencimento cartão
- ✅ **Categorias** - Crie e personalize categorias
- ✅ **Backup/Export** - Exporte seus dados
- ✅ **Tema escuro** - Interface moderna

---

## 🛠️ **Tecnologias**

- **Angular 19** - Framework principal
- **TypeScript 5.0** - Tipagem estática
- **Angular Material** - Componentes UI
- **SCSS** - Estilos avançados
- **PWA** - Service Worker + Manifest
- **LocalStorage** - Dados persistentes offline

---

## 📱 **Como Usar**

### **Online**
- Acesse: [https://seu-app.vercel.app](https://seu-app.vercel.app)

### **Instalar no Celular**
1. Abra no Chrome/Safari
2. Toque em "Instalar App" 
3. Use como app nativo!

### **Primeiros Passos**
1. **Configure seu salário** - Vá em Configurações
2. **Adicione gastos** - Use o botão "+" na tela inicial
3. **Organize por categoria** - Crie categorias personalizadas
4. **Acompanhe relatórios** - Veja análises em Informações

---

## ⚡ **Desenvolvimento**

### **Pré-requisitos**
- Node.js 18+
- Angular CLI 19+

### **Instalação**
```bash
# Clone o repositório
git clone https://github.com/rafael-ventura/gestao-gastos.git
cd gestao-gastos

# Instale dependências
npm install

# Execute em desenvolvimento
ng serve

# Acesse: http://localhost:4200
```

### **Build e Deploy**
```bash
# Build para produção
ng build --configuration production

# Deploy (exemplo Vercel)
vercel --prod
```

---

## 🔒 **Privacidade e Dados**

### **100% Local**
- ✅ **Dados salvos no navegador** - LocalStorage do seu dispositivo
- ✅ **Zero tracking** - Sem analytics ou cookies
- ✅ **Sem cadastro** - Use imediatamente
- ✅ **Open source** - Código auditável

### **⚠️ Importante sobre Dados**
- **Seus dados ficam apenas no seu navegador**
- **Nós não temos acesso aos seus dados**
- **Se limpar o navegador, os dados são perdidos**
- **Use o Export para fazer backup**

### **💡 Alternativa para Backup**
- Use a função **Export** em Configurações
- Salve o arquivo JSON em local seguro
- Use **Import** para restaurar em outro dispositivo

---

## 🎨 **Design System**

O projeto segue um design system consistente com:
- **Cores pastéis** - Paleta suave e moderna
- **Componentes reutilizáveis** - FormInput, BaseDialog, etc.
- **Tema escuro** - Interface elegante
- **Responsividade** - Mobile-first design
- **Animações** - Transições suaves

Veja mais detalhes em [DESIGN-SYSTEM.md](DESIGN-SYSTEM.md)

---

## 📚 **Documentação**

- **[Guia de Desenvolvimento](GUIA-DESENVOLVIMENTO.md)** - Como desenvolver e contribuir
- **[Status das Features](FEATURES-STATUS.md)** - Funcionalidades implementadas
- **[Design System](DESIGN-SYSTEM.md)** - Padrões visuais e componentes

---

## 🤝 **Contribuindo**

### **Como Contribuir**
1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### **Reportando Bugs**
- Use a aba [Issues](https://github.com/rafael-ventura/gestao-gastos/issues)
- Descreva o problema detalhadamente
- Inclua passos para reproduzir

### **Sugerindo Features**
- Abra uma [Issue](https://github.com/rafael-ventura/gestao-gastos/issues) com label "enhancement"
- Descreva a funcionalidade desejada
- Explique o valor para os usuários

---

## 🎉 **Histórico do Projeto**

### **Setembro 2025 - Versão 2.0**
- ✅ **Modal customizado** - Substituído Angular Material Dialog
- ✅ **Tema unificado** - Navbar, modais e header consistentes  
- ✅ **Inputs otimizados** - Altura, padding e posicionamento melhorados
- ✅ **FormInputComponent** - Componente reutilizável limpo
- ✅ **Página relatórios** - Modernizada com tema escuro e filtros
- ✅ **Sistema de salário** - Adição automática e sincronização
- ✅ **Documentação** - Design system e guias completos

### **Futuro**
- 🔮 **Gráficos interativos** - Charts avançados
- 🔮 **Metas financeiras** - Acompanhamento de objetivos
- 🔮 **Notificações** - Alertas de gastos
- 🔮 **Sincronização** - Cloud storage opcional

---

## 📂 **Estrutura do Projeto**

```
src/app/
├── core/                    # Serviços e modelos
│   ├── services/           # Lógica de negócio
│   └── models/             # Interfaces TypeScript
├── pages/                  # Páginas principais
│   ├── home/              # Dashboard
│   ├── config/            # Configurações
│   └── informacoes/       # Relatórios
├── shared/                 # Componentes reutilizáveis
│   └── components/        # FormInput, BaseDialog, etc.
└── styles.scss            # Tema global
```

---

## 🐛 **Problemas Conhecidos**

- **Dados no LocalStorage** - Se limpar o navegador, dados são perdidos
- **Sem sincronização** - Dados não sincronizam entre dispositivos
- **Limite de dados** - LocalStorage tem limite de ~5-10MB

### **Soluções**
- Use Export/Import para backup
- Mantenha backups regulares
- Para muitos dados, considere migração futura

---

## 📄 **Licença**

MIT License - use livremente!

Veja [LICENSE](LICENSE) para mais detalhes.

---

## 🙏 **Agradecimentos**

- **Angular Team** - Framework incrível
- **Angular Material** - Componentes de qualidade
- **Comunidade** - Feedback e sugestões
- **Você** - Por usar o projeto! ❤️

---

## 📞 **Suporte**

### **Precisa de Ajuda?**
- 📖 **Documentação** - Consulte os guias acima
- 🐛 **Bug Report** - Abra uma Issue
- 💡 **Sugestão** - Compartilhe sua ideia
- ⭐ **Estrela** - Se gostou, deixe uma estrela!

### **Funcionalidade Gratuita**
Use essa funcionalidade que outros pagam caro e mensal por aí! 😄

---

<div align="center">

**⭐ Útil? Deixe uma estrela! ⭐**

*Feito com ❤️ para controle financeiro simples*

**🚀 Use essa funcionalidade que outros pagam caro e mensal por aí! 🚀**

</div>