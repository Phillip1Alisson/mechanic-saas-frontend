import { z } from 'zod';
import { ClientType } from '../../types';
import { isValidCPF, isValidCNPJ } from '../validators';

export const clientSchema = z
  .object({
    name: z
      .string({ required_error: 'Campo obrigatório' })
      .min(1, 'Campo obrigatório')
      .min(3, 'Nome deve ter no mínimo 3 caracteres'),
    phone: z
      .string({ required_error: 'Campo obrigatório' })
      .min(1, 'Campo obrigatório')
      .min(14, 'Telefone incompleto'),
    type: z.nativeEnum(ClientType),
    document: z
      .string({ required_error: 'Campo obrigatório' })
      .min(1, 'Campo obrigatório')
      .min(11, 'Documento incompleto'),
  })
  .refine(
    (data) => {
      const digits = data.document.replace(/\D/g, '');
      if (data.type === ClientType.PF) return digits.length === 11;
      if (data.type === ClientType.PJ) return digits.length === 14;
      return false;
    },
    {
      message: 'O número de dígitos não corresponde ao tipo selecionado (CPF: 11, CNPJ: 14)',
      path: ['document'],
    }
  )
  .refine(
    (data) => {
      if (data.type === ClientType.PF) return isValidCPF(data.document);
      if (data.type === ClientType.PJ) return isValidCNPJ(data.document);
      return false;
    },
    (data) => ({
      message:
        data.type === ClientType.PF ? 'CPF não válido' : 'CNPJ não válido',
      path: ['document'],
    })
  );

export type ClientFormData = z.infer<typeof clientSchema>;
