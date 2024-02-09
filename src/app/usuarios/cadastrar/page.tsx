'use client';

import { redirect, useRouter } from 'next/navigation';
import React from 'react';

import S from './styles.module.scss';

import Button from '@/components/Button';
import Input from '@/components/Input';
import MultiSelect from '@/components/Multiselect';
import { StyledSelect } from '@/components/Multiselect/style';
import MuiSelect from '@/components/Select';

import { createUser, getAllBairros, getAllRoles } from '@/services';
import { Bairro } from '@/types/api';
import { Alert, AlertTitle, Snackbar } from '@mui/material';
import { useQuery } from '@tanstack/react-query';

export default function Home() {
  const [error, setError] = React.useState('');
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [cpf, setCpf] = React.useState('');
  const [telefone, setTelefone] = React.useState('');
  const [password, setPassword] = React.useState('');

  const [street, setStreet] = React.useState('');
  const [cep, setCEP] = React.useState('');
  const [number, setNumber] = React.useState('');

  const [bairro, setBairro] = React.useState<Bairro[]>([]);
  const [selectedBairro, setSelectedBairro] = React.useState(1);

  const [selectedRole, setSelectedRole] = React.useState<string | string[]>([]);

  const [confirmationMessage, setConfirmationMessage] = React.useState('');

  const router = useRouter();

  React.useEffect(() => {
    const token = localStorage.getItem('@token');
    if (!token) {
      redirect('/');
    }
    getAllBairros(token)
      .then((response: { bairros: Bairro[] }) => setBairro(response.bairros))
      .catch((error: unknown) => console.log(error));
  }, []);

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

  const getRoleIdByName = (roleName: string): number | undefined => {
    const selectedRoleObject = roles?.find((role) => role.nome === roleName);
    return selectedRoleObject?.id;
  };

  const handleRegister: (e: React.FormEvent) => Promise<void> = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('@token');
      if (!token) {
        redirect('/');
      }

      const selectedRoleIds = Array.isArray(selectedRole)
        ? (selectedRole
            .map((role) => getRoleIdByName(role as string))
            .filter(Boolean) as number[])
        : [getRoleIdByName(selectedRole as string) as number];

      await createUser(
        {
          name: name,
          email: email,
          cpf,
          password: password,
          telefone: telefone,
          roles: selectedRoleIds,
          rua: street,
          cep: cep,
          numero: number,
          bairro_id: selectedBairro,
        },
        token,
      );
      setConfirmationMessage('Usuário cadastrado com sucesso');
      setTimeout(() => {
        setConfirmationMessage('');
      }, 3000);

      router.back();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errors = error.response?.data?.errors;
      if (errors !== undefined && errors !== null) {
        for (const key of Object.keys(errors)) {
          const errorMessage = errors[key][0];
          setTimeout(() => {
            setError(`${errorMessage}`);
            window.location.reload();
          }, 4000);
        }
      }
    }
  };

  return (
    <main style={{ marginTop: '5rem' }}>
      <div className={S.container}>
        <h1>Cadastrar</h1>
        <p>
          <strong>Usuário</strong>
        </p>
        <form onSubmit={handleRegister} className={S.form}>
          <h3>Dados</h3>
          <section>
            <div>
              <label htmlFor="nome">
                Nome<span>*</span>
              </label>
              <Input
                name="nome"
                type="text"
                placeholder="Insira seu nome"
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
                placeholder="contato@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="cnpj">
                Senha<span>*</span>
              </label>
              <Input
                name="password"
                type="password"
                placeholder="*******"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="telefone">
                Telefone<span>*</span>
              </label>
              <Input
                name="telefone"
                type="text"
                placeholder="(99) 99999-9999"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                mask="phone"
              />
            </div>
            <div>
              <label htmlFor="cpf">
                CPF<span>*</span>
              </label>
              <Input
                name="cpf"
                type="text"
                placeholder="000.000.000-00"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                mask="cpf"
              />
            </div>
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
                  {item.nome}
                </StyledSelect>
              ))}
            </MultiSelect>
          </section>
          <h3>Endereço</h3>
          <section>
            <div>
              <label htmlFor="street">
                Rua<span>*</span>
              </label>
              <Input
                name="street"
                type="text"
                placeholder="Rua"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="cep">
                Cep<span>*</span>
              </label>
              <Input
                name="cep"
                type="text"
                placeholder="00000-000"
                value={cep}
                onChange={(e) => setCEP(e.target.value)}
                mask="zipCode"
              />
            </div>
            <MuiSelect
              label="Bairro"
              selectedNames={selectedBairro}
              setSelectedNames={setSelectedBairro}
            >
              {bairro?.map((item: { id: number; nome: string }) => (
                <StyledSelect
                  key={item.id}
                  value={item.id}
                  sx={{ justifyContent: 'space-between' }}
                >
                  {item.nome}
                </StyledSelect>
              ))}
            </MuiSelect>
            <div>
              <label htmlFor="number">
                Número<span>*</span>
              </label>
              <Input
                name="number"
                type="number"
                placeholder="Número"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
              />
            </div>
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
              Cadastrar
            </Button>
          </div>
        </form>
      </div>
      <Snackbar open={error.length > 0} autoHideDuration={6000}>
        <Alert variant="filled" severity="error">
          <AlertTitle>Erro!</AlertTitle>
          {error}
        </Alert>
      </Snackbar>

      {/* Mensagem de confirmação */}
      {confirmationMessage && (
        <Snackbar open={confirmationMessage.length > 0} autoHideDuration={6000}>
          <Alert variant="filled" severity="success">
            <AlertTitle>Sucesso!</AlertTitle>
            {confirmationMessage}
          </Alert>
        </Snackbar>
      )}
    </main>
  );
}
