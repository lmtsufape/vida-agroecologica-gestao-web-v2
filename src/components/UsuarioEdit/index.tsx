'use client';

import { redirect, useRouter } from 'next/navigation';
import React, { useState } from 'react';

import S from './styles.module.scss';

import Button from '@/components/Button';
import Input from '@/components/Input';
import MultiSelect from '@/components/Multiselect';
import { StyledSelect } from '@/components/Multiselect/style';

import { editUser, getAllRoles, getUser } from '@/services';
import { APIErrorResponse, User } from '@/types/api';
import { Alert, AlertTitle, Snackbar } from '@mui/material';
import { useQuery } from '@tanstack/react-query';

type UsuarioEditHomeProps = {
  id: string;
};

const UsuarioEditHome = ({ id }: UsuarioEditHomeProps) => {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [cpf, setCpf] = React.useState('');
  const [telefone, setTelefone] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [content, setContent] = React.useState<User | null>(null);

  const [selectedRole, setSelectedRole] = React.useState<string | string[]>([]);

  const [error, setError] = useState('');
  /* WARN SnackBar */
  // const [warn, setWarn] = useState('');
  const [info, setInfo] = useState('');
  const [confirmationMessage, setConfirmationMessage] = useState('');

  const router = useRouter();

  const { data: roles } = useQuery({
    queryKey: ['roles'],
    queryFn: () => {
      const token = localStorage.getItem('@token');
      if (token) {
        return getAllRoles(token);
      }
      return null;
    },
  });

  React.useEffect(() => {
    const token = localStorage.getItem('@token');
    if (!token) {
      redirect('/');
    }
    getUser(token, id)
      .then((response: { user: User }) => {
        setContent(response.user);
      })
      .catch((error: unknown) => console.log(error));
  }, [id]);

  React.useEffect(() => {
    if (content && roles) {
      setName(content.name ?? '');
      setEmail(content.email ?? '');
      setCpf(content.cpf ?? '');
      setTelefone(content.contato?.telefone ?? '');
      setPassword(content.password ?? '');

      // Mapeando os ids para os nomes das roles
      const roleNames = content.roles
        ?.map((role) =>
          typeof role !== 'number' && typeof role !== 'string'
            ? roles.find((r: { id: number; nome: string }) => r.id === role.id)
                ?.nome
            : '',
        )
        .filter((roleName) => roleName !== '') as string[];

      setSelectedRole(roleNames ?? ['']);
    }
  }, [content, roles]);

  const handleEditRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('@token');
      if (!token) {
        redirect('/');
      }

      // Convertendo os nomes de volta para ids
      const roleIds = (
        Array.isArray(selectedRole) ? selectedRole : [selectedRole]
      )
        .map(
          (roleName) =>
            roles?.find(
              (role: { id: number; nome: string }) => role.nome === roleName,
            )?.id,
        )
        .filter((roleId) => roleId !== undefined) as number[];

      const requestData = {
        name: name ?? content?.name,
        email: email ?? content?.email,
        cpf: cpf ?? content?.cpf,
        password: password ?? content?.password,
        telefone: telefone ?? content?.contato?.telefone,
        roles: roleIds,
        ativo: true,
      };

      await editUser(requestData, token, id);
      setConfirmationMessage('Usuário editado com sucesso!');
      setTimeout(() => {
        router.back();
      }, 2000);
    } catch (error: unknown) {
      const apiError = error as APIErrorResponse;
      const errors = apiError.response?.data?.errors;
      console.log(errors);
      if (errors) {
        for (const key of Object.keys(errors)) {
          const errorMessage = errors[key][0];
          setError(`${errorMessage}`);
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        }
      } else {
        console.log('Unexpected error', error);
      }
    }
  };

  React.useEffect(() => {
    if (content) {
      setName(content.name ?? '');
      setEmail(content.email ?? '');
      setCpf(content.cpf ?? '');
      setTelefone(content.contato?.telefone ?? '');
      setPassword(content.password ?? '');
    }
  }, [content]);

  if (!content) {
    return <p>Carregando...</p>;
  }

  return (
    <main>
      <div className={S.container}>
        <h1>Editar: {content?.name}</h1>
        <form onSubmit={handleEditRegister} className={S.form}>
          <h3>Dados</h3>
          <section>
            <div>
              <label htmlFor="nome">
                Nome<span>*</span>
              </label>
              <Input
                name="nome"
                type="text"
                placeholder={content?.name ?? ''}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="email">
                E-mail<span>*</span>
              </label>
              <Input
                name="email"
                type="email"
                placeholder={content?.email ?? ''}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {/*  <div>
              <label htmlFor="cnpj">
                Senha<span>*</span>
              </label>
              <Input
                name="password"
                type="password"
                placeholder={content?.password ?? ''}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div> */}
            <div>
              <label htmlFor="telefone">
                Telefone<span>*</span>
              </label>
              <Input
                name="telefone"
                type="text"
                placeholder={content?.contato?.telefone ?? ''}
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                mask="phone"
              />
            </div>
            {/* <div>
              <label htmlFor="cpf">
                CPF<span>*</span>
              </label>
              <Input
                name="cpf"
                type="text"
                placeholder={content?.cpf ?? ''}
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                mask="cpf"
              />
            </div> */}
            {roles !== undefined && (
              <MultiSelect
                label="Função"
                selectedNames={selectedRole}
                setSelectedNames={setSelectedRole}
              >
                {roles?.map((item: { id: number; nome: string }) => (
                  <StyledSelect
                    key={item.id}
                    value={item.nome}
                    sx={{ justifyContent: 'space-between' }}
                  >
                    {item.nome === 'agricultor' ? 'vendedor' : item.nome}
                  </StyledSelect>
                ))}
              </MultiSelect>
            )}
          </section>
          <div className={S.wrapperButtons}>
            <Button
              onClick={() => router.back()}
              type="button"
              dataType="transparent"
            >
              Voltar
            </Button>{' '}
            <Button dataType="filled" type="submit">
              Editar
            </Button>
          </div>
        </form>
      </div>
      <Snackbar
        open={error.length > 0}
        autoHideDuration={6000}
        onClose={() => setError('')}
      >
        <Alert variant="filled" severity="error">
          <AlertTitle>Erro!</AlertTitle>
          {error}
        </Alert>
      </Snackbar>
      {/*<Snackbar open={warn.length > 0} autoHideDuration={6000} onClose={() => setWarn('')}>*/}
      {/*  <Alert variant="filled" severity="warning">*/}
      {/*    <AlertTitle>Alerta!</AlertTitle>*/}
      {/*    {warn}*/}
      {/*  </Alert>*/}
      {/*</Snackbar>*/}
      <Snackbar
        open={info.length > 0}
        autoHideDuration={6000}
        onClose={() => setInfo('')}
      >
        <Alert variant="filled" severity="info">
          <AlertTitle>Info</AlertTitle>
          {info}
        </Alert>
      </Snackbar>
      <Snackbar
        open={confirmationMessage.length > 0}
        autoHideDuration={6000}
        onClose={() => setConfirmationMessage('')}
      >
        <Alert variant="filled" severity="success">
          <AlertTitle>Sucesso!</AlertTitle>
          {confirmationMessage}
        </Alert>
      </Snackbar>
    </main>
  );
};

export default UsuarioEditHome;
