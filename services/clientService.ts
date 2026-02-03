
import { Client, PaginatedResponse, ClientType, SortConfig } from '../types';

// Mock persistido em memória para a sessão atual
let mockClients: Client[] = [
  { id: '1', name: 'João Silva', phone: '11999999999', type: ClientType.PF, document: '123.456.789-00' },
  { id: '2', name: 'Oficina do Tonhão', phone: '1133334444', type: ClientType.PJ, document: '12.345.678/0001-90' },
  { id: '3', name: 'Maria Oliveira', phone: '21988887777', type: ClientType.PF, document: '987.654.321-11' },
  { id: '4', name: 'Auto Peças Central', phone: '1140040000', type: ClientType.PJ, document: '99.888.777/0001-66' },
  { id: '5', name: 'Carlos Ferreira', phone: '31977776666', type: ClientType.PF, document: '111.222.333-44' },
];

export const clientService = {
  async list(
    page: number = 1, 
    limit: number = 10, 
    search: string = '', 
    type?: string,
    sort?: SortConfig | null
  ): Promise<PaginatedResponse<Client>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filtered = [...mockClients];
    
    // Filtro por busca textual
    if (search) {
      const searchTerm = search.toLowerCase();
      filtered = filtered.filter(client => 
        client.name.toLowerCase().includes(searchTerm) || 
        client.document.replace(/\D/g, '').includes(searchTerm.replace(/\D/g, '')) ||
        client.phone.replace(/\D/g, '').includes(searchTerm.replace(/\D/g, ''))
      );
    }

    // Filtro por tipo (PF/PJ)
    if (type && type !== 'all') {
      filtered = filtered.filter(client => client.type === type);
    }

    // Ordenação
    if (sort) {
      filtered.sort((a: any, b: any) => {
        const valA = a[sort.field]?.toString().toLowerCase() || '';
        const valB = b[sort.field]?.toString().toLowerCase() || '';
        
        if (sort.order === 'asc') {
          return valA.localeCompare(valB);
        } else {
          return valB.localeCompare(valA);
        }
      });
    }
    
    const start = (page - 1) * limit;
    const end = start + limit;
    const data = filtered.slice(start, end);
    const total = filtered.length;
    
    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit) || 1
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
