Objetivo: App web simples, bonito e moderno para gestão de gastos, com login/registro, MVP offline-first (dados locais) e arquitetura em camadas preparada para, no futuro, conectar em uma API sem reescrever a UI.

1. Visão Geral

Construir uma aplicação web para controlar finanças pessoais, com:

Login/registro (conta local no MVP) para manter preferências do usuário.

Armazenamento local (LocalStorage/IndexedDB) no MVP.

Camada de serviços/ports desenhada para trocar o driver de dados (Local → HTTP) depois.

Dashboard com resumo mensal e visão anual.

2. Escopo & Limites do MVP

Conta local por navegador (sem sync entre dispositivos no MVP).

Moeda BRL (R$) e formatação pt-BR.

Sem anexos inicialmente.

Lançamentos manuais; recorrências podem ser pré-configuradas, mas geram lançamentos manualmente (ação do usuário) no MVP.

Meses retroativos visíveis até a data de cadastro.

Volume resiliente (milhares de lançamentos performando bem no navegador).

Exportar/Importar JSON para backup/restauração manual.

3. Regras de Negócio
3.1 Transações

Toda transação é ENTRADA (receita) ou SAÍDA (despesa).

Campos obrigatórios: data, valor > 0, categoria.
Opcionais: descrição, forma de pagamento, cartão, etiquetas.

Pode editar/excluir; manter updatedAt.

3.2 Salário & Receitas

Salário fixo mensal configurável em Configurações.

Outras receitas recorrentes como modelos (frequência, valor, categoria).
No MVP, o usuário clica “Gerar lançamentos do mês” para materializar os modelos.

Receitas avulsas (não recorrentes) cadastradas normalmente.

3.3 Categorias

Categorias editáveis. Ao excluir uma categoria em uso:

Opção A: excluir também os lançamentos associados (confirmação forte).

Opção B: reatribuir os lançamentos para outra categoria e só então remover.

(Opcional) Tipo sugerido por categoria (Receita/Despesa) para facilitar filtros.

3.4 Cartão de Crédito

Lançamento pode ter forma de pagamento = Cartão e selecionar “Cartão de crédito X”.

Totais do mês somam gastos normais + gastos no cartão com base na data do lançamento (MVP).

Futuro: consolidação por fatura (fechamento/vencimento por cartão).

3.5 Relatórios & Períodos

Mensal: receitas, despesas, saldo; distribuição por categorias; tabela filtrável.

Anual: visão 12 meses, receitas, despesas, saldo e % poupança (saldo/receitas).

Comparativo com meses anteriores e Top categorias (despesa).

3.6 Configurações

Dia do mês em que recebe (impacta destaques/atalhos).

Tema claro/escuro.

Salário fixo e modelos de recorrência (geração manual no MVP).

4. Requisitos Funcionais (Casos de Uso)

RF001 — Login/Registro (conta local)

Registro com nome, e-mail (opcional no MVP) e senha (hash em storage).

Login simples; prepara migração futura para API.

Recuperação de senha no MVP pode ser local (pergunta-seed); e-mail fica para backend futuro.

RF002 — Cadastrar Transação

Campos: tipo (Receita/Despesa), data, categoria, valor (R$); opcionais: descrição, forma de pagamento, cartão.

Validações: data válida, valor > 0, categoria existente.

Atualiza KPIs do período após salvar.

RF003 — Editar/Excluir Transação

Edição mantém updatedAt; exclusão com confirmação.

RF004 — Gerir Categorias

Criar/renomear/excluir.

Ao excluir: (A) apagar lançamentos junto; ou (B) reatribuir lançamentos.

RF005 — Configurações

Salário fixo mensal, dia de recebimento, tema (claro/escuro), import/export JSON, reset do app.

RF006 — Relatório Mensal (Dashboard)

Seletor mês/ano. KPIs: Receitas, Despesas, Saldo.

Gráfico por categoria (despesas); tabela com filtros rápidos (tipo, categoria, texto, cartão).

RF007 — Relatório Anual

Tabela 12 linhas (meses), receitas, despesas, saldo; gráfico de linha.

Indicador de % poupança por mês.

RF008 — Modelos de Recorrência (MVP manual)

Cadastro de modelos (ex.: “Internet R$120/mês, Contas, Pix”).

