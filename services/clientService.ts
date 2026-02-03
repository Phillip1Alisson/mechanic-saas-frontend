
import { Client, PaginatedResponse, SortConfig } from '../types';
import { API_ROUTES } from '../constants';
import { api } from './api';

interface ClientsListPayload {
  data?: Client[];
  items?: Client[];
  page?: number;
  total?: number;
  lastPage?: number;
  perPage?: number;
  pagination?: {
    page: number;
    perPage?: number;
    total: number;
    lastPage?: number;
  };
}

const sanitizeDocument = (value: string) => value.replace(/\D/g, '');

const normalizePaginatedResponse = (
  payload: ClientsListPayload | PaginatedResponse<Client> | Client[],
  fallbackLimit: number
): PaginatedResponse<Client> => {
  if (Array.isArray(payload)) {
    return {
      data: payload,
      total: payload.length,
      page: 1,
      lastPage: 1,
    };
  }

  const list =
    payload?.data ||
    payload?.items ||
    (Array.isArray((payload as any)?.data) ? (payload as any).data : []);

  const paginationSource = payload?.pagination || payload || {};
  const total = typeof paginationSource.total === 'number' ? paginationSource.total : list.length;
  const page = typeof paginationSource.page === 'number' ? paginationSource.page : 1;
  const perPage = typeof paginationSource.perPage === 'number' ? paginationSource.perPage : fallbackLimit;
  const lastPage =
    typeof paginationSource.lastPage === 'number'
      ? paginationSource.lastPage
      : Math.max(1, Math.ceil(total / (perPage || fallbackLimit || 1)));

  return {
    data: list,
    total,
    page,
    lastPage,
  };
};

const buildSortParam = (sort?: SortConfig | null) => {
  if (!sort) return undefined;
  return `${sort.field}:${sort.order}`;
};

const buildClientPayload = (client: Omit<Client, 'id'>) => ({
  ...client,
  document: sanitizeDocument(client.document),
  phone: sanitizeDocument(client.phone),
});

export const clientService = {
  async list(
    page: number = 1,
    limit: number = 10,
    search: string = '',
    type?: string,
    sort?: SortConfig | null
  ): Promise<PaginatedResponse<Client>> {
    const params: Record<string, unknown> = {
      page,
      perPage: limit,
      search: search?.trim() || undefined,
      sort: buildSortParam(sort),
    };

    if (type && type !== 'all') {
      params.type = type;
    }

    const payload = await api.get<ClientsListPayload>(API_ROUTES.CLIENTS, { params });
    return normalizePaginatedResponse(payload, limit);
  },

  async getById(clientId: string): Promise<Client> {
    return api.get<Client>(`${API_ROUTES.CLIENTS}/${clientId}`);
  },

  async create(clientData: Omit<Client, 'id'>): Promise<Client> {
    const payload = buildClientPayload(clientData);
    return api.post<Client>(API_ROUTES.CLIENTS, payload);
  },

  async update(clientId: string, clientData: Omit<Client, 'id'>): Promise<Client> {
    const payload = buildClientPayload(clientData);
    return api.put<Client>(`${API_ROUTES.CLIENTS}/${clientId}`, payload);
  },

  async delete(clientId: string): Promise<void> {
    await api.delete<void>(`${API_ROUTES.CLIENTS}/${clientId}`);
  },
};
