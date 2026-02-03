
export const STORAGE_KEYS = {
  TOKEN: '@MecanicaPro:token',
  USER: '@MecanicaPro:user',
};

export const API_ROUTES = {
  LOGIN: '/login',
  CLIENTS: '/clients',
};

export const AUTH_CONFIG = {
  DEFAULT_ADMIN_EMAIL: 'admin@mecanica.com',
  DEFAULT_ADMIN_PASS: '123456',
};

export const APP_MESSAGES = {
  AUTH: {
    INVALID_CREDENTIALS: 'Credenciais inválidas. Use admin@mecanica.com / 123456',
    LOGIN_ERROR: 'Erro ao realizar login.',
    LOGOUT_CONFIRM_TITLE: 'Sair do Sistema',
    LOGOUT_CONFIRM_MSG: 'Tem certeza que deseja encerrar sua sessão atual?',
  },
  CLIENTS: {
    LOAD_ERROR: 'Erro ao carregar clientes.',
    CREATE_ERROR: 'Erro ao cadastrar cliente.',
    CREATE_SUCCESS_TITLE: 'Cliente Cadastrado!',
    CREATE_SUCCESS_MSG: 'O novo cliente foi adicionado à base de dados.',
    UPDATE_SUCCESS_TITLE: 'Sucesso!',
    UPDATE_SUCCESS_MSG: 'Os dados do cliente foram atualizados com sucesso.',
    DELETE_CONFIRM_TITLE: 'Excluir Cliente',
    DELETE_CONFIRM_MSG: (name: string) => `Tem certeza que deseja remover ${name} permanentemente?`,
    DELETE_SUCCESS_TITLE: 'Removido',
    DELETE_SUCCESS_MSG: 'O cliente foi excluído com sucesso.',
    EMPTY_LIST: 'Nenhum cliente corresponde aos critérios de busca.',
  },
  GENERAL: {
    GENERIC_ERROR: 'Não foi possível completar a ação. Tente novamente.',
    LOADING: 'Carregando dados...',
  }
};

export const UI_CONFIG = {
  PAGINATION: {
    DEFAULT_LIMIT: 10,
    LIMIT_OPTIONS: [10, 15, 20, 25, 50, 100, 200],
  }
};
