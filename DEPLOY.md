# 🚀 Guia de Deploy - Gestão de Gastos

## ✅ **Status do Projeto**

- ✅ **Build funcionando** - `ng build --configuration production`
- ✅ **PWA implementado** - Service Worker, Manifest, Ícones
- ✅ **Notificações visuais** - Salvamento automático
- ✅ **Todas funcionalidades** - Conforme passos-simplificados.md
- ✅ **Responsivo** - Mobile e Desktop
- ✅ **Offline ready** - localStorage + PWA

---

## 📋 **Passo a Passo - GitHub e Deploy**

### **1. 🐙 Criar Repositório no GitHub**

1. Acesse [GitHub.com](https://github.com)
2. Clique em **"New Repository"**
3. Nome sugerido: `gestao-gastos-app`
4. ✅ Public
5. ❌ **NÃO** adicione README, .gitignore ou license
6. Clique **"Create repository"**

### **2. 📁 Preparar Projeto Local**

```bash
# Na pasta do projeto (R:\Dev\gestao-gastos)
git init
git add .
git commit -m "🎉 Initial commit - App de Gestão de Gastos completo

✅ Funcionalidades implementadas:
- Adicionar/editar gastos com categorias
- Configurações (salário, dias importantes)
- Dashboard com navegação por meses
- Relatórios e análises
- PWA (funciona offline)
- Notificações de salvamento automático
- Design responsivo
- Colorpicker personalizado
- Componentes padronizados

📱 PWA Features:
- Service Worker
- Manifest.json
- Ícones para instalação
- Funciona offline
- Dados salvos localmente

🎨 UX/UI:
- Material Design
- Tons pastéis
- Animações suaves
- Mobile-first"

# Conectar com o repositório remoto (substitua pela SUA URL)
git remote add origin https://github.com/SEU-USUARIO/gestao-gastos-app.git
git branch -M main
git push -u origin main
```

### **3. ⚙️ Configurar GitHub Pages**

1. No seu repositório GitHub, vá em **"Settings"**
2. Role até **"Pages"** (menu lateral)
3. Em **"Source"**, selecione **"GitHub Actions"**
4. Clique **"Save"**

### **4. 🤖 Criar GitHub Action para Deploy Automático**

Crie o arquivo `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build
      run: npm run build
      
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      if: github.ref == 'refs/heads/main'
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist/gastos-simples/browser
```

### **5. 🌐 Configurar Domínio Personalizado**

#### **Opção A: Subdomínio (gastos.seudominio.com)**

1. No seu provedor de domínio (Registro.br, GoDaddy, etc.)
2. Adicione um registro **CNAME**:
   ```
   Nome: gastos
   Valor: SEU-USUARIO.github.io
   ```

3. No GitHub Pages (Settings > Pages):
   - Em **"Custom domain"**, digite: `gastos.seudominio.com`
   - ✅ **"Enforce HTTPS"**

#### **Opção B: Subpasta (seudominio.com/gastos)**

1. Adicione um registro **CNAME**:
   ```
   Nome: www (ou @)
   Valor: SEU-USUARIO.github.io
   ```

2. Configure no GitHub Pages: `seudominio.com`

---

## 🔧 **Scripts Package.json**

Adicione estes scripts no `package.json`:

```json
{
  "scripts": {
    "build": "ng build --configuration production",
    "build:github": "ng build --configuration production --base-href '/gestao-gastos-app/'",
    "deploy:local": "ng build --configuration production && npx http-server dist/gastos-simples/browser -p 8080",
    "test:pwa": "npm run build && npx http-server dist/gastos-simples/browser -p 8080 -c-1"
  }
}
```

---

## 📱 **Testar PWA Localmente**

```bash
# Build e servir localmente
npm run test:pwa

# Abra http://localhost:8080
# Teste:
# ✅ Adicionar transação
# ✅ Fechar navegador e abrir novamente
# ✅ Dados devem permanecer
# ✅ Botão "Instalar App" deve aparecer
# ✅ Funciona offline
```

---

## 🎯 **URLs Finais**

Após o deploy, seu app estará disponível em:

- **GitHub Pages**: `https://SEU-USUARIO.github.io/gestao-gastos-app/`
- **Domínio personalizado**: `https://gastos.seudominio.com`

---

## ✅ **Checklist Final**

### **Antes do Deploy:**
- [ ] Build funcionando: `ng build --configuration production`
- [ ] Repositório GitHub criado
- [ ] Código commitado
- [ ] GitHub Action configurada
- [ ] Domínio configurado (opcional)

### **Após o Deploy:**
- [ ] App carregando na URL
- [ ] Adicionar transação funciona
- [ ] Dados persistem após refresh
- [ ] Funciona no mobile
- [ ] PWA instalável
- [ ] Funciona offline

### **Para sua noiva usar:**
- [ ] Enviar link do app
- [ ] Explicar que pode instalar no celular
- [ ] Dados ficam salvos automaticamente
- [ ] Funciona sem internet
- [ ] Botão "Exportar" para backup

---

## 🆘 **Solução de Problemas**

### **Build falha:**
```bash
# Limpar cache
npm run build -- --delete-output-path
rm -rf node_modules
npm install
```

### **PWA não funciona:**
- Precisa ser HTTPS (GitHub Pages já é)
- Testar em modo incógnito
- Verificar console do navegador

### **Dados não salvam:**
- localStorage deve estar habilitado
- Não usar modo incógnito para testes
- Verificar se há erros no console

### **Deploy falha:**
- Verificar se GitHub Action rodou
- Verificar logs na aba "Actions"
- Pode demorar até 10 minutos

---

## 🎉 **Parabéns!**

Seu app está pronto e deployado! 🚀

**Features implementadas:**
- ✅ Controle completo de gastos
- ✅ PWA (funciona como app nativo)
- ✅ Dados salvos localmente
- ✅ Design profissional
- ✅ Funciona offline
- ✅ Domínio personalizado

**Próximos passos:**
- Compartilhar com sua noiva
- Adicionar ao home screen do celular
- Fazer backup ocasional (botão Exportar)
- Usar diariamente! 💰📱

---

*Criado com ❤️ por Claude & Rafael*
