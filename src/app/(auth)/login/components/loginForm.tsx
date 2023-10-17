'use client';
import React from 'react';
import S from './styles.module.scss';
import { signIn } from '@/services/user';
import Input from '@/components/Input';
import Button from '@/components/Button';
import Link from 'next/link';

export const LoginForm = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn(email, password);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form className={S.loginForm} onSubmit={handleLogin}>
      <div>
        <label htmlFor="email">E-mail</label>
        <Input
          placeholder="contato@email.com"
          name="email"
          type="email"
          value={email}
          onChange={(e: any) => setEmail(e.target.value)}
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
  );
};
