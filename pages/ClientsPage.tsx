
import React, { useState } from 'react';
import { useClients } from '../hooks/useClients';
import { ClientForm } from '../components/ClientForm';
import { DataTable, Column } from '../components/DataTable';
import { Client } from '../types';
import { formatPhone } from '../utils/validators';

export const ClientsPage: React.FC = () => {
  const { clients, loading, pagination, fetchClients, addClient } = useClients();
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const handleAddClient = async (data: any) => {
    // Se estivéssemos em uma API real, aqui chamaríamos update ou create baseado no ID
    if (editingClient) {
      console.log('Atualizando cliente:', editingClient.id, data);
      alert('Simulação: Cliente atualizado com sucesso!');
    } else {
      await addClient(data);
    }
    
    closeForm();
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setShowForm(true);
    // Scroll suave para o topo do formulário
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingClient(null);
  };

  const handleDelete = (client: Client) => {
    if (confirm(`Deseja realmente excluir ${client.name}?`)) {
      console.log('Excluir cliente:', client.id);
      alert('Simulação: Cliente removido.');
    }
  };

  const columns: Column<Client>[] = [
    { 
      header: 'Nome', 
      accessor: 'name',
      className: 'font-medium text-gray-900'
    },
    { 
      header: 'Documento', 
      accessor: 'document',
      className: 'font-mono text-sm'
    },
    { 
      header: 'Tipo', 
      accessor: (client) => (
        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
          client.type === 'PF' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'
        }`}>
          {client.type}
        </span>
      )
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
          <p className="text-gray-500">Gerencie o cadastro de clientes da sua oficina.</p>
        </div>
        
        {!showForm && (
          <button 
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-sm active:scale-95"
          >
            + Adicionar Cliente
          </button>
        )}
      </div>

      {showForm && (
        <ClientForm 
          key={editingClient?.id || 'new'} // CRITICAL: Força o React a remontar o form ao trocar de cliente
          initialData={editingClient || undefined}
          onSubmit={handleAddClient} 
          onCancel={closeForm} 
        />
      )}

      <DataTable<Client>
        columns={columns}
        data={clients}
        loading={loading}
        pagination={pagination}
        onPageChange={fetchClients}
        loaderSize="lg"
        emptyMessage="Nenhum cliente cadastrado no sistema."
        renderActions={(client) => (
          <>
            <button 
              onClick={() => handleEdit(client)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
              title="Editar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
            <button 
              onClick={() => handleDelete(client)}
              className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
              title="Excluir"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1-1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </>
        )}
      />
    </div>
  );
};
