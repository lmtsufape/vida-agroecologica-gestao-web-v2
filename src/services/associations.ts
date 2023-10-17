import { Associacao } from '@/types/api';
import { api } from './api';

export async function getAllAssociacoes(
  token: string,
): Promise<{ data: Associacao[] }> {
  try {
    const response = await api.get('/api/associacoes', {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch associacoes');
  }
}

export async function getAssociacao(
  token: string,
  id: string,
): Promise<{ data: Associacao[] }> {
  try {
    const response = await api.get(`/api/associacoes/${id}`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch associacoes');
  }
}

export async function createAssociacao(
  { nome, codigo, email, telefone, presidente }: Associacao,
  token: string,
) {
  const response = await api.post(
    '/api/associacoes',
    {
      nome,
      codigo,
      email,
      telefone,
      presidente,
    },
    {
      headers: {
        authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
}

export async function editAssociacao(
  { nome, codigo, email, telefone, presidente }: Associacao,
  token: string,
  id: string,
) {
  const response = await api.patch(
    `/api/associacoes/${id}`,
    {
      nome,
      codigo,
      email,
      telefone,
      presidente,
    },
    {
      headers: {
        authorization: `Bearer ${token}`,
      },
    },
  );
  console.log(response.data);
  return response.data;
}

export async function removeAssociacao(token: string, id: string) {
  const response = await api.delete(`/api/associacoes/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}
