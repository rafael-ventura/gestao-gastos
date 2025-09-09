# 🚀 Comandos Git para Deploy

## Execute estes comandos manualmente no terminal:

### 1. Configurar Git (se necessário):
```bash
git config user.name "Rafael Ventura"
git config user.email "seu-email@example.com"
```

### 2. Adicionar todos os arquivos:
```bash
git add .
```

### 3. Fazer commit:
```bash
git commit -m "🎉 Initial commit - App de Gestão de Gastos completo"
```

### 4. Conectar com repositório remoto:
```bash
git remote add origin https://github.com/rafael-ventura/gestao-gastos.git
```

### 5. Configurar branch principal:
```bash
git branch -M main
```

### 6. Fazer push:
```bash
git push -u origin main
```

---

## ✅ Após o push, configure o GitHub Pages:

1. Vá em: https://github.com/rafael-ventura/gestao-gastos/settings/pages
2. Em **"Source"**, selecione **"GitHub Actions"**
3. Aguarde o deploy automático (5-10 minutos)
4. Seu app estará em: https://rafael-ventura.github.io/gestao-gastos/

---

## 🌐 Para configurar domínio personalizado:

1. No seu provedor de domínio, adicione:
   - **Tipo**: CNAME
   - **Nome**: gastos (ou o que preferir)
   - **Valor**: rafael-ventura.github.io

2. No GitHub Pages, adicione o domínio personalizado:
   - **Custom domain**: gastos.seudominio.com
   - ✅ **Enforce HTTPS**

---

## 🎯 URLs finais:
- **GitHub Pages**: https://rafael-ventura.github.io/gestao-gastos/
- **Domínio personalizado**: https://gastos.seudominio.com

Execute os comandos um por vez no seu terminal! 🚀
