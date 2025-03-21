import { api } from './api';

import { Bairro } from '@/types/api';

export async function getAllBairros(token: string): Promise<Bairro[]> {
  try {
    const response = await api.get('/api/bairros', {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    return response?.data?.bairros;
  } catch (error) {
    console.error('Failed to fetch bairros: ', error);
    throw new Error('Failed to fetch bairros');
  }
}
