
import { User } from '../types';

const TOKEN_KEY = '@MecanicaPro:token';
const USER_KEY = '@MecanicaPro:user';

export const authService = {
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    // Mock de chamada para API PHP
    if (email === 'admin@mecanica.com' && password === '123456') {
      const user: User = { id: '1', name: 'Mecânico Chefe', email };
      const token = 'fake-jwt-token-' + Math.random();
      
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      
      return { user, token };
    }
    
    throw new Error('Credenciais inválidas. Use admin@mecanica.com / 123456');
  },

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  getStoredData(): { user: User | null; token: string | null } {
    const token = localStorage.getItem(TOKEN_KEY);
    const userStr = localStorage.getItem(USER_KEY);
    const user = userStr ? JSON.parse(userStr) : null;
    
    return { user, token };
  }
};
