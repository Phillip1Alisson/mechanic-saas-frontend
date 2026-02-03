import React, { useMemo } from 'react';
import { ClientType, Client } from '../types';
import { clientSchema } from '../utils/schemas/clientSchema';
import { Form, FormFieldDefinition } from './Form';

const DEFAULT_NEW_CLIENT_DATA = { type: ClientType.PF } as const;

interface ClientFormProps {
  initialData?: Partial<Client>;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const ClientForm: React.FC<ClientFormProps> = ({ initialData, onSubmit, onCancel, isSubmitting }) => {
  const stableInitialData = useMemo(
    () => initialData ?? DEFAULT_NEW_CLIENT_DATA,
    [initialData?.id]
  );

  const fields: FormFieldDefinition[] = [
    { 
      name: 'name', 
      label: 'Nome / Razão Social', 
      type: 'text', 
      placeholder: 'Digite o nome do cliente' 
    },
    { 
      name: 'phone', 
      label: 'Telefone', 
      type: 'tel', 
      placeholder: '(00) 00000-0000' 
    },
    { 
      name: 'type', 
      label: 'Tipo', 
      type: 'select', 
      options: [
        { value: ClientType.PF, label: 'Pessoa Física' },
        { value: ClientType.PJ, label: 'Pessoa Jurídica' }
      ]
    },
    { 
      name: 'document', 
      label: 'CPF ou CNPJ', 
      type: 'document', 
      placeholder: '000.000.000-00' 
    }
  ];

  return (
    <Form
      title={initialData?.id ? 'Editar Cliente' : 'Novo Cliente'}
      fields={fields}
      schema={clientSchema}
      initialData={stableInitialData}
      onSubmit={onSubmit}
      onCancel={onCancel}
      submitLabel={initialData?.id ? 'Atualizar Dados' : 'Cadastrar Cliente'}
      isLoading={isSubmitting}
    />
  );
};
