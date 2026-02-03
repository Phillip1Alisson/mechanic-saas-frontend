
import { useState, useCallback, useEffect, useRef } from 'react';
import { Client, PaginatedResponse } from '../types';
import { clientService } from '../services/clientService';

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [limit, setLimit] = useState(10);
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    lastPage: 1
  });

  const fetchClients = useCallback(async (page: number = 1, currentLimit: number = limit, search: string = searchTerm) => {
    setLoading(true);
    setError(null);
    try {
      const response: PaginatedResponse<Client> = await clientService.list(page, currentLimit, search);
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
  }, [limit, searchTerm]);

  const addClient = useCallback(async (data: Omit<Client, 'id'>) => {
    setLoading(true);
    try {
      await clientService.create(data);
      await fetchClients(1);
    } catch (err) {
      setError('Erro ao cadastrar cliente.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchClients]);

  // Debounce para pesquisa
  const searchTimeoutRef = useRef<number | null>(null);
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (searchTimeoutRef.current) window.clearTimeout(searchTimeoutRef.current);
    
    searchTimeoutRef.current = window.setTimeout(() => {
      fetchClients(1, limit, value);
    }, 400);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    fetchClients(1, newLimit, searchTerm);
  };

  useEffect(() => {
    fetchClients(1, limit, searchTerm);
  }, []);

  return {
    clients,
    loading,
    error,
    pagination,
    searchTerm,
    limit,
    fetchClients,
    addClient,
    handleSearch,
    handleLimitChange
  };
};
