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

import { getAllOCS, removeOCS } from '@/services';

import { Box, IconButton, Tooltip, Modal, Typography } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Snackbar, Alert, AlertTitle } from '@mui/material';

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
  const [token, setToken] = React.useState('');
  const handleClose = () => setValue(0);
  const [errorMessage, setErrorMessage] = React.useState('');

  React.useEffect(() => {
    const token = localStorage.getItem('@token');
    if (!token) {
      redirect('/');
    }
    setToken(token);
  }, []);

  interface Column {
    header: string;
    accessorKey: string;
    cell?: (info: any) => JSX.Element;
  }

  const columns: Column[] = [
    {
      header: 'Nome',
      accessorKey: 'nome',
    },
    {
      header: 'CNPJ',
      accessorKey: 'cnpj',
      cell: (info: any) => {
        const value = info.getValue();
        return <p>{value}</p>;
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
              <Link href={'ocs/' + value}>
                <Tooltip title="Visualizar">
                  <IconButton aria-label="visualizar" size="small">
                    <BsFillEyeFill />
                  </IconButton>
                </Tooltip>
              </Link>
            </li>
            <li>
              <Link href={'ocs/editar/' + value}>
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

  const { data, isLoading, refetch, isError, error } = useQuery({
    queryKey: ['ocs'],
    queryFn: () => {
      const token = localStorage.getItem('@token');
      if (token) {
        return getAllOCS(token);
      }
      return null;
    },
  });

  const mutation = useMutation({
    mutationFn: ({ token, value }: { token: string; value: number }) => {
      return removeOCS(token, value);
    },
    onError: (error) => {
      if ((error as any).response.status === 500) {
        setTimeout(() => {
          setErrorMessage(
            'Existem reuniões marcadas para esta OCS. Não é possível excluí-la.',
          );
          window.location.reload();
        }, 3000);
      } else {
        setTimeout(() => {
          setErrorMessage('Erro ao excluir a OCS.');
          window.location.reload();
        }, 3000);
      }
    },
    onSuccess: () => {
      refetch();
      handleClose();
    },
  });

  if (isLoading) return <Loader />;
  if (isError) return `Error: ${error.message}`;

  return (
    <div style={{ marginTop: '5rem' }}>
      <section className={S.dashboard}>
        <div className={S.header}>
          <h1>Organização de Controle Social</h1>
          <StyledLink
            href="ocs/cadastrar"
            data-type="filled"
            text="+ Adicionar Nova OCS"
          />
        </div>
        <TableView columns={columns} data={data?.ocs} />
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
        <Snackbar open={errorMessage.length > 0}>
          <Alert variant="filled" severity="error">
            <AlertTitle>Erro!</AlertTitle>
            {errorMessage}
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
}
