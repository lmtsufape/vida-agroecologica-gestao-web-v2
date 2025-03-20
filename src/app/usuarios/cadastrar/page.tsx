'use client';

import { redirect, useRouter } from 'next/navigation';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

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
  const [error, setError] = useState('');
  /* WARN SnackBar */
  // const [warn, setWarn] = useState('');
  const [info, setInfo] = useState('');
  const [confirmationMessage, setConfirmationMessage] = useState('');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [street, setStreet] = useState('');
  const [cep, setCEP] = useState('');
  const [number, setNumber] = useState('');
  const [complement, setComplement] = useState('');

  const [bairro, setBairro] = useState<Bairro[]>([]);
  const [selectedBairro, setSelectedBairro] = useState(1);

  const [selectedRole, setSelectedRole] = useState<string | string[]>([]);

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('@token');
    if (!token) {
      redirect('/');
    }
    getAllBairros(token)
      .then((response) => setBairro(response))
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

  const fetchAddress = async (cep: string) => {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      if (!data.erro) {
        setStreet(data.logradouro || '');
        setComplement(data.complemento || '');
        // Se tiver outros campos como bairro, cidade, estado, adicionar aqui
      } else {
        setInfo('CEP não encontrado.');
      }
    } catch (error) {
      console.log(error);
      setError('Erro ao buscar o CEP.');
    }
  };

  const handleCEPChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const target = e.target as HTMLInputElement;
    let cepValue = target.value.replace(/\D/g, '');

    if (cepValue.length > 5) {
      cepValue = cepValue.slice(0, 5) + '-' + cepValue.slice(5, 8);
    }

    setCEP(cepValue);
    if (cepValue.replace('-', '').length === 8) {
      fetchAddress(cepValue.replace('-', ''));
    }
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
          cpf: cpf,
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
      setConfirmationMessage('Usuário cadastrado com sucesso!');
      setTimeout(() => {
        setConfirmationMessage('');
        router.back();
      }, 1000);
    } catch (error: unknown) {
      if (error instanceof Error && 'response' in error) {
        const responseError = (
          error as {
            response?: { data?: { errors?: Record<string, string[]> } };
          }
        ).response;
        const errors = responseError?.data?.errors;

        if (errors) {
          for (const key of Object.keys(errors)) {
            const errorMessage = errors[key][0];
            setTimeout(() => {
              setError(`${errorMessage}`);
            }, 4000);
          }
        }
      } else {
        setError('Unexpected error');
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
                onChange={(e) => setEmail(e.target.value.toLowerCase())}
              />
            </div>
            <div style={{ position: 'relative' }}>
              <label htmlFor="password">
                Senha<span>*</span>
              </label>
              <Input
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="*******"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '0.5rem',
                  top: '65%',
                  transform: 'translateY(-50%)',
                  cursor: 'pointer',
                  color: '#666',
                }}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
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
                  {item.nome === 'agricultor' ? 'vendedor' : item.nome}
                </StyledSelect>
              ))}
            </MultiSelect>
          </section>
          <h3>Endereço</h3>
          <section>
            <div>
              <label htmlFor="cep">
                Cep<span>*</span>
              </label>
              <Input
                name="cep"
                type="text"
                placeholder="00000-000"
                value={cep}
                onChange={handleCEPChange}
                mask="zipCode"
              />
            </div>
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
            <div>
              <label htmlFor="complement">Complemento</label>
              <Input
                name="complement"
                type="text"
                placeholder="Complemento"
                value={complement}
                onChange={(e) => setComplement(e.target.value)}
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
}
