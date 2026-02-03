
import { useState, useCallback, useEffect, useRef } from 'react';
import { Client, PaginatedResponse } from '../types';
import { clientService } from '../services/clientService';

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [limit, setLimit] = useState(10);
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    lastPage: 1
  });

  const fetchClients = useCallback(async (
    page: number = 1, 
    currentLimit: number = limit, 
    search: string = searchTerm,
    type: string = typeFilter
  ) => {
    setLoading(true);
    setError(null);
    try {
      const response: PaginatedResponse<Client> = await clientService.list(page, currentLimit, search, type);
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
  }, [limit, searchTerm, typeFilter]);

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
      fetchClients(1, limit, value, typeFilter);
    }, 400);
  };

  const handleTypeFilterChange = (type: string) => {
    setTypeFilter(type);
    fetchClients(1, limit, searchTerm, type);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    fetchClients(1, newLimit, searchTerm, typeFilter);
  };

  useEffect(() => {
    fetchClients(1, limit, searchTerm, typeFilter);
  }, []);

  return {
    clients,
    loading,
    error,
    pagination,
    searchTerm,
    typeFilter,
    limit,
    fetchClients,
    addClient,
    handleSearch,
    handleTypeFilterChange,
    handleLimitChange
  };
};
