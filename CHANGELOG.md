# Changelog - MecânicaPro SaaS

Todas as mudanças técnicas relevantes para este teste técnico estão documentadas aqui para transparência de raciocínio.

## [1.2.0] - Refatoração de Constantes e Limpeza de Código
### Adicionado
- Criação do arquivo `src/constants/index.ts` para centralizar mensagens do sistema, chaves de localStorage e configurações de UI.
### Alterado
- Refatoração de `authService.ts` e `useClients.ts` para consumir constantes centralizadas.
- Padronização de mensagens de erro e sucesso em toda a aplicação.
- Movimentação de limites de paginação (`10, 20, 50`) para configuração global.

## [1.1.0] - Motor de Formulário e Validação Robusta
### Adicionado
- Implementação do componente genérico `Form.tsx` (Organism) que automatiza máscaras e tratamento de erros.
- Integração profunda com **Zod** para validação de esquemas.
- Adição de máscaras em tempo real para Telefone, CPF e CNPJ.
### Melhorado
- Lógica de "isDirty" no formulário para evitar submissões desnecessárias e melhorar a UX.
- Desacoplamento da lógica de validação do componente visual `ClientForm.tsx`.

## [1.0.0] - Arquitetura Base e CRUD Funcional
### Adicionado
- Estruturação do projeto seguindo camadas de Service, Hook e Context.
- Sistema de proteção de rotas (Private/Public).
- Mock de autenticação consumindo "API PHP" simulada.
- Listagem de clientes com paginação, busca (debounce) e filtro por tipo (PF/PJ).
- Sistema de notificações globais (Confirm/Info/Error).
### Decisões Técnicas
- Escolha pelo **HashRouter** para garantir compatibilidade em ambientes de preview estático sem configuração de servidor.
- Uso de **Context API** exclusivamente para Autenticação e Notificações (estados transversais).
- Implementação de **Inversão de Dependência** na camada de serviços.

---
*Este changelog reflete o compromisso com a evolução incremental e a qualidade de software.*