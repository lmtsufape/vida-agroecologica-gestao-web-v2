'use client';

import Link from 'next/link';
import React from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

import S from './styles.module.scss';

import Button from '@/components/Button';
import Input from '@/components/Input';

import { signIn } from '@/services/user';
import { Alert, AlertTitle, Snackbar } from '@mui/material';
import { AxiosError } from 'axios';

export const LoginForm = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn(email, password);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(`[loginForm] AxiosError: ${JSON.stringify(error)} | ${typeof error}`);
        const errors = error?.response?.data?.errors;
        if (errors !== undefined && errors !== null) {
          for (const key of Object.keys(errors)) {
            const errorMessage = errors[key][0];
            setError(`${errorMessage}`);
          }
        } else {
          console.error(
            `[loginForm] Erro na request: ${JSON.stringify(
              error,
            )} | ${typeof error}`,
          );
          setError('Ocorreu um erro na requisição.');
        }
      } else if (error instanceof Error) {
        console.error(
          `[loginForm] Erro generico: ${JSON.stringify(
            error,
          )} | ${typeof error}`,
        );
        setError(`Erro generico: ${JSON.stringify(error?.message)}`);
      } else {
        console.error(
          `[loginForm] Erro desconhecido: ${JSON.stringify(
            error,
          )} | ${typeof error}`,
        );
        setError('Ocorreu um erro desconhecido, tente novamente mais tarde.');
      }
    }
  };

  return (
    <>
      <form className={S.loginForm} onSubmit={handleLogin}>
        <div>
          <label htmlFor="email">E-mail</label>
          <Input
            placeholder="contato@email.com"
            name="email"
            type="email"
            value={email}
            onChange={(
              e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
            ) => setEmail((e.target as HTMLInputElement).value)}
          />
        </div>
        <div style={{ position: 'relative' }}>
          <label htmlFor="password">Senha</label>
          <Input
            placeholder="*********"
            name="password"
            type={showPassword ? 'text' : 'password'}
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
        <div className={S.links}>
          <Link href="/recuperar-senha">Esqueceu a senha?</Link>
        </div>
        <Button
          dataType="filled"
          type="submit"
          style={{ backgroundColor: '#f5821fe5', color: '#fff' }}
        >
          Entrar
        </Button>
      </form>
      <Snackbar open={error.length > 0} autoHideDuration={6000}>
        <Alert variant="filled" severity="error">
          <AlertTitle>Erro!</AlertTitle>
          {error}
        </Alert>
      </Snackbar>
    </>
  );
};
