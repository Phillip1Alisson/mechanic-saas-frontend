
import React, { useState } from 'react';
import { useClients } from '../hooks/useClients';
import { useNotification } from '../context/NotificationContext';
import { ClientForm } from '../components/ClientForm';
import { DataTable, Column } from '../components/DataTable';
import { Modal } from '../components/Modal';
import { Client } from '../types';
import { formatPhone } from '../utils/validators';
import { APP_MESSAGES } from '../constants';

export const ClientsPage: React.FC = () => {
  const { 
    clients, 
    loading, 
    pagination, 
    searchTerm,
    typeFilter,
    sortConfig,
    limit,
    fetchClients, 
    addClient,
    handleSearch,
    handleTypeFilterChange,
    handleLimitChange,
    handleSort
  } = useClients();

  const { confirm, info, error } = useNotification();
  
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const handleAddClient = async (data: any) => {
    const isEditing = !!editingClient;

    confirm({
      title: isEditing ? 'Confirmar Edição' : 'Confirmar Cadastro',
      message: `Deseja realmente ${isEditing ? 'salvar as alterações em' : 'cadastrar o cliente'} ${data.name}?`,
      confirmLabel: isEditing ? 'Salvar' : 'Cadastrar',
      onConfirm: async () => {
        try {
          if (isEditing) {
            // Simulação de update
            console.log('Simulação de Update:', editingClient.id, data);
            info({
              title: APP_MESSAGES.CLIENTS.UPDATE_SUCCESS_TITLE,
              message: APP_MESSAGES.CLIENTS.UPDATE_SUCCESS_MSG
            });
          } else {
            await addClient(data);
            info({
              title: APP_MESSAGES.CLIENTS.CREATE_SUCCESS_TITLE,
              message: APP_MESSAGES.CLIENTS.CREATE_SUCCESS_MSG
            });
          }
          closeForm();
        } catch (err: any) {
          error({
            title: 'Erro na Operação',
            message: err.message || APP_MESSAGES.GENERAL.GENERIC_ERROR
          });
        }
      }
    });
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingClient(null);
  };

  const handleDelete = (client: Client) => {
    confirm({
      title: APP_MESSAGES.CLIENTS.DELETE_CONFIRM_TITLE,
      message: APP_MESSAGES.CLIENTS.DELETE_CONFIRM_MSG(client.name),
      confirmLabel: 'Excluir',
      onConfirm: () => {
        console.log('Excluir cliente:', client.id);
        info({
          title: APP_MESSAGES.CLIENTS.DELETE_SUCCESS_TITLE,
          message: APP_MESSAGES.CLIENTS.DELETE_SUCCESS_MSG
        });
      }
    });
  };

  const columns: Column<Client>[] = [
    { 
      header: 'Nome', 
      accessor: 'name',
      className: 'font-medium text-gray-900',
      sortable: true
    },
    { 
      header: 'Documento', 
      accessor: 'document',
      className: 'font-mono text-sm text-gray-500',
      sortable: true
    },
    { 
      header: 'Tipo', 
      accessor: (client) => (
        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
          client.type === 'PF' ? 'bg-emerald-100 text-emerald-700' : 'bg-violet-100 text-violet-700'
        }`}>
          {client.type === 'PF' ? 'Pessoa Física' : 'Pessoa Jurídica'}
        </span>
      ),
      sortable: true,
      sortKey: 'type'
    },
    { 
      header: 'Telefone', 
      accessor: (client) => formatPhone(client.phone),
      className: 'text-gray-600'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Clientes</h2>
          <p className="text-gray-500 text-sm">Gerencie o cadastro e histórico dos seus clientes.</p>
        </div>
        
        <button 
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-semibold transition-all shadow-md active:scale-95 flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Novo Cliente
        </button>
      </div>

      <Modal 
        isOpen={showForm} 
        onClose={closeForm}
        title={editingClient ? 'Editar Cliente' : 'Cadastrar Novo Cliente'}
      >
        <ClientForm 
          key={editingClient?.id || 'new'} 
          initialData={editingClient || undefined}
          onSubmit={handleAddClient} 
          onCancel={closeForm} 
        />
      </Modal>

      <DataTable<Client>
        columns={columns}
        data={clients}
        loading={loading}
        pagination={pagination}
        onPageChange={(page) => fetchClients(page, limit, searchTerm, typeFilter, sortConfig)}
        searchTerm={searchTerm}
        onSearchChange={handleSearch}
        typeFilter={typeFilter}
        onTypeFilterChange={handleTypeFilterChange}
        limit={limit}
        onLimitChange={handleLimitChange}
        sortConfig={sortConfig}
        onSort={handleSort}
        loaderSize="lg"
        emptyMessage={APP_MESSAGES.CLIENTS.EMPTY_LIST}
        renderActions={(client) => (
          <>
            <button 
              onClick={() => handleEdit(client)}
              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              title="Editar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
            <button 
              onClick={() => handleDelete(client)}
              className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
              title="Excluir"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1-1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </>
        )}
      />
    </div>
  );
};
