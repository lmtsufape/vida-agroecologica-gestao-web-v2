import Link from 'next/link';
import React from 'react';

import S from './components/styles.module.scss';

import { LoginForm } from './components/loginForm';
import { Card, Container } from '@mui/material';
import Navbar from '@/components/Navbar';

export default function Home() {
  return (
    <main className={S.main}>
      <Container className={S.container}>
        <div className={S.leftContent}>
          <h1>Gestão</h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
            consequat velit non sodales dignissim.
          </p>
        </div>
        <div className={`${S.rightContent} ${S.loginFormContainer}`}>
          {' '}
          {/* Adicionando classes para estilo */}
          <div className={S.loginFormContent}>
            <h2 className={S.loginTitle}>Entrar</h2>
            <LoginForm />
            <p className={S.registerMessage}>
              Não possui conta? <Link href="/registrar">Faça o cadastro</Link>
            </p>
          </div>
        </div>
      </Container>
    </main>
  );
}
