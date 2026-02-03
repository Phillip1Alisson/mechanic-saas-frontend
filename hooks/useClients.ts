
import { useState, useCallback, useEffect, useRef } from 'react';
import { Client, PaginatedResponse, SortConfig } from '../types';
import { clientService } from '../services/clientService';
import { APP_MESSAGES, UI_CONFIG } from '../constants';

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [limit, setLimit] = useState(UI_CONFIG.PAGINATION.DEFAULT_LIMIT);
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    lastPage: 1
  });

  const fetchClients = useCallback(async (
    page: number = 1,
    currentLimit: number = limit,
    search: string = searchTerm,
    type: string = typeFilter,
    sort: SortConfig | null = sortConfig
  ) => {
    setLoading(true);
    setError(null);
    try {
      const response: PaginatedResponse<Client> = await clientService.list(page, currentLimit, search, type, sort);
      setClients(response.data);
      setPagination({
        page: response.page,
        total: response.total,
        lastPage: response.lastPage,
      });
    } catch (err) {
      setError(APP_MESSAGES.CLIENTS.LOAD_ERROR);
    } finally {
      setLoading(false);
    }
  }, [limit, searchTerm, typeFilter, sortConfig]);

  const addClient = useCallback(async (data: Omit<Client, 'id'>) => {
    setActionLoading(true);
    try {
      await clientService.create(data);
      await fetchClients(1);
    } catch (err) {
      setError(APP_MESSAGES.CLIENTS.CREATE_ERROR);
      throw err;
    } finally {
      setActionLoading(false);
    }
  }, [fetchClients]);

  const updateClient = useCallback(async (clientId: string, data: Omit<Client, 'id'>) => {
    setActionLoading(true);
    try {
      await clientService.update(clientId, data);
      await fetchClients(pagination.page);
    } catch (err) {
      setError(APP_MESSAGES.GENERAL.GENERIC_ERROR);
      throw err;
    } finally {
      setActionLoading(false);
    }
  }, [fetchClients, pagination.page]);

  const deleteClient = useCallback(async (clientId: string) => {
    setActionLoading(true);
    try {
      await clientService.delete(clientId);
      await fetchClients(pagination.page);
    } catch (err) {
      setError(APP_MESSAGES.GENERAL.GENERIC_ERROR);
      throw err;
    } finally {
      setActionLoading(false);
    }
  }, [fetchClients, pagination.page]);

  // Debounce para pesquisa
  const searchTimeoutRef = useRef<number | null>(null);
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (searchTimeoutRef.current) window.clearTimeout(searchTimeoutRef.current);
    
    searchTimeoutRef.current = window.setTimeout(() => {
      fetchClients(1, limit, value, typeFilter, sortConfig);
    }, 400);
  };

  const handleTypeFilterChange = (type: string) => {
    setTypeFilter(type);
    fetchClients(1, limit, searchTerm, type, sortConfig);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    fetchClients(1, newLimit, searchTerm, typeFilter, sortConfig);
  };

  const handleSort = (field: string) => {
    let newSort: SortConfig | null = null;
    
    if (!sortConfig || sortConfig.field !== field) {
      newSort = { field, order: 'asc' };
    } else if (sortConfig.order === 'asc') {
      newSort = { field, order: 'desc' };
    } else {
      newSort = null;
    }
    
    setSortConfig(newSort);
    fetchClients(1, limit, searchTerm, typeFilter, newSort);
  };

  useEffect(() => {
    fetchClients(1, limit, searchTerm, typeFilter, sortConfig);
  }, []);

  return {
    clients,
    loading,
    actionLoading,
    error,
    pagination,
    searchTerm,
    typeFilter,
    sortConfig,
    limit,
    fetchClients,
    addClient,
    updateClient,
    deleteClient,
    handleSearch,
    handleTypeFilterChange,
    handleLimitChange,
    handleSort,
  };
};
