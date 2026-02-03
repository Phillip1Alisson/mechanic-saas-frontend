
import React from 'react';

export interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
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
  // Novos controles solicitados
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
  limit?: number;
  onLimitChange?: (limit: number) => void;
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
  limit,
  onLimitChange
}: DataTableProps<T>) {
  
  const loaderDimensions = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-b-2',
    lg: 'h-12 w-12 border-b-4'
  };

  const limitOptions = [10, 15, 20, 25, 50, 100, 200];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
      {/* Table Toolbar */}
      <div className="p-4 border-b bg-white flex flex-col sm:flex-row gap-4 items-center justify-between">
        {onSearchChange && (
          <div className="relative w-full sm:max-w-xs">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Pesquisar..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
            />
          </div>
        )}

        {onLimitChange && (
          <div className="flex items-center gap-2 text-sm text-gray-500 whitespace-nowrap">
            <label htmlFor="limit-select">Linhas por página:</label>
            <select
              id="limit-select"
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              className="border border-gray-200 rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-700 font-medium"
            >
              {limitOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-gray-600 uppercase text-[11px] tracking-wider font-bold">
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} className={`px-6 py-4 ${col.className || ''}`}>
                  {col.header}
                </th>
              ))}
              {renderActions && <th className="px-6 py-4 text-right">Ações</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading && data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (renderActions ? 1 : 0)} className="px-6 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center gap-2">
                    <div className={`animate-spin rounded-full border-blue-500 ${loaderDimensions[loaderSize]}`}></div>
                    <span className="text-sm font-medium">Carregando dados...</span>
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