Ação “Gerar lançamentos do mês” cria itens no período; usuário pode revisar/editar antes de salvar.

RF009 — Cartões de Crédito

CRUD de cartões: nome, final (futuro: fechamento/vencimento).

Lançamento vincula cardId; relatórios incluem compras de cartão.

Filtros por cartão nos relatórios.

5. Requisitos Não Funcionais (UX/UI & Arquitetura)
UX/UI

Responsivo (mobile-first); tema claro/escuro; contraste WCAG AA básico.

Fluxos curtos: “+ Novo” sempre visível; atalhos de datas e categorias recentes.

Feedbacks: toasts (salvar/editar/excluir); empty states didáticos.

Tabelas com busca e filtros; paginação ou virtual scroll quando necessário.

Máscaras/formatadores pt-BR (moeda, data).

Arquitetura (frontend)

Angular 17+ (standalone) + Angular Material (tema custom).

Camadas:

domain/: entidades, validadores, services de cálculo (ex.: MonthlySummaryService).

ports/: contratos (StoragePort, AuthPort, TransactionRepository, CategoryRepository, CardRepository).

adapters/:

local/: LocalStorageAdapter/IndexedDBAdapter (MVP).

http/ (futuro): HttpApiAdapter (mantém os mesmos ports).

features/: auth, dashboard, transactions, categories, cards, settings.

shared/: pipes, directives, UI atômicos.

core/: ThemeService, ErrorHandler, providers.

Estado: services com Signals/RxJS (evitar over-engineering no MVP).

i18n: locale pt-BR para CurrencyPipe/DatePipe.

Qualidade: TypeScript strict, ESLint + Prettier, testes unitários dos services de domínio.

6. Modelo de Dados (MVP)

User (local)
id, name, email?, passwordHash, createdAt, updatedAt, preferences (theme, firstDayOfMonth).

Settings
salaryFixedMonthly?: number; firstDayOfMonth: 1..31; theme: 'light'|'dark'|'system'; schemaVersion: number.

Category
id, name, kind?: 'INCOME'|'EXPENSE'|'NEUTRAL', color?, createdAt, updatedAt.

Card
id, label, last4?, createdAt, updatedAt. (Futuro: billingDay, dueDay)

Transaction
id, userId, type: 'INCOME'|'EXPENSE', date (ISO YYYY-MM-DD), amount (centavos ou decimal padronizado), categoryId,
paymentMethod?: 'PIX'|'CREDITO'|'DEBITO'|'DINHEIRO'|'OUTRO', cardId?, note?, createdAt, updatedAt.

RecurringModel (MVP manual)
id, label, type, amount, categoryId, paymentMethod?, cardId?,
frequency: 'MONTHLY'|'WEEKLY'|'YEARLY', day?: number, active: boolean, createdAt, updatedAt.
Ação gera Transaction no mês selecionado (com revisão do usuário).

Padrão dos valores: decida uma abordagem (centavos inteiros ou decimal) e padronize em todo o app.

7. Autenticação & Conta (Login/Registro)

Registro local com nome, (e-mail opcional) e senha.
Armazenar passwordHash em storage local (sal + hash, ex.: scrypt via Web Crypto).

Login local valida o hash e guarda um token de sessão local.

Futuro backend: AuthPort passa a delegar para a API (JWT/OAuth2), mesma interface para a UI.

8. Armazenamento & Sincronização

StoragePort: load/save/remove por chave.

Implementação inicial LocalStorage (ou IndexedDB para maior volume).

Chaves por usuário: pf.<userId>.transactions.v1, pf.<userId>.categories.v1, etc.

Export/Import JSON com schemaVersion (facilita migrações).

Migração futura: trocar adapter para HttpApiAdapter que fala com /auth, /transactions, /categories, /cards, /settings.

9. Relatórios (UX/BI)

Dashboard Mensal: KPIs (Receitas, Despesas, Saldo), gráfico por categoria (despesas), tabela filtrável (tipo, categoria, cartão, texto).

Página de Relatórios: comparativos com meses anteriores, Top categorias (despesa), visão anual com gráficos.

Acesso rápido para alterar mês/ano (seletor global).

10. Configurações

Salário fixo mensal (R$).

Dia do mês que recebe (impacta destaques/atalhos).

Tema (claro/escuro/sistema).

