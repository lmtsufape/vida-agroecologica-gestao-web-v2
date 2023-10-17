import { Bairro } from '@/types/api';
import { api } from './api';

export async function getAllBairros(
  token: string,
): Promise<{ data: Bairro[] }> {
  try {
    const response = await api.get('/api/bairros', {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch bairros');
  }
}
