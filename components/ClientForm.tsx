
import React from 'react';
import { z } from 'zod';
import { ClientType, Client } from '../types';
import { isValidCPF, isValidCNPJ } from '../utils/validators';
import { Form, FormFieldDefinition } from './Form';

interface ClientFormProps {
  initialData?: Partial<Client>;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

const clientSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  phone: z.string().min(14, 'Telefone incompleto'), // (00) 0000-0000 min
  type: z.nativeEnum(ClientType),
  document: z.string().min(11, 'Documento incompleto')
}).refine((data) => {
  if (data.type === ClientType.PF) return isValidCPF(data.document);
  if (data.type === ClientType.PJ) return isValidCNPJ(data.document);
  return false;
}, {
  message: "Documento inválido para o tipo selecionado",
  path: ["document"]
});

export const ClientForm: React.FC<ClientFormProps> = ({ initialData, onSubmit, onCancel }) => {
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
      initialData={initialData || { type: ClientType.PF }}
      onSubmit={onSubmit}
      onCancel={onCancel}
      submitLabel={initialData?.id ? 'Atualizar Dados' : 'Cadastrar Cliente'}
    />
  );
};
