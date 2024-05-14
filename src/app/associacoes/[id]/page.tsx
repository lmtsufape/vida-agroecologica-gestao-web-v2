/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { redirect, useRouter } from 'next/navigation';
import React from 'react';
import { BiSolidEditAlt } from 'react-icons/bi';

import S from './styles.module.scss';

import Button from '@/components/Button';
import Loader from '@/components/Loader';

import { getAssociacao } from '@/services';
import { Associacao } from '@/types/api';
import Link from 'next/link';

const Home = ({ params }: { params: { id: string } }) => {
  const [content, setContent] = React.useState<Associacao | null>(null);

  const router = useRouter();

  React.useEffect(() => {
    const token = localStorage.getItem('@token');
    if (!token) {
      redirect('/');
    }
    getAssociacao(token, params.id)
      .then((response: any) => setContent(response.associacao))
      .catch((error: any) => console.log(error));
  }, [params.id]);

  if (!content) {
    return <Loader />;
  }

  return (
    <main className={S.main}>
      <div className={S.container}>
        <div className={S.back}>
          <Link href="/associacoes" className={S.link}>
            &lt; Voltar
          </Link>
        </div>
        <h1 className={S.title}>{content.nome}</h1>
        <div className={S.content}>
          <h2> Dados da Associação</h2>
          <h3>E-mail</h3>
          <p>{content?.contato?.email}</p>
          <h3>Telefone</h3>
          <p>{content?.contato?.telefone}</p>
          <h3 className={S.presidentes}>Presidentes</h3>
          <div>
            {content?.presidentes?.map((item) => (
              <div key={item.id}>
                <h3>Nome</h3>
                <p>{item.name}</p>
                <h3>E-mail</h3>
                <p>{item.email}</p>
                <h3>CPF</h3>
                <p>{item.cpf}</p>
              </div>
            ))}
            <div className={S.editButton}>
              <Button
                onClick={() => router.push('/associacoes/editar/' + params.id)}
                type="button"
                dataType="edit"
              >
                {' '}
                Editar
                <BiSolidEditAlt />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;