Modelos de recorrência (cadastrar/editar/ativar/desativar; geração manual).

Importar/Exportar JSON; Reset do app (confirmação dupla).

11. User Stories

Como usuário, quero registrar uma despesa rápida informando valor, categoria e data para controlar meus gastos.

Como usuário, quero cadastrar meu salário fixo para ver automaticamente o saldo do mês.

Como usuário, quero criar modelos de lançamentos recorrentes e gerar os do mês com um clique.

Como usuário, quero marcar um gasto como “Cartão de crédito X” para filtrar e somar junto com os gastos normais.

Como usuário, quero relatórios mensais e anuais com gráficos claros e filtros simples.

Como usuário, quero exportar meus dados em JSON para backup.

12. Critérios de Aceite (exemplos)

Cadastro simples
Dado que estou na tela de “Novo lançamento”
Quando seleciono Despesa, data válida, categoria “Alimentação”, R$ 35,00
Então o lançamento aparece na lista do mês e Despesas aumenta em R$ 35,00.

Salário fixo + alerta
Dado que configurei salário fixo R$ 3.000
E criei uma receita “Salário” no mês corrente
Então o sistema sinaliza possível contagem dupla no resumo mensal.

Excluir categoria com uso
Dado que a categoria “Transporte” possui lançamentos
Quando tento excluí-la
Então devo escolher entre apagar lançamentos ou reatribuir para outra categoria antes de confirmar.

13. Arquitetura Frontend (Angular)

Padrões

Angular standalone components, Angular Material, tema light/dark.

Services de domínio com Signals/RxJS; pipes pt-BR para moeda/data.

Ports (interfaces)

StoragePort
load<T>(key): Promise<T|null> • save<T>(key,data): Promise<void> • remove(key): Promise<void>

AuthPort
register(...) • login(...) • logout()

Repositories
TransactionRepository, CategoryRepository, CardRepository (CRUD + queries por mês/ano).

Adapters

LocalStorageAdapter (MVP): serializa JSON com schemaVersion; chaves por userId.

HttpApiAdapter (futuro): fetch/HttpClient mantendo as mesmas interfaces.

Estrutura de pastas (sugestão)

app/
  core/
  domain/
  ports/
  adapters/
    local/
    http/
  features/
    auth/
    dashboard/
    transactions/
    categories/
    cards/
    settings/
  shared/


Build/Qualidade
TypeScript strict • ESLint + Prettier • testes unitários dos services de cálculo.

14. Contratos de API (Futuro, referência)

Auth

POST /auth/register { name, email?, password } → { user, jwt }

POST /auth/login { email, password } → { user, jwt }

Transactions

GET /transactions?month=&year=&type=&categoryId=&cardId=

POST /transactions • PUT /transactions/:id • DELETE /transactions/:id

Categories, Cards, Settings

CRUD equivalentes.

O frontend conversa via ports; ao trocar Local → HTTP, a UI não muda.

15. Roadmap de Evolução

Fase 1 (MVP): Auth local, CRUD transações/categorias/cartões, salário fixo, modelos de recorrência (geração manual), relatórios mensal/anual, export/import JSON, tema dark.

Fase 2: IndexedDB, fechamento mensal, orçamentos por categoria, filtros avançados, acessibilidade reforçada.

Fase 3: Backend (login real, sync), recorrências automáticas, consolidação por fatura (cartão), anexos, multi-dispositivo.

16. Anexos — Convenções

Datas internas em ISO (YYYY-MM-DD).

Valores: padronizar (centavos inteiros ou decimal).

IDs: UUID v4.

Erros: mensagens amigáveis ao usuário (sem stack técnico).

Dica de “Prompt-mestre” (para gerar o projeto no Cursor/IA)

Objetivo: Projeto Angular 17+ (standalone) para gestão de gastos, offline-first com LocalStorage através de StoragePort, pronto para trocar por HttpApiAdapter.
Gerar: estrutura de pastas acima; entities/repos; LocalStorageAdapter; serviços de cálculo (KPIs, saldo, %); telas auth, dashboard, transactions, categories, cards, settings; validações; alerta de salário duplicado; ThemeService (light/dark); export/import JSON; TypeScript strict; ESLint+Prettier; testes mínimos em services.
Não incluir (MVP): anexos, sync, fatura de cartão (apenas preparo), multi-dispositivo.
