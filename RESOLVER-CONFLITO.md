# 🔧 Resolver Conflito Git

## O problema:
O GitHub já tem arquivos (README, LICENSE) e o repositório local também. Precisamos sincronizar.

## Solução 1 - Forçar push (mais simples):
```bash
git push -f origin main
```
⚠️ **Isso vai sobrescrever os arquivos do GitHub**

## Solução 2 - Fazer merge (recomendado):
```bash
# 1. Fazer pull permitindo históricos diferentes
git pull origin main --allow-unrelated-histories

# 2. Se houver conflitos, resolve manualmente e depois:
git add .
git commit -m "Merge com arquivos iniciais do GitHub"

# 3. Fazer push
git push origin main
```

## Solução 3 - Começar do zero:
```bash
# 1. Remover remote
git remote remove origin

# 2. Clonar o repositório vazio
cd ..
git clone https://github.com/rafael-ventura/gestao-gastos.git gestao-gastos-novo
cd gestao-gastos-novo

# 3. Copiar arquivos do projeto antigo
# (copie manualmente todos os arquivos exceto .git)

# 4. Adicionar e commitar
git add .
git commit -m "🎉 App de Gestão de Gastos completo"
git push origin main
```

## 🚀 Recomendação:
Use a **Solução 1** (força push) se não se importa em perder o README e LICENSE do GitHub.

Execute:
```bash
git push -f origin main
```

Depois me avise o resultado! 💪
