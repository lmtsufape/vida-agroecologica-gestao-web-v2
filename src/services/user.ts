import { Presidente, User } from '@/types/api';
import { api } from './api';

export async function createUser({
  name,
  email,
  password,
  apelido,
  telefone,
  cpf,
  roles,
}: User) {
  const response = await api.post('/api/users', {
    name,
    email,
    password,
    apelido,
    telefone,
    cpf,
    roles,
  });
  return response.data;
}

export async function signIn(email: string, password: string) {
  const response = await api.post('/api/sanctum/token', {
    email,
    password,
    device_name: 'Ellen', // TODO: Get Device Name
  });
  localStorage.setItem('@token', response.data.token);
  localStorage.setItem('@roles', response.data.user.roles);

  window.location.href = '/menu';
}

export async function getPresidents(
  token: string,
): Promise<{ data: Presidente[] }> {
  try {
    const response = await api.get(`/api/users/presidents`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch presidents');
  }
}
