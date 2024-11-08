/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Link from 'next/link';
import { redirect, useRouter } from 'next/navigation';
import React from 'react';
import { BiSolidEditAlt } from 'react-icons/bi';

import S from './styles.module.scss';

import { SeeAta } from './components/Ata';
import { SeeAnexos } from './components/Documentos';
import Button from '@/components/Button';
import Loader from '@/components/Loader';

import { getReuniao, removeAta } from '@/services';
import { useMutation, useQuery } from '@tanstack/react-query';



const Home = ({ params }: { params: { id: number } }) => {
  const [token, setToken] = React.useState('');

  React.useEffect(() => {
    const token = localStorage.getItem('@token');
    if (!token) {
      redirect('/');
    }
    setToken(token);
  }, []);

  const router = useRouter();

  const { data, isLoading, refetch, isError, error } = useQuery({
    queryKey: ['reuniao'],
    queryFn: () => {
      const token = localStorage.getItem('@token');
      if (token) {
        return getReuniao(token, params.id);
      }
      return null;
    },
  });

  const mutation = useMutation({
    mutationFn: ({ token, value }: { token: string; value: number }) => {
      return removeAta(token, value);
    },
    onSuccess: () => {
      refetch();
    },
  });

  if (isLoading) return <Loader />;
  if (isError) return `Error: ${error.message}`;

  return (
    <main className={S.main}>
      <div className={S.container}>
        <div className={S.back}>
          <Link href="/reunioes" className={S.link}>
            &lt; Voltar
          </Link>
        </div>
        <h1 className={S.title}>{data?.reuniao.titulo}</h1>
        <div className={S.content}>
          <br />
          <h2> Dados da Reuniâo</h2>
          <h3>Título</h3>
          <p>{data?.reuniao.titulo}</p>
          <h3>Status</h3>
          <p>{data?.reuniao.status}</p>
          <h3>Tipo</h3>
          <p>{data?.reuniao.tipo}</p>
          <h3>Data</h3>
          <p>{data?.reuniao.data}</p>
          <h2>ANEXOS</h2>
          <h3> Ata </h3>
          {data?.reuniao.ata?.length !== 0 && (
            <div className={S.wrapperAta}>
              <SeeAta reuniaoId={params.id} />
              <Button
                type="button"
                onClick={() =>
                  mutation.mutate({ token: token, value: params.id })
                }
                style={{ backgroundColor: '#f76c6c', color: '#ffffff' }}
              >
                Excluir Ata
              </Button>
            </div>
          )}
          <h3> Documentos </h3>
          <SeeAnexos reuniaoId={params.id} />
          <div className={S.editButton}>
            <Button
              onClick={() => router.push('/reunioes/editar/' + params.id)}
              type="button"
              dataType="edit"
            >
              Editar <BiSolidEditAlt />
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;
