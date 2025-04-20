'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { ChangeEvent, useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { MdManageAccounts } from 'react-icons/md';

import S from './styles.module.scss';

import Button from '@/components/Button';
import Input from '@/components/Input';
import StyledLink from '@/components/Link';

import { createUser } from '@/services/user';
import { fetchAddressFunction, ViaCepResponseData } from '@/utils/fetchAddress';
import { Alert, AlertTitle, Snackbar } from '@mui/material';
import { AxiosError } from 'axios';

const RegisterForm = () => {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [telefone, setTelefone] = React.useState('');
  const [cpf, setCpf] = React.useState('');

  const [street, setStreet] = React.useState('');
  const [cep, setCEP] = React.useState('');
  const [number, setNumber] = React.useState('');
  const [successMessage, setSuccessMessage] = React.useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [info, setInfo] = React.useState('');

  const selectedBairro = 1;

  const minLength = 8;

  const [error, setError] = React.useState('');

  const router = useRouter();

  React.useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage('');
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('@token');
      if (token) {
        router.push('/menu');
      }
    }
  }, [router]);

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
      fetchAddressFunction(cepValue.replace('-', ''))
        .then((response: ViaCepResponseData) => {
          setStreet(response.logradouro ?? '');
        })
        .catch((error) => {
          console.debug(error);
          if (
            error instanceof Error &&
            error?.message === 'CEP não encontrado.'
          ) {
            setInfo('CEP não encontrado.');
            resetCEPData();
          } else {
            setError('Erro ao buscar o CEP.');
            resetCEPData();
          }
        });
    }
  };

  const resetCEPData = () => {
    setStreet('');
    setCEP('');
  };

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
          roles: [5],
          rua: street,
          cep,
          numero: number,
          bairro_id: selectedBairro,
        },
        '',
      );
      setSuccessMessage('Cadastro realizado com sucesso!');
      setTimeout(() => {
        setSuccessMessage('');
        router.back();
      }, 1000);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(
          `[registerForm] Axios error: ${error?.response?.data?.message}`,
        );
        const errors = error?.response?.data?.errors;
        if (errors !== undefined && errors !== null) {
          for (const key of Object.keys(errors)) {
            const errorMessage = errors[key][0];
            setError(`${errorMessage}`);
          }
        } else {
          console.log(
            `[registerForm] Axios error: ${JSON.stringify(error?.message)}`,
          );
          setError(`Erro de requisição ao cadastrar`);
        }
      } else if (error instanceof Error) {
        console.log(
          `[registerForm] Erro genérico: ${JSON.stringify(
            error?.message,
          )} | ${typeof error}`,
        );
        setError(
          `Erro genérico ao cadastrar: ${JSON.stringify(error?.message)}`,
        );
      } else {
        console.log(
          `[registerForm] Erro desconhecido: ${JSON.stringify(
            error,
          )} | ${typeof error}`,
        );
        setError(`Erro desconhecido ao cadastrar: ${JSON.stringify(error)}`);
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
              top: password.length == 0 ? '65%' : '55%',
              transform: 'translateY(-50%)',
              cursor: 'pointer',
              color: '#666',
            }}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
          <small
            style={{
              color: password.length < minLength ? 'red' : 'green',
              display: password.length == 0 ? 'none' : 'flex',
            }}
          >
            {password.length < minLength
              ? `A senha deve ter pelo menos ${minLength} caracteres.`
              : 'Senha válida.'}
          </small>
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
            mask="phone"
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
        <div className={S.wrapperButtons}>
          <StyledLink href="/" data-type="transparent" text="Voltar" />
          <Button
            dataType="filled"
            type="submit"
            style={{ backgroundColor: '#f5821fe5', color: '#fff' }}
          >
            Cadastrar
          </Button>
        </div>
      </form>
      <Snackbar
        open={successMessage.length > 0}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage('')}
      >
        <Alert variant="filled" severity="success">
          <AlertTitle>Sucesso!</AlertTitle>
          {successMessage}
        </Alert>
      </Snackbar>
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
    </div>
  );
};

export default RegisterForm;
