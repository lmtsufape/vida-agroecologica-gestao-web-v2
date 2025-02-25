'use client';

import Link from 'next/link';
import { redirect, useRouter } from 'next/navigation';
import React from 'react';
import { BiSolidEditAlt } from 'react-icons/bi';

import S from './styles.module.scss';

import Button from '@/components/Button';
import Loader from '@/components/Loader';

import { getUser } from '@/services';
import { User } from '@/types/api';

type ReuniaoEditHomeProps = {
  id: string;
};

const UsuarioHome = ({ id }: ReuniaoEditHomeProps) => {
  const [content, setContent] = React.useState<User | null>(null);

  const formatType = (type: string) => {
    switch (type) {
      case 'administrador':
        return 'Administrador(a)';
      case 'presidente':
        return 'Presidente(a)';
      case 'secretario':
        return 'Secretário(a)';
      case 'agricultor':
        return 'Vendedor(a)';
      case 'consumidor':
        return 'Consumidor(a)';
      default:
        return type;
    }
  };

  const router = useRouter();

  React.useEffect(() => {
    const token = localStorage.getItem('@token');
    if (!token) {
      redirect('/');
    }
    getUser(token, id)
      .then((response) => setContent(response?.user))
      .catch((error) => console.log(error));
  }, [id]);

  if (!content) {
    return <Loader />;
  }

  return (
    <main className={S.main}>
      <div className={S.container}>
        <div className={S.back}>
          <Link href="/usuarios" className={S.link}>
            &lt; Voltar
          </Link>
        </div>
        <h1 className={S.title}>{content.name}</h1>
        <div className={S.content}>
          <h2> Dados do usuário</h2>
          {content?.roles?.map((role) =>
            typeof role === 'object' &&
            role !== null &&
            'id' in role &&
            'nome' in role ? (
              <h3 key={role.id} className={S.section}>
                {formatType(role.nome)}
              </h3>
            ) : null,
          )}
          <br />
          <h3>Nome</h3>
          <p>{content.name}</p>
          <h3>E-mail</h3>
          <p>{content.email}</p>
          <h3>CPF</h3>
          <p>{content.cpf}</p>
          <div className={S.editButton}>
            <Button
              onClick={() => router.push('/usuarios/editar/' + id)}
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
    </main>
  );
};

export default UsuarioHome;
