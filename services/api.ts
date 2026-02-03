
/**
 * Simula uma camada de transporte de rede.
 * Em um ambiente real, aqui usaríamos axios ou fetch apontando para a API PHP.
 */
export const api = {
  async get<T>(url: string, params?: any): Promise<T> {
    console.log(`[API GET] ${url}`, params);
    await new Promise(resolve => setTimeout(resolve, 600)); // Delay simulado
    return {} as T; 
  },

  async post<T>(url: string, body: any): Promise<T> {
    console.log(`[API POST] ${url}`, body);
    await new Promise(resolve => setTimeout(resolve, 800));
    return {} as T;
  }
};
