import { api } from './api';

import { Associacao } from '@/types/api';

export const getAllAssociacoes = async (
  token: string | null,
): Promise<Associacao[]> => {
  try {
    const response = await api.get('/api/associacoes', {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    return response.data.associacoes;
  } catch (error) {
    console.error('Erro ao buscar associações: ', error);
    throw new Error('Erro ao buscar associações.');
  }
};

export async function getAssociacao(
  token: string,
  id: string,
): Promise<Associacao> {
  try {
    const response = await api.get(`/api/associacoes/${id}`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    return response?.data?.associacao;
  } catch (error) {
    console.error('Erro ao buscar associação: ', error);
    throw new Error('Erro ao buscar associação.');
  }
}

export async function createAssociacao(
  {
    nome,
    email,
    telefone,
    data_fundacao,
    rua,
    cep,
    numero,
    bairro_id,
    secretarios_id,
    presidentes_id,
  }: Associacao,
  token: string,
) {
  const response = await api.post(
    '/api/associacoes',
    {
      nome,
      email,
      telefone,
      data_fundacao,
      rua,
      cep,
      numero,
      bairro_id,
      secretarios_id,
      presidentes_id,
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
  {
    nome,
    email,
    telefone,
    data_fundacao,
    rua,
    cep,
    numero,
    bairro_id,
    secretarios_id,
    presidentes_id,
  }: Associacao,
  token: string,
  id: string,
) {
  const response = await api.patch(
    `/api/associacoes/${id}`,
    {
      nome,
      email,
      telefone,
      data_fundacao,
      rua,
      cep,
      numero,
      bairro_id,
      secretarios_id,
      presidentes_id,
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

export async function removeAssociacao(token: string, id: number) {
  try {
    const response = await api.delete(`/api/associacoes/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao remover associação: ', error);
    throw new Error('Erro ao remover associação.');
  }
}
