/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react';
import { BiSolidTrashAlt, BiSolidEditAlt } from 'react-icons/bi';
import { BsFillEyeFill } from 'react-icons/bs';

import S from './styles.module.scss';

import Button from '@/components/Button';
import StyledLink from '@/components/Link';
import Loader from '@/components/Loader';
import TableView from '@/components/Table/Table';

import { getAllAssociacoes, removeAssociacao } from '@/services/associations';
import { formatDate } from '@/utils/convertNumbers';
import { Box, IconButton, Tooltip, Modal, Typography } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: '#fff',
  boxShadow: 24,
  border: 'none',
  borderRadius: 4,
  p: 4,
};

export default function Home() {
  const [value, setValue] = React.useState(0);
  const handleClose = () => setValue(0);

  const [token, setToken] = React.useState('');

  React.useEffect(() => {
    const token = localStorage.getItem('@token');
    const rolesString = localStorage.getItem('@roles');
    const roles = rolesString ? JSON.parse(rolesString) : '';
    const filter = roles.map((item: { id: number }) => item.id);
    if (!token) {
      redirect('/');
    }
    if (filter.includes(5) || filter.includes(4)) {
      redirect('/default');
    }
    setToken(token);
  }, []);

  const mutation = useMutation({
    mutationFn: ({ token, value }: { token: string; value: number }) => {
      return removeAssociacao(token, value);
    },
    onSuccess: () => {
      refetch();
      handleClose();
    },
  });

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['associacoes'],
    queryFn: () => {
      const token = localStorage.getItem('@token');
      if (token) {
        return getAllAssociacoes(token);
      }
      return null;
    },
  });

  if (isLoading) return <Loader />;
  if (isError) return `Error: ${error.message}`;

  const columns: any = [
    {
      header: 'Nome',
      accessorKey: 'nome',
    },
    {
      header: 'Data de Fundação',
      accessorKey: 'data_fundacao',
      cell: (info: any) => {
        const value = info.getValue();
        return <p>{formatDate(value)}</p>;
      },
    },
    {
      header: 'Presidente',
      accessorKey: 'presidentes',
      cell: (info: any) => {
        const value = info.getValue();
        return (
          <>
            {value.map((v: any) => (
              <p key={v.id}>{v.name}</p>
            ))}
          </>
        );
      },
    },
    {
      header: 'Ações',
      accessorKey: 'id',
      cell: (info: any) => {
        const value = info.getValue();
        return (
          <ul className={S.action} role="list">
            <li>
              <Link href={'associacoes/' + value}>
                <Tooltip title="Visualizar">
                  <IconButton aria-label="visualizar" size="small">
                    <BsFillEyeFill />
                  </IconButton>
                </Tooltip>
              </Link>
            </li>
            <li>
              <Link href={'associacoes/editar/' + value}>
                <Tooltip title="Editar">
                  <IconButton aria-label="editar" size="small">
                    <BiSolidEditAlt />
                  </IconButton>
                </Tooltip>
              </Link>
            </li>
            <li>
              <Tooltip title="Remover">
                <IconButton
                  onClick={() => setValue(value)}
                  aria-label="Deletar"
                  size="small"
                >
                  <BiSolidTrashAlt />
                </IconButton>
              </Tooltip>
            </li>
          </ul>
        );
      },
    },
  ];

  return (
    <div style={{ marginTop: '5rem' }}>
      <section className={S.dashboard}>
        <div className={S.header}>
          <h1>Associações</h1>
          <StyledLink
            href="associacoes/cadastrar"
            data-type="filled"
            text="+ Adicionar Nova Associação"
          />
        </div>
        <TableView columns={columns} data={data} />
      </section>
      <div>
        <Modal
          open={value > 0}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Tem certeza que deseja excluir?
            </Typography>
            <div className={S.buttons}>
              <Button
                type="button"
                dataType="transparent"
                onClick={handleClose}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={() => mutation.mutate({ token: token, value: value })}
                style={{ backgroundColor: '#f76c6c', color: '#ffffff' }}
              >
                Excluir
              </Button>
            </div>
          </Box>
        </Modal>
      </div>
    </div>
  );
}
