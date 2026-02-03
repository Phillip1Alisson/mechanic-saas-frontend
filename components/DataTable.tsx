
import React, { useState } from 'react';
import { Modal } from './Modal';
import { SortConfig } from '../types';
import { APP_MESSAGES, UI_CONFIG } from '../constants';

export interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
  sortable?: boolean;
  sortKey?: string;
}

interface PaginationData {
  page: number;
  total: number;
  lastPage: number;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  pagination?: PaginationData;
  onPageChange?: (page: number) => void;
  renderActions?: (item: T) => React.ReactNode;
  emptyMessage?: string;
  loaderSize?: 'sm' | 'md' | 'lg';
  // Filtros e controles
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
  typeFilter?: string;
  onTypeFilterChange?: (value: string) => void;
  limit?: number;
  onLimitChange?: (limit: number) => void;
  // Ordenação
  sortConfig?: SortConfig | null;
  onSort?: (field: string) => void;
}

export function DataTable<T extends { id: string | number }>({
  columns,
  data,
  loading = false,
  pagination,
  onPageChange,
  renderActions,
  emptyMessage = 'Nenhum registro encontrado.',
  loaderSize = 'md',
  searchTerm,
  onSearchChange,
  typeFilter = 'all',
  onTypeFilterChange,
  limit,
  onLimitChange,
  sortConfig,
  onSort
}: DataTableProps<T>) {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [tempTypeFilter, setTempTypeFilter] = useState(typeFilter);

  const loaderDimensions = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-b-2',
    lg: 'h-12 w-12 border-b-4'
  };

  const limitOptions = UI_CONFIG.PAGINATION.LIMIT_OPTIONS;

  const handleApplyFilter = () => {
    if (onTypeFilterChange) {
      onTypeFilterChange(tempTypeFilter);
    }
    setIsFilterModalOpen(false);
  };

  const handleClearFilter = () => {
    setTempTypeFilter('all');
    if (onTypeFilterChange) {
      onTypeFilterChange('all');
    }
  };

  const isFilterActive = typeFilter !== 'all';

  const renderSortIcon = (col: Column<T>) => {
    if (!col.sortable || !onSort) return null;
    
    const key = col.sortKey || (typeof col.accessor === 'string' ? col.accessor : '');
    const isActive = sortConfig?.field === key;

    return (
      <div className={`flex flex-col ml-1.5 transition-colors ${isActive ? 'text-blue-600' : 'text-gray-300 group-hover:text-gray-400'}`}>
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-2.5 w-2.5 ${isActive && sortConfig?.order === 'desc' ? 'opacity-20' : ''}`} viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-2.5 w-2.5 ${isActive && sortConfig?.order === 'asc' ? 'opacity-20' : ''}`} viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
      {/* Table Toolbar */}
      <div className="p-4 border-b bg-white flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
          {onSearchChange && (
            <div className="relative w-full sm:max-w-xs">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Pesquisar por nome, doc ou tel..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
              />
            </div>
          )}

          <div className="flex items-center gap-2">
            {onTypeFilterChange && (
              <button
                onClick={() => {
                  setTempTypeFilter(typeFilter);
                  setIsFilterModalOpen(true);
                }}
                className={`p-2 rounded-lg border transition-all flex items-center gap-2 ${
                  isFilterActive 
                    ? 'bg-blue-50 border-blue-200 text-blue-600' 
                    : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                }`}
                title="Filtrar por tipo"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <span className="text-sm font-medium sm:hidden">Filtrar</span>
              </button>
            )}

            {isFilterActive && (
              <button
                onClick={handleClearFilter}
                className="text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-lg transition-colors flex items-center gap-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Limpar Filtro
              </button>
            )}
          </div>
        </div>

        {onLimitChange && (
          <div className="flex items-center gap-2 text-sm text-gray-500 whitespace-nowrap ml-auto">
            <label htmlFor="limit-select">Exibir:</label>
            <select
              id="limit-select"
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              className="border border-gray-200 rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-700 font-medium"
            >
              {limitOptions.map(opt => (
                <option key={opt} value={opt}>{opt} linhas</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Filter Modal */}
      <Modal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        title="Filtrar Resultados"
      >
        <div className="p-6 space-y-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">Tipo de Cliente</label>
            <select
              value={tempTypeFilter}
              onChange={(e) => setTempTypeFilter(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-700 font-medium"
            >
              <option value="all">Todos os tipos</option>
              <option value="PF">Pessoa Física (PF)</option>
              <option value="PJ">Pessoa Jurídica (PJ)</option>
            </select>
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={() => setIsFilterModalOpen(false)}
              className="px-4 py-2 text-gray-500 font-medium hover:bg-gray-50 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleApplyFilter}
              className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-md active:scale-95 transition-all"
            >
              Aplicar Filtro
            </button>
          </div>
        </div>
      </Modal>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-gray-600 uppercase text-[11px] tracking-wider font-bold">
            <tr>
              {columns.map((col, idx) => {
                const sortKey = col.sortKey || (typeof col.accessor === 'string' ? col.accessor : '');
                const isSortable = col.sortable && onSort && sortKey;

                return (
                  <th 
                    key={idx} 
                    className={`px-6 py-4 ${col.className || ''} ${isSortable ? 'cursor-pointer hover:bg-gray-100 transition-colors group' : ''}`}
                    onClick={() => isSortable && onSort(sortKey)}
                  >
                    <div className="flex items-center">
                      {col.header}
                      {renderSortIcon(col)}
                    </div>
                  </th>
                );
              })}
              {renderActions && <th className="px-6 py-4 text-right">Ações</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading && data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (renderActions ? 1 : 0)} className="px-6 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center gap-2">
                    <div className={`animate-spin rounded-full border-blue-500 ${loaderDimensions[loaderSize]}`}></div>
                    <span className="text-sm font-medium">{APP_MESSAGES.GENERAL.LOADING}</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (renderActions ? 1 : 0)} className="px-6 py-12 text-center text-gray-400 italic">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.id} className="hover:bg-blue-50/30 transition-colors group">
                  {columns.map((col, idx) => (
                    <td key={idx} className={`px-6 py-4 ${col.className || ''}`}>
                      {typeof col.accessor === 'function' 
                        ? col.accessor(item) 
                        : (item[col.accessor] as unknown as React.ReactNode)}
                    </td>
                  ))}
                  {renderActions && (
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        {renderActions(item)}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination && onPageChange && (
        <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row items-center justify-between border-t gap-4">
          <span className="text-sm text-gray-500">
            Mostrando {data.length} de <strong>{pagination.total}</strong> registros
          </span>
          
          <div className="flex items-center gap-2">
            <button 
              disabled={pagination.page <= 1 || loading}
              onClick={() => onPageChange(pagination.page - 1)}
              className="p-2 border rounded-lg bg-white hover:bg-gray-50 disabled:opacity-30 transition-all shadow-sm"
              title="Anterior"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <div className="flex items-center gap-1">
              <span className="px-3 py-1.5 text-sm font-bold bg-white border rounded-lg shadow-sm">
                {pagination.page}
              </span>
              <span className="text-gray-400 text-sm">de {pagination.lastPage}</span>
            </div>

            <button 
              disabled={pagination.page >= pagination.lastPage || loading}
              onClick={() => onPageChange(pagination.page + 1)}
              className="p-2 border rounded-lg bg-white hover:bg-gray-50 disabled:opacity-30 transition-all shadow-sm"
              title="Próximo"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
