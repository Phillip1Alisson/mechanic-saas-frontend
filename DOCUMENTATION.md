# Documentação Técnica - MecânicaPro SaaS

Este documento detalha a arquitetura, os padrões de projeto e o guia de utilização dos componentes globais da plataforma.

---

## 1. Arquitetura e Padrões (Design Patterns)

### 1.1. Camadas de Responsabilidade
O projeto segue uma separação rigorosa entre **UI**, **Estado de Domínio** e **Infraestrutura**:
- **UI (Components):** Preocupada apenas com "como as coisas parecem".
- **Domínio (Hooks):** Preocupada com "o que os dados fazem". Contém a lógica de busca, filtros e mutações.
- **Infraestrutura (Services):** Preocupada com "de onde os dados vêm". Isola o protocolo (Fetch/Axios/Storage).

### 1.2. Inversão de Dependência (DIP)
Os componentes e hooks não dependem de instâncias concretas de serviços de rede. Eles dependem de interfaces. Isso permite que o `clientService` seja um Mock hoje e uma API PHP real amanhã, sem alterar uma única linha de código nos componentes.

### 1.3. Single Source of Truth (SSOT)
Utilizamos o arquivo `src/constants/index.ts` como a única fonte de verdade para mensagens, configurações de UI e chaves de sistema, facilitando a internacionalização (i18n) e mudanças globais de comportamento.

---

## 2. Componentes Globais (Core Components)

### 2.1. DataTable<T>
Um motor de listagem genérico e tipado.

**Padrões Utilizados:**
- **Generics:** Permite que a tabela aceite qualquer tipo de dado (`Client`, `Product`, etc).
- **Render Props:** A coluna `renderActions` recebe uma função que retorna JSX, permitindo total controle das ações sem acoplar a tabela ao negócio.

**Exemplo de Uso:**
```tsx
const columns: Column<Client>[] = [
  { header: 'Nome', accessor: 'name', sortable: true },
  { header: 'Tipo', accessor: (item) => <Badge>{item.type}</Badge> }
];

<DataTable<Client>
  columns={columns}
  data={clients}
  onSort={(field) => handleSort(field)}
  renderActions={(client) => <button onClick={() => edit(client)}>Editar</button>}
/>
```

### 2.2. Form<T>
Componente de alta ordem (HOC) para orquestração de formulários.

**Padrões Utilizados:**
- **Esquema Declarativo:** Utiliza definições de campos e esquemas **Zod** para validação.
- **Controlled Component:** Gerencia o estado interno e máscaras (Telefone, CPF/CNPJ) automaticamente baseado no `type` do campo.

**Exemplo de Uso:**
```tsx
const schema = z.object({ name: z.string().min(3) });

<Form
  fields={[{ name: 'name', label: 'Nome', type: 'text' }]}
  schema={schema}
  onSubmit={async (data) => save(data)}
/>
```

---

## 3. Gestão de Estado e Efeitos

### 3.1. Context API
Limitada estritamente a estados globais que não mudam com frequência e precisam estar disponíveis em toda a árvore:
- **AuthContext:** Token e dados do usuário logado.
- **NotificationContext:** Engine de diálogos (Confirm/Error) desacoplada da UI de página.

### 3.2. Custom Hooks (O Cérebro)
Toda lógica de "Negócio" reside nos hooks. O `useClients`, por exemplo, gerencia o ciclo de vida da listagem, incluindo o **Debounce** da busca para evitar chamadas excessivas à API.

---

## 4. Fluxo de Validação e Máscaras
A validação é baseada em **estratégias de formato**:
1. O usuário digita no `Input`.
2. O `Form.tsx` intercepta e aplica a máscara definida em `utils/validators.ts`.
3. O estado é atualizado com o valor formatado.
4. O **Zod** valida o dado final antes do `onSubmit`.

---

## 5. Guia de Manutenção

### Adicionando um novo campo ao Cliente:
1. Adicione a propriedade em `types.ts`.
2. Atualize o `clientSchema` em `ClientForm.tsx`.
3. Adicione a definição do campo no array `fields` do `ClientForm.tsx`.

### Alterando a URL da API:
1. Modifique o objeto `API_ROUTES` em `constants/index.ts`.
