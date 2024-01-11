import Link from 'next/link';
import React from 'react';

import S from './components/styles.module.scss';

import { LoginForm } from './components/loginForm';

export default function Home() {
  return (
    <main className={S.main}>
      <h1>Entrar</h1>
      <p className={S.registerMessage}>
        Não possui conta? <Link href="/registrar">Faça o cadastro</Link>
      </p>
      <LoginForm />
    </main>
  );
}
