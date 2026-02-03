# MecânicaPro SaaS - Frontend Challenge

Frontend de alta performance e arquitetura robusta desenvolvido para a gestão de oficinas mecânicas. Este projeto foi construído para demonstrar maturidade técnica através da aplicação rigorosa de **SOLID**, **Clean Code** e padrões idiomáticos de **React**.

## 🚀 Como Executar Localmente

Siga os passos abaixo para rodar o projeto em sua máquina:

1. **Clone o repositório:**
   ```bash
   git clone [url-do-repositorio]
   cd mecanica-pro-saas
   ```

2. **Instale as dependências:**
   Este projeto utiliza ESM via CDN e importmaps para simplicidade no ambiente de teste, mas em um ambiente local padrão:
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

4. **Credenciais de Acesso (Mock):**
   - **E-mail:** `admin@mecanica.com`
   - **Senha:** `123456`

---

## 🧠 Principais Decisões Técnicas

### 1. Arquitetura e Inversão de Dependência (DIP)
- **Camada de Services:** Toda a comunicação externa é isolada em `services/`. A UI não conhece detalhes de implementação (fetch/axios). Se a API mudar de REST para GraphQL, apenas a camada de service é alterada.
- **Custom Hooks de Domínio:** O estado complexo e as regras de negócio (como busca com debounce, filtros e ordenação) foram encapsulados em Hooks (ex: `useClients`). Isso torna os componentes puramente visuais e fáceis de testar.

### 2. Responsabilidade Única (SRP) e Composição
- **Atomicidade de Componentes:** Criamos componentes base como `Input`, `Select` e `Modal`. O componente `Form` é um motor genérico que aceita um esquema de validação e definições de campos, permitindo que o `ClientForm` seja apenas uma configuração declarativa.
- **DataTable Inteligente:** A tabela é altamente flexível e controlada por props. Ela decide o que renderizar (busca, filtros, ordenação) baseada na presença dos handlers, seguindo o padrão de "Feature Toggling" via código.

### 3. Validação e Segurança de Tipos
- **Zod Schema:** Utilizamos o Zod para validação de esquemas em tempo de execução. Isso garante que os dados que entram no sistema respeitem as regras de negócio (ex: validação condicional de CPF vs CNPJ) antes mesmo de chegarem ao service.

### 4. Gestão de Estado e Feedback
- **Context API Estrito:** Utilizada apenas para estados globais transversais: Autenticação e Notificações (Popups). 
- **Notification System:** Implementamos um `NotificationProvider` que permite disparar diálogos de confirmação e erro de qualquer lugar da app sem criar acoplamento visual.

---

## 🏗️ O que eu faria diferente em Produção

Embora o desafio foque em fundamentos, um sistema em escala real exigiria:

1. **Server-State Management:** Substituiria o gerenciamento manual de estados por **TanStack Query (React Query)**. Isso resolveria cache de dados, invalidação de consultas e estados de loading de forma nativa e performante.
2. **Segurança de Tokens:** Em produção, tokens JWT nunca devem ficar no `localStorage` devido a ataques XSS. Utilizaria **HttpOnly Cookies** e implementaria um fluxo de **Refresh Tokens**.
3. **Testes Automatizados:**
   - **Unitários/Integration:** Vitest + React Testing Library para validar os hooks de lógica e os validadores de documentos.
   - **E2E:** Playwright ou Cypress para garantir que o fluxo de login e cadastro de clientes não quebre após novos deploys.
4. **Observabilidade:** Integração com **Sentry** para captura de erros em tempo real e ferramentas de RUM (Real User Monitoring) para medir a performance da página no cliente.
5. **Acessibilidade (a11y):** Implementação total de atributos ARIA e suporte rigoroso à navegação por teclado, garantindo conformidade com o WCAG.
6. **Internacionalização (i18n):** Uso de `react-i18next` para preparar o SaaS para mercados fora do Brasil.
7. **Business Intelligence & Data Strategy:**
   - **Dashboard de KPIs:** Implementação de uma visão gerencial (telas de Dashboard) com métricas de Ticket Médio por cliente, frequência de retorno e identificação de clientes inativos para ações de marketing.
   - **Data Enrichment:** Integração com APIs externas (como consulta de placa/chassi) para automação de dados de veículos, reduzindo o esforço de digitação e aumentando a precisão da base de dados.
   - **Analytics Avançado:** Uso de ferramentas como Mixpanel para realizar estudos de comportamento e otimizar a jornada do usuário no sistema.

---

## 📌 Roadmap de Refatoração (Tech Debt Control)

Para garantir a evolução sustentável do código e o controle de débitos técnicos, os seguintes passos são planejados:

1. **Middleware de Máscaras:** Desacoplar a lógica de formatação (`formatPhone`, `formatDocument`) do componente genérico `Form.tsx`. O ideal é injetar funções de `transform` na definição dos campos, removendo o conhecimento de regras de negócio específicas de dentro do motor de formulários.
2. **Migração para React Hook Form:** Atualmente utilizamos estados manuais para evitar bibliotecas externas no teste. Em escala, o RHF traria ganhos de performance (menos re-renders) e validações nativas mais robustas integradas ao Zod.
3. **Abstração de Hooks de Tabela:** Extrair a inteligência de paginação e ordenação do `useClients` para hooks utilitários genéricos (`usePagination`, `useSort`). Isso permitiria o reuso imediato em novas telas de Ordens de Serviço ou Estoque.
4. **Camada de Transporte com Interceptors:** Migrar para **Axios** para centralizar o tratamento de erros globais (como expiração de sessão/401) e a injeção automática de headers de autenticação em todas as requisições.
5. **Design Tokens & Tematização:** Extrair cores e espaçamentos para variáveis CSS ou tokens de design. Isso prepararia o SaaS para suporte a **Dark Mode** e temas personalizados (**White Label**) por oficina.

---
**Desenvolvido com foco em escalabilidade, clareza e manutenção.**