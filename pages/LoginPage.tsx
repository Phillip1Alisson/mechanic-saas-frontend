
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { APP_MESSAGES, AUTH_CONFIG } from '../constants';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await signIn(email, password);
      navigate('/clients');
    } catch (err: any) {
      setError(err.message || APP_MESSAGES.AUTH.LOGIN_ERROR);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="bg-blue-600 p-8 text-center text-white">
          <h1 className="text-3xl font-bold italic tracking-tighter">MecânicaPro</h1>
          <p className="mt-2 text-blue-100">Painel de Controle da Oficina</p>
        </div>
        
        <form onSubmit={handleLogin} className="p-8 space-y-6">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 text-sm rounded">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 block">E-mail</label>
            <input 
              type="email" 
              required
              placeholder={AUTH_CONFIG.DEFAULT_ADMIN_EMAIL}
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 block">Senha</label>
            <input 
              type="password" 
              required
              placeholder="••••••"
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all shadow-lg active:scale-95 disabled:opacity-50"
          >
            {isSubmitting ? 'Autenticando...' : 'Entrar no Sistema'}
          </button>
          
          <p className="text-xs text-center text-gray-400">
            Dica: Use <strong>{AUTH_CONFIG.DEFAULT_ADMIN_EMAIL}</strong> e senha <strong>{AUTH_CONFIG.DEFAULT_ADMIN_PASS}</strong>
          </p>
        </form>
      </div>
    </div>
  );
};
