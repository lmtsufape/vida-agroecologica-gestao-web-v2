'use client';

import Loader from '@/components/Loader';
import { getAssociacao } from '@/services';
import { redirect, useRouter } from 'next/navigation';
import { Associacao } from '@/types/api';
import { BiSolidEditAlt } from 'react-icons/bi';

import S from './styles.module.scss';

import React from 'react';
import Button from '@/components/Button';

const Home = ({ params }: { params: { id: string } }) => {
  const [content, setContent] = React.useState<Associacao | null>(null);

  const router = useRouter();

  React.useEffect(() => {
    const token = localStorage.getItem('@token');
    if (!token) {
      redirect('/login');
    }
    getAssociacao(token, params.id)
      .then((response: any) => setContent(response.associacao))
      .catch((error: any) => console.log(error));
  }, []);

  if (!content) {
    return <Loader />;
  }

  return (
    <main className={S.main}>
      <div className={S.container}>
        <div className={S.header}>
          <h1>{content.nome}</h1>
          <Button
            onClick={() => router.push('/associacoes/editar/' + params.id)}
            type="button"
            dataType="edit"
          >
            Editar <BiSolidEditAlt />
          </Button>
        </div>
        <div className={S.content}>
          <h3>Código</h3>
          <p>{content.codigo}</p>
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
                <hr />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;
