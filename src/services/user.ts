import { Role, UserAddressEdit } from '../types/api';
import { api } from './api';

import { Presidente, User } from '@/types/api';
import { UserAdressType } from '@/app/usuarios/editar/[id]/page';

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
    console.error('Failed to fetch presidents: ', error);
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
    console.error('Failed to fetch users: ', error);
    throw new Error('Failed to fetch users');
  }
}

export async function getUser(
  token: string,
  id: string,
): Promise<{ user: User }> {
  try {
    const response = await api.get(`/api/users/${id}`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user: ', error);
    throw new Error('Failed to fetch user');
  }
}

export async function getUserAddress(
  token: string,
): Promise<UserAdressType> {
  try {
    const response = await api.get(`api/users/enderecos`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    return response.data[0] as UserAdressType;
  } catch (error) {
    console.error('Failed to fetch user address: ', error);
    throw new Error('Failed to fetch user address');
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
    ativo,
    endereco_id,
    complemento,
  }: UserAddressEdit,
  token: string,
  id: string,
) {
  const responseUser = await api.patch(
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
      ativo,
    },
    {
      headers: {
        authorization: `Bearer ${token}`,
      },
    },
  );
  console.log(`Edit User : ${responseUser.data}`);

    const responseAddress = await api.patch(
    `/api/users/enderecos/${endereco_id}`,
    {
      rua,
      cep,
      numero,
      complemento,
      bairro_id,
    },
    {
      headers: {
        authorization: `Bearer ${token}`,
      },
    },
  );
  console.log(`Edit Address: ${responseAddress.data}`);

  return { ...responseUser.data, endereco: responseAddress.data };
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
    console.error('Failed to fetch users: ', error);
    throw new Error('Failed to fetch users');
  }
}

export async function sendResetPasswordEmail(email: string) {
  try {
    const response = await api.post('api/forgot-password', { email });
    return response.data;
  } catch (error) {
    console.error('Failed to send reset password email: ', error);
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
    console.error('Failed to reset password: ', error);
    throw new Error('Failed to reset password');
  }
}

