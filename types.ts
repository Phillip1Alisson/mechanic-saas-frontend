
export enum ClientType {
  PF = 'PF',
  PJ = 'PJ'
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  type: ClientType;
  document: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  lastPage: number;
}
