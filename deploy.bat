@echo off
echo Configurando Git...
git config user.name "Rafael Ventura"
git config user.email "rafael@example.com"

echo Adicionando arquivos...
git add .

echo Fazendo commit...
git commit -m "🎉 Initial commit - App de Gestão de Gastos completo com PWA"

echo Conectando com repositório remoto...
git remote add origin https://github.com/rafael-ventura/gestao-gastos.git

echo Configurando branch main...
git branch -M main

echo Fazendo push...
git push -u origin main

echo Deploy concluído!
pause
