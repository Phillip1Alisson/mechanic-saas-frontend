
# MecânicaPro SaaS - Frontend Challenge

Frontend de alta qualidade desenvolvido para o teste técnico de uma plataforma SaaS de oficinas mecânicas. Focado em **Clean Code**, **SOLID** e **Manutenibilidade**.

## 🛠️ Decisões Técnicas

### Arquitetura de Pastas
O projeto segue uma estrutura modular para facilitar a escalabilidade e a separação de responsabilidades:
- `components/`: Componentes de UI puros e reutilizáveis.
- `context/`: Gerenciamento de estado global estrito (apenas Autenticação).
- `hooks/`: Lógica de domínio encapsulada (Custom Hooks).
- `services/`: Camada de comunicação com a API externa.
- `pages/`: Componentes de rota (Compositores).
- `utils/`: Funções puras e auxiliares (validadores).

### Aplicação de Princípios SOLID
- **S (Single Responsibility):** Cada componente e hook tem uma única responsabilidade. O `ClientForm` apenas cuida da UI de entrada, enquanto o `useClients` gerencia a lógica de dados.
- **O (Open/Closed):** Os validadores de documento são extensíveis e não precisam ser alterados se novas regras surgirem.
- **L (Liskov Substitution):** Tipagem rigorosa com TypeScript garante que interfaces de dados sejam consistentes em toda a aplicação.
- **I (Interface Segregation):** Componentes recebem apenas as props necessárias via interfaces específicas.
- **D (Dependency Inversion):** A UI não conhece os detalhes da implementação da API; ela consome hooks que, por sua vez, utilizam services.

### Clean Code & Boas Práticas
- **Nomenclatura Semântica:** Variáveis e funções nomeadas com clareza (ex: `isValidCPF`, `fetchClients`, `useAuth`).
- **Pequenos Componentes:** Foco em manter o JSX limpo e legível.
- **Custom Hooks:** Toda lógica de `useEffect` e `useState` complexa foi extraída para hooks, deixando os componentes visuais focados apenas no retorno do template.
- **Comunicação com API:** Centralizada em `services`, facilitando a troca futura de `fetch` por `axios` ou similar sem quebrar a UI.

## 🚀 Como Executar

1.  Os arquivos gerados estão prontos para um ambiente React/Vite convencional.
2.  Utilize `admin@mecanica.com` e `123456` para acessar o sistema.

## 🔮 Melhorias Futuras (Cenário de Produção)
- **React Query/SWR:** Para cache de dados e gerenciamento de estado de servidor mais eficiente.
- **Zod/Hook Form:** Para validações de formulário mais complexas e acessibilidade facilitada.
- **Testes Unitários:** Implementação de Jest e React Testing Library para os validadores e hooks.
- **Storybook:** Documentação da biblioteca de componentes de UI.
- **CI/CD:** Pipeline automatizado de linting, build e deploy.

---
Desenvolvido com foco em excelência técnica e maturidade arquitetural.
