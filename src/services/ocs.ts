import { OCS } from '@/types/api';
import { api } from './api';

export async function getAllOCS(token: string): Promise<{ data: OCS[] }> {
  try {
    const response = await api.get('/api/ocs', {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch ocs');
  }
}

export async function getOCS(
  token: string,
  id: string,
): Promise<{ data: OCS[] }> {
  try {
    const response = await api.get(`/api/ocs/${id}`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch ocs');
  }
}

export async function createOCS(
  {
    nome,
    cnpj,
    data_fundacao,
    email,
    telefone,
    rua,
    numero,
    cep,
    bairro_id,
    associacao_id,
  }: OCS,
  token: string,
) {
  const response = await api.post(
    '/api/ocs/store',
    {
      nome,
      cnpj,
      data_fundacao,
      email,
      telefone,
      rua,
      numero,
      cep,
      bairro_id,
      associacao_id,
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

export async function editOCS(
  {
    nome,
    cnpj,
    data_fundacao,
    email,
    telefone,
    rua,
    numero,
    cep,
    bairro_id,
    associacao_id,
  }: OCS,
  token: string,
  id: string,
) {
  const response = await api.patch(
    `/api/ocs/${id}`,
    {
      nome,
      cnpj,
      data_fundacao,
      email,
      telefone,
      rua,
      numero,
      cep,
      bairro_id,
      associacao_id,
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

export async function removeOCS(token: string, id: string) {
  const response = await api.delete(`/api/ocs/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}
