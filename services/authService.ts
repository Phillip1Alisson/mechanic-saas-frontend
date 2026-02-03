
import { User } from '../types';
import { STORAGE_KEYS, AUTH_CONFIG, APP_MESSAGES } from '../constants';

export const authService = {
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    // Mock de chamada para API PHP
    if (email === AUTH_CONFIG.DEFAULT_ADMIN_EMAIL && password === AUTH_CONFIG.DEFAULT_ADMIN_PASS) {
      const user: User = { id: '1', name: 'Mecânico Chefe', email };
      const token = 'fake-jwt-token-' + Math.random();
      
      localStorage.setItem(STORAGE_KEYS.TOKEN, token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      
      return { user, token };
    }
    
    throw new Error(APP_MESSAGES.AUTH.INVALID_CREDENTIALS);
  },

  logout(): void {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  },

  getStoredData(): { user: User | null; token: string | null } {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    const user = userStr ? JSON.parse(userStr) : null;
    
    return { user, token };
  }
};
