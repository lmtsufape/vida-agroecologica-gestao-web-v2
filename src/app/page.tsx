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
            O sistema Gestão foi desenvolvido pela Universidade Federal do
            Agreste de Pernambuco (UFAPE) em resposta à demanda da Associação
            Vida Agroecológica de Bonito-PE para uma gestão sustentável no setor
            agrícola. Projetada para facilitar a integração e o controle de
            processos, a plataforma otimiza o gerenciamento das atividades em
            associações e organizações sociais e o registro dos agricultores nas
            demais plataformas da associação, apoiando eficazmente os
            agricultores na gestão de suas operações.
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
