import { Role } from '../types/api';
import { api } from './api';

import { Presidente, User } from '@/types/api';

export async function createUser(
  {
    name,
    email,
    password,
    telefone,
    cpf,
    roles,
    rua,
    cep,
    numero,
    bairro_id,
  }: User,
  token: string,
) {
  const response = await api.post(
    '/api/users',
    {
      name,
      email,
      password,
      telefone,
      cpf,
      roles,
      rua,
      cep,
      numero,
      bairro_id,
    },
    {
      headers: {
        authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
}

export async function signIn(email: string, password: string) {
  const response = await api.post('/api/sanctum/token', {
    email,
    password,
    device_name: 'Ellen', // TODO: Get Device Name
  });
  localStorage.setItem('@token', response.data.token);
  localStorage.setItem('@roles', JSON.stringify(response.data.user.roles));
  localStorage.setItem('userId', response.data.user.id);
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

export async function getAllUsers(token: string): Promise<{ users: User[] }> {
  try {
    const response = await api.get(`/api/users`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch users');
  }
}

export async function getUser(
  token: string,
  id: string,
): Promise<{ user: User[] }> {
  try {
    const response = await api.get(`/api/users/${id}`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch user');
  }
}

export async function editUser(
  {
    name,
    password,
    email,
    telefone,
    cpf,
    roles,
    rua,
    cep,
    numero,
    bairro_id,
  }: User,
  token: string,
  id: string,
) {
  const response = await api.patch(
    `/api/users/${id}`,
    {
      name,
      email,
      password,
      telefone,
      cpf,
      roles,
      rua,
      cep,
      numero,
      bairro_id,
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

export async function removeUser(token: string, id: number) {
  const response = await api.delete(`/api/users/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function getAllRoles(token: string): Promise<Role[]> {
  try {
    const response = await api.get(`/api/roles`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch users');
  }
}

export async function sendResetPasswordEmail(email: string) {
  try {
    const response = await api.post('api/forgot-password', { email });
    return response.data;
  } catch (error) {
    throw new Error('Failed to send reset password email');
  }
}

export async function resetPassword(
  token: string,
  email: string,
  password: string,
  password_confirmation: string,
) {
  try {
    const response = await api.post('api/reset-password', {
      token,
      email,
      password,
      password_confirmation,
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to reset password');
  }
}
