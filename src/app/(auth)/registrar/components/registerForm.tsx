/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import { MdManageAccounts } from 'react-icons/md';

import S from './styles.module.scss';

import Button from '@/components/Button';
import Input from '@/components/Input';
import StyledLink from '@/components/Link';

import { createUser } from '@/services/user';
import { Alert, AlertTitle, Snackbar } from '@mui/material';

const RegisterForm = () => {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [telefone, setTelefone] = React.useState('');
  const [cpf, setCpf] = React.useState('');

  const [street, setStreet] = React.useState('');
  const [cep, setCEP] = React.useState('');
  const [number, setNumber] = React.useState('');

  const selectedBairro = 1;

  const [error, setError] = React.useState('');

  const router = useRouter();

  React.useEffect(() => {
    const token = localStorage.getItem('@token');
    if (token) {
      router.push('/menu');
    }
  }, [router]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUser(
        {
          name,
          email,
          password,
          apelido: null,
          telefone,
          cpf,
          roles: [4],
          rua: street,
          cep,
          numero: number,
          bairro_id: selectedBairro,
        },
        '',
      );
      router.back();
    } catch (error: any) {
      console.log(error.response?.data?.message);
      const errors = error.response?.data?.errors;
      if (errors !== undefined && errors !== null) {
        for (const key of Object.keys(errors)) {
          const errorMessage = errors[key][0];
          setError(`${errorMessage}`);
        }
      }
    }
  };

  return (
    <div className={S.registerForm}>
      <h1>
        <MdManageAccounts />
        Cadastrar
      </h1>
      <p className={S.loginMessage}>
        Já está registrado? <Link href="/">Faça o login</Link>
      </p>
      <form onSubmit={handleRegister}>
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
          <label htmlFor="password">
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
            placeholder="00000-0000"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
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
        <h3>Endereço</h3>
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
        <div className={S.wrapperButtons}>
          <StyledLink href="/" data-type="transparent" text="Voltar" />
          <Button dataType="filled" type="submit">
            Cadastrar
          </Button>
        </div>
      </form>
      <Snackbar open={error.length > 0} autoHideDuration={6000}>
        <Alert variant="filled" severity="error">
          <AlertTitle>Erro!</AlertTitle>
          {error}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default RegisterForm;
