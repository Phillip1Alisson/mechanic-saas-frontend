
import { User } from '../types';
import { STORAGE_KEYS, API_ROUTES, APP_MESSAGES } from '../constants';
import { api } from './api';

interface LoginResponseData {
  token: string;
  user?: User | null;
}

export const authService = {
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    try {
      const data = await api.post<LoginResponseData>(
        API_ROUTES.LOGIN,
        { email, password },
        { requiresAuth: false }
      );

      if (!data?.token) {
        throw new Error(APP_MESSAGES.AUTH.LOGIN_ERROR);
      }

      const user: User = data.user ?? {
        id: data.user?.id || 'self',
        name: data.user?.name || email.split('@')[0] || 'Usuário',
        email: data.user?.email || email,
      };

      localStorage.setItem(STORAGE_KEYS.TOKEN, data.token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));

      return { user, token: data.token };
    } catch (error) {
      const message = error instanceof Error ? error.message : APP_MESSAGES.AUTH.LOGIN_ERROR;
      throw new Error(message);
    }
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
