'use client';

import Link from 'next/link';
import { redirect, useRouter } from 'next/navigation';
import React from 'react';
import { BiSolidEditAlt } from 'react-icons/bi';

import S from './styles.module.scss';

import Button from '@/components/Button';
import Loader from '@/components/Loader';

import { getOCS } from '@/services';
import { OCS } from '@/types/api';

interface OCSResponse {
  ocs: OCS;
}

const Home = ({ params }: { params: { id: string } }) => {
  const [content, setContent] = React.useState<OCS | null>(null);

  const router = useRouter();

  React.useEffect(() => {
    const token = localStorage.getItem('@token');
    if (!token) {
      redirect('/');
    }
    getOCS(token, params.id)
      .then((response: OCSResponse) => setContent(response.ocs))
      .catch((error: unknown) => console.log(error));
  }, [params.id]);

  if (!content) {
    return <Loader />;
  }

  return (
    <main className={S.main}>
      <div className={S.container}>
        <div className={S.header}>
          <h1>{content.nome}</h1>
          <Button
            onClick={() => router.push('/ocs/editar/' + params.id)}
            type="button"
            dataType="edit"
          >
            Editar <BiSolidEditAlt />
          </Button>
        </div>
        <div className={S.content}>
          <h3>CNPJ</h3>
          <p>{content.cnpj}</p>
          <h3 className={S.section}>Associação</h3>
          <Link href={'/associacoes/' + content.associacao_id}>
            {content?.associacao?.nome}
          </Link>
          <br />
          <br />
          <h3 className={S.section}>Endereço</h3>
          <h3>Rua</h3>
          <p>{content?.endereco?.rua}</p>
          <h3>CEP</h3>
          <p>{content?.endereco?.cep}</p>
          <h3>Número</h3>
          <p>{content?.endereco?.numero}</p>
          <h3>Bairro</h3>
          <p>{content?.endereco?.bairro?.nome}</p>
        </div>
      </div>
    </main>
  );
};

export default Home;
