
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
}

export function DataTable<T extends { id: string | number }>({
  columns,
  data,
  loading = false,
  pagination,
  onPageChange,
  renderActions,
  emptyMessage = 'Nenhum registro encontrado.',
  loaderSize = 'md'
}: DataTableProps<T>) {
  
  const loaderDimensions = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-b-2',
    lg: 'h-12 w-12 border-b-4'
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold">
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
                    <span>Carregando dados...</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (renderActions ? 1 : 0)} className="px-6 py-12 text-center text-gray-500">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  {columns.map((col, idx) => (
                    <td key={idx} className={`px-6 py-4 ${col.className || ''}`}>
                      {typeof col.accessor === 'function' 
                        ? col.accessor(item) 
                        : (item[col.accessor] as unknown as React.ReactNode)}
                    </td>
                  ))}
                  {renderActions && (
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
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
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t">
          <span className="text-sm text-gray-500">
            Total: <strong>{pagination.total}</strong> registros
          </span>
          
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <button 
                disabled={pagination.page <= 1 || loading}
                onClick={() => onPageChange(pagination.page - 1)}
                className="px-3 py-1 border rounded bg-white hover:bg-gray-50 disabled:opacity-30 text-sm font-medium transition-colors"
              >
                Anterior
              </button>
              <span className="px-3 py-1 text-sm font-semibold bg-white border rounded">
                {pagination.page} / {pagination.lastPage}
              </span>
              <button 
                disabled={pagination.page >= pagination.lastPage || loading}
                onClick={() => onPageChange(pagination.page + 1)}
                className="px-3 py-1 border rounded bg-white hover:bg-gray-50 disabled:opacity-30 text-sm font-medium transition-colors"
              >
                Próximo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
