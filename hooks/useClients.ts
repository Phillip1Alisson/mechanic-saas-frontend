
import { useState, useCallback, useEffect } from 'react';
import { Client, PaginatedResponse } from '../types';
import { clientService } from '../services/clientService';

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    lastPage: 1
  });

  const fetchClients = useCallback(async (page: number = 1) => {
    setLoading(true);
    setError(null);
    try {
      const response: PaginatedResponse<Client> = await clientService.list(page);
      setClients(response.data);
      setPagination({
        page: response.page,
        total: response.total,
        lastPage: response.lastPage
      });
    } catch (err) {
      setError('Erro ao carregar clientes.');
    } finally {
      setLoading(false);
    }
  }, []);

  const addClient = useCallback(async (data: Omit<Client, 'id'>) => {
    setLoading(true);
    try {
      await clientService.create(data);
      await fetchClients(1); // Recarrega na primeira página após criação
    } catch (err) {
      setError('Erro ao cadastrar cliente.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchClients]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  return {
    clients,
    loading,
    error,
    pagination,
    fetchClients,
    addClient
  };
};
