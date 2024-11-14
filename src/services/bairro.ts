import { api } from './api';

import { Bairro } from '@/types/api';

export async function getAllBairros(
  token: string,
): Promise<{ bairros: Bairro[] }> {
  try {
    const response = await api.get('/api/bairros', {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch bairros: ', error);
    throw new Error('Failed to fetch bairros');
  }
}
