'use client';

import Loader from '@/components/Loader';
import { getOCS } from '@/services';
import { redirect, useRouter } from 'next/navigation';
import { OCS } from '@/types/api';
import { BiSolidEditAlt } from 'react-icons/bi';

import S from './styles.module.scss';

import React from 'react';
import Button from '@/components/Button';
import Link from 'next/link';

const Home = ({ params }: { params: { id: string } }) => {
  const [content, setContent] = React.useState<OCS | null>(null);

  console.log(content);

  const router = useRouter();

  React.useEffect(() => {
    const token = localStorage.getItem('@token');
    if (!token) {
      redirect('/login');
    }
    getOCS(token, params.id)
      .then((response: any) => setContent(response.ocs))
      .catch((error: any) => console.log(error));
  }, []);

  if (!content) {
    return <Loader />;
  }

  console.log(content);

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
          <h3>Data Fundação</h3>
          <p>{content.data_fundacao}</p>
          <h3 className={S.section}>Associação</h3>
          <Link href={'/associacoes/' + content.associacao_id}>
            {content?.associacao?.nome}
          </Link>
          <h3 className={S.section}>Endereço</h3>
          <h3>Rua</h3>
          <p>{content?.endereco?.rua}</p>
          <h3>CEP</h3>
          <p>{content?.endereco?.cep}</p>
          <h3>Número</h3>
          <p>{content?.endereco?.numero}</p>
          {/* <h3>Complemento</h3>
                    <p>{content.endereco.complemento}</p> */}
          <h3>Bairro</h3>
          <p>{content?.endereco?.bairro?.nome}</p>
        </div>
      </div>
    </main>
  );
};

export default Home;
