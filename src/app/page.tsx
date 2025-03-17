import Link from 'next/link';
import React from 'react';

import S from './components/styles.module.scss';

import { LoginForm } from './components/loginForm';

import { Container } from '@mui/material';

export default function Home() {
  return (
    <main className={S.main}>
      <Container className={S.container}>
        <div className={S.leftContent}>
          <h1>Gestão</h1>
          <p>
            O Vida Agroecológica Gestão tem como finalidade auxiliar os
            agricultores na administração de associações e Organizações de
            Controle Social (OCS), facilitando a organização de reuniões,
            elaboração de atas e o armazenamento de informações adicionais de
            cada encontro, como fotos e documentos extras.
          </p>
        </div>
        <div className={`${S.rightContent} ${S.loginFormContainer}`}>
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
