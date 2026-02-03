
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const Layout: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut();
    navigate('/login');
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
            <span className="text-sm text-slate-300 hidden sm:inline">Olá, {user?.name}</span>
            <button 
              onClick={handleLogout}
              className="text-sm bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded transition-colors"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>

      <footer className="bg-white border-t py-4 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} MecânicaPro SaaS - Gestão Inteligente
      </footer>
    </div>
  );
};
