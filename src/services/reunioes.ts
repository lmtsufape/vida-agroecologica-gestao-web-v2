import { api } from './api';

import { Reunioes } from '@/types/api';

export async function getAllReunioes(
  token: string,
): Promise<{ reunioes: Reunioes[] }> {
  try {
    const response = await api.get('/api/reunioes', {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch reunião: ', error);
    throw new Error('Failed to fetch reunião');
  }
}

export async function getReuniao(
  token: string,
  id: number,
): Promise<{ reuniao: Reunioes }> {
  try {
    const response = await api.get(`/api/reunioes/${id}`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch reunião: ', error);
    throw new Error('Failed to fetch reunião');
  }
}

export async function createReuniao(
  {
    titulo,
    pauta,
    data,
    tipo,
    participantes,
    associacao_id,
    organizacao_id,
  }: Reunioes,
  token: string,
) {
  const participantesIds = (participantes as [{id:number, name:string}]).map((participante) => participante.id);
  const response = await api.post(
    '/api/reunioes',
    {
      titulo,
      pauta,
      data,
      tipo,
      participantes: participantesIds,
      associacao_id,
      organizacao_id,
    },
    {
      headers: {
        authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
}

export async function editReuniao(
  { titulo, pauta, data, tipo, participantes, organizacao_id }: Reunioes,
  token: string,
  id: number,
) {
  const response = await api.patch(
    `/api/reunioes/${id}`,
    {
      titulo,
      pauta,
      data,
      tipo,
      participantes,
      organizacao_id,
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

export async function removeReuniao(token: string, id: number) {
  const response = await api.delete(`/api/reunioes/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function removeAta(token: string, id: number) {
  const response = await api.delete(`/api/reunioes/${id}/ata`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}
