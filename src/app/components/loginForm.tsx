/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import Link from 'next/link';
import React from 'react';

import S from './styles.module.scss';

import Button from '@/components/Button';
import Input from '@/components/Input';

import { signIn } from '@/services/user';
import { Alert, AlertTitle, Snackbar } from '@mui/material';

export const LoginForm = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn(email, password);
    } catch (error: any) {
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
        <div>
          <label htmlFor="email">Senha</label>
          <Input
            placeholder="*********"
            name="password"
            type="password"
            value={password}
            onChange={(e: any) => setPassword(e.target.value)}
          />
        </div>
        <div className={S.links}>
          <div className={S.wrapper}>
            <input id="checkbox" type="checkbox" className={S.checkbox} />
            <label htmlFor="checkbox">Lembrar de mim</label>
          </div>
          <Link href="/">Esqueceu a senha?</Link>
        </div>
        <Button dataType="filled" type="submit">
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
