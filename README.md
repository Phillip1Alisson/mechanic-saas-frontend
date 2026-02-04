# MecânicaPro SaaS - Frontend Challenge

Frontend de alta performance e arquitetura robusta desenvolvido para a gestão de oficinas mecânicas. Este projeto demonstra maturidade técnica através da aplicação rigorosa de **SOLID**, **Clean Code** e padrões idiomáticos de **React**.

## 🚀 Como Executar Localmente

1. **Clone o repositório** e entre na pasta.
2. **Instale as dependências:** `npm install`.
3. **(Opcional)** Configure a URL da API: crie `.env` com `VITE_API_BASE_URL=http://localhost:8081` (ou sua URL).
4. **Inicie o servidor:** `npm run dev`.
5. **Login:** `admin@mecanica.com` / `123456`.

---

## 📖 Documentação Completa

Para uma análise profunda das decisões técnicas, componentes globais e padrões utilizados, acesse:
👉 **[DOCUMENTATION.md](./DOCUMENTATION.md)**

---

## 🏗️ Guia de Arquitetura (Resumo)

A aplicação foi estruturada seguindo o princípio de **Camadas de Responsabilidade**, garantindo que a interface seja um reflexo do estado e não a detentora da lógica.

### Estrutura de Pastas
- `components/`: Componentes puramente visuais e motores genéricos (`Form`, `DataTable`).
- `context/`: Estados globais transversais (Autenticação e Notificações).
- `hooks/`: Camada de lógica de domínio (Encapsula o "como").
- `services/`: Camada de Infraestrutura (Isolamento de rede).
- `constants/`: "Fonte da Verdade" para mensagens e configurações.

---

## 📝 Registro de Mudanças (Changelog)

> [Consulte o arquivo CHANGELOG.md completo aqui](./CHANGELOG.md)

- **v1.3.0:** Endpoint de logout, preservação de dados do formulário em erro, máscaras CPF/CNPJ na tabela.
- **v1.2.0:** Centralização de strings mágicas e constantes.
- **v1.1.0:** Motor de formulário dinâmico e validação Zod.
- **v1.0.0:** Estrutura base, Auth e CRUD de Clientes.

---

## 🏗️ O que eu faria diferente em Produção

1. **Server-State Management:** Substituiria o gerenciamento manual por **TanStack Query**.
2. **Segurança:** Uso de **HttpOnly Cookies** para tokens.
3. **Testes:** Cobertura de testes unitários com Vitest e E2E com Playwright.

---
**Desenvolvido com foco em escalabilidade, clareza e manutenção.**