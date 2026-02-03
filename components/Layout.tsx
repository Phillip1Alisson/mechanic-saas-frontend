
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../context/NotificationContext';

export const Layout: React.FC = () => {
  const { user, signOut } = useAuth();
  const { confirm } = useNotification();
  const navigate = useNavigate();

  const handleLogout = () => {
    confirm({
      title: 'Sair do Sistema',
      message: 'Tem certeza que deseja encerrar sua sessão atual?',
      confirmLabel: 'Sair',
      cancelLabel: 'Permanecer',
      onConfirm: () => {
        signOut();
        navigate('/login');
      }
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-slate-800 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center font-bold">M</div>
            <h1 className="text-xl font-bold tracking-tight">MecânicaPro</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end hidden sm:flex">
              <span className="text-sm font-medium">Olá, {user?.name}</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest">{user?.email}</span>
            </div>
            <button 
              onClick={handleLogout}
              className="text-sm bg-slate-700 hover:bg-red-600 px-4 py-1.5 rounded-lg transition-all active:scale-95 flex items-center gap-2 group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>

      <footer className="bg-white border-t py-6 text-center text-sm text-gray-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>&copy; {new Date().getFullYear()} MecânicaPro SaaS - Gestão Inteligente para Oficinas</p>
          <div className="flex items-center gap-4 text-xs">
            <a href="#" className="hover:text-blue-600 transition-colors">Termos de Uso</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Privacidade</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Suporte</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
