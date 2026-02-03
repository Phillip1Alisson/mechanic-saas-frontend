
import React, { useState, useEffect, useMemo } from 'react';
import { z } from 'zod';
import { Input } from './Input';
import { Select } from './Select';
import { formatPhone, formatDocument } from '../utils/validators';

export type FormFieldType = 'text' | 'tel' | 'select' | 'document' | 'password' | 'email';

export interface FormFieldDefinition {
  name: string;
  label: string;
  type: FormFieldType;
  placeholder?: string;
  options?: { value: string; label: string }[];
  className?: string;
}

interface FormProps<T> {
  title?: string;
  fields: FormFieldDefinition[];
  schema: z.ZodSchema<T>;
  initialData?: Partial<T>;
  onSubmit: (data: T) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
  isLoading?: boolean;
}

export function Form<T extends Record<string, any>>({
  title,
  fields,
  schema,
  initialData,
  onSubmit,
  onCancel,
  submitLabel = 'Salvar',
  isLoading = false
}: FormProps<T>) {
  // Função para aplicar máscara nos dados que chegam do backend/externo
  const applyInitialMasks = (data: Partial<T>): T => {
    // Fix: Cast to any to allow dynamic indexing on generic type T which is otherwise read-only when indexed with string
    const formatted = { ...data } as any;
    fields.forEach(field => {
      const val = formatted[field.name];
      if (val) {
        if (field.type === 'tel') {
          // Fix: generic indexing for writing
          formatted[field.name] = formatPhone(String(val));
        } else if (field.type === 'document') {
          const docType = formatted['type'] || 'PF';
          // Fix: generic indexing for writing
          formatted[field.name] = formatDocument(String(val), docType);
        }
      }
    });
    return formatted as T;
  };

  const [formData, setFormData] = useState<T>(() => applyInitialMasks(initialData || {}));
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  useEffect(() => {
    if (initialData) {
      setFormData(applyInitialMasks(initialData));
    }
  }, [initialData]);

  // Compara os dados atuais com os iniciais ignorando caracteres de formatação (pontos, traços, parênteses)
  const isDirty = useMemo(() => {
    const base = initialData || {};
    return fields.some(field => {
      // Fix: Cast to any for dynamic indexing to avoid generic constraint issues
      const current = (formData as any)[field.name];
      const original = (base as any)[field.name];
      
      const normalizedCurrent = current === undefined || current === null ? '' : String(current);
      const normalizedOriginal = original === undefined || original === null ? '' : String(original);
      
      // Se for um campo com máscara, comparamos apenas os dígitos
      if (field.type === 'tel' || field.type === 'document') {
        return normalizedCurrent.replace(/\D/g, '') !== normalizedOriginal.replace(/\D/g, '');
      }

      return normalizedCurrent !== normalizedOriginal;
    });
  }, [formData, initialData, fields]);

  const handleFieldChange = (name: string, value: any, type: FormFieldType) => {
    let finalValue = value;

    if (type === 'tel') {
      finalValue = formatPhone(value);
    } else if (type === 'document') {
      // Fix: Cast to any for dynamic indexing
      const docType = (formData as any)['type'] || 'PF';
      finalValue = formatDocument(value, docType);
    }
    
    // Fix: Cast to any for dynamic indexing
    if (name === 'type' && (formData as any)['document']) {
      const reformattedDoc = formatDocument((formData as any)['document'], value);
      setFormData(prev => ({ 
        ...prev, 
        [name]: value,
        document: reformattedDoc 
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: finalValue }));
    }
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleBlur = (name: string) => {
    const result = schema.safeParse(formData);
    if (!result.success) {
      const issue = result.error.issues.find(i => i.path.includes(name));
      if (issue) {
        setErrors(prev => ({ ...prev, [name]: issue.message }));
      } else {
        setErrors(prev => ({ ...prev, [name]: null }));
      }
    } else {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = schema.safeParse(formData);
    
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as string;
        if (!fieldErrors[path]) fieldErrors[path] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    try {
      await onSubmit(result.data);
    } catch (err: any) {
      setErrors({ root: err.message || 'Erro ao processar formulário' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md border border-gray-100 space-y-6 animate-in fade-in duration-300">
      {title && (
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex flex-col">
            <h3 className="text-xl font-bold text-gray-800">{title}</h3>
            {initialData?.id && (
              <span className="text-[10px] text-blue-600 font-bold uppercase tracking-tighter">Modo Edição</span>
            )}
          </div>
          <span className="text-xs text-gray-400 font-mono">
            {initialData?.id ? `ID: ${initialData.id}` : 'NOVO REGISTRO'}
          </span>
        </div>
      )}

      {errors.root && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg text-sm border-l-4 border-red-500">
          {errors.root}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fields.map((field) => (
          <div key={field.name} className={field.className}>
            {field.type === 'select' ? (
              <Select
                label={field.label}
                // Fix: Cast to any for dynamic indexing
                value={(formData as any)[field.name] || ''}
                options={field.options || []}
                error={errors[field.name]}
                onChange={(e) => handleFieldChange(field.name, e.target.value, field.type)}
                onBlur={() => handleBlur(field.name)}
              />
            ) : (
              <Input
                label={field.label}
                type={field.type === 'document' ? 'text' : field.type}
                placeholder={field.placeholder}
                // Fix: Cast to any for dynamic indexing
                value={(formData as any)[field.name] || ''}
                error={errors[field.name]}
                onChange={(e) => handleFieldChange(field.name, e.target.value, field.type)}
                onBlur={() => handleBlur(field.name)}
                maxLength={field.type === 'tel' ? 15 : undefined}
              />
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-4 pt-6 border-t">
        {onCancel && (
          <button 
            type="button" 
            onClick={onCancel}
            disabled={isLoading}
            className="px-6 py-2.5 text-gray-500 font-semibold hover:bg-gray-50 rounded-lg transition-all"
          >
            Cancelar
          </button>
        )}
        <button 
          type="submit" 
          disabled={isLoading || !isDirty}
          className={`px-10 py-2.5 font-bold rounded-lg transition-all shadow-md flex items-center gap-2 ${
            !isDirty 
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none' 
              : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
          }`}
          title={!isDirty ? 'Altere algum campo para salvar' : ''}
        >
          {isLoading ? 'Salvando...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
