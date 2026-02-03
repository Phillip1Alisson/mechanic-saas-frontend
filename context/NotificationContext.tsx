
import React, { createContext, useState, useCallback, useContext } from 'react';

type NotificationType = 'confirm' | 'info' | 'error';

interface NotificationOptions {
  title: string;
  message: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
}

interface NotificationState extends NotificationOptions {
  type: NotificationType;
  isOpen: boolean;
}

interface NotificationContextData {
  confirm: (options: NotificationOptions) => void;
  info: (options: Omit<NotificationOptions, 'onConfirm' | 'onCancel'>) => void;
  error: (options: Omit<NotificationOptions, 'onConfirm' | 'onCancel'>) => void;
  close: () => void;
}

const NotificationContext = createContext<NotificationContextData>({} as NotificationContextData);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<NotificationState>({
    isOpen: false,
    type: 'info',
    title: '',
    message: '',
  });

  const confirm = useCallback((options: NotificationOptions) => {
    setState({ ...options, type: 'confirm', isOpen: true });
  }, []);

  const info = useCallback((options: Omit<NotificationOptions, 'onConfirm' | 'onCancel'>) => {
    setState({ ...options, type: 'info', isOpen: true });
  }, []);

  const error = useCallback((options: Omit<NotificationOptions, 'onConfirm' | 'onCancel'>) => {
    setState({ ...options, type: 'error', isOpen: true });
  }, []);

  const close = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  return (
    <NotificationContext.Provider value={{ confirm, info, error, close }}>
      {children}
      {state.isOpen && <NotificationDialog state={state} onClose={close} />}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotification must be used within a NotificationProvider');
  return context;
};

// Componente interno para renderizar o diálogo
const NotificationDialog: React.FC<{ state: NotificationState; onClose: () => void }> = ({ state, onClose }) => {
  const handleConfirm = () => {
    if (state.onConfirm) state.onConfirm();
    onClose();
  };

  const handleCancel = () => {
    if (state.onCancel) state.onCancel();
    onClose();
  };

  const icons = {
    confirm: (
      <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    ),
    info: (
      <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
    ),
    error: (
      <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
    ),
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={state.type !== 'confirm' ? onClose : undefined} />
      <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full flex flex-col items-center text-center animate-in zoom-in-95 duration-200">
        {icons[state.type]}
        <h3 className="text-xl font-bold text-gray-900 mb-2">{state.title}</h3>
        <p className="text-gray-500 mb-8">{state.message}</p>
        
        <div className="flex gap-3 w-full">
          {state.type === 'confirm' ? (
            <>
              <button onClick={handleCancel} className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-all">
                {state.cancelLabel || 'Cancelar'}
              </button>
              <button onClick={handleConfirm} className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-md transition-all active:scale-95">
                {state.confirmLabel || 'Confirmar'}
              </button>
            </>
          ) : (
            <button onClick={onClose} className="w-full px-4 py-2.5 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-all active:scale-95">
              OK
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
