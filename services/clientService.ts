
import { Client, PaginatedResponse, ClientType } from '../types';

// Mock persistido em memória para a sessão atual
let mockClients: Client[] = [
  { id: '1', name: 'João Silva', phone: '11999999999', type: ClientType.PF, document: '123.456.789-00' },
  { id: '2', name: 'Oficina do Tonhão', phone: '1133334444', type: ClientType.PJ, document: '12.345.678/0001-90' },
];

export const clientService = {
  async list(page: number = 1, limit: number = 5): Promise<PaginatedResponse<Client>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const start = (page - 1) * limit;
    const end = start + limit;
    const data = mockClients.slice(start, end);
    const total = mockClients.length;
    
    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit)
    };
  },

  async create(clientData: Omit<Client, 'id'>): Promise<Client> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newClient: Client = {
      ...clientData,
      id: Math.random().toString(36).substr(2, 9)
    };
    
    mockClients = [newClient, ...mockClients];
    return newClient;
  }
};
