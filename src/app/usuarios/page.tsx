/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react';
import { BiSolidTrashAlt, BiSolidEditAlt } from 'react-icons/bi';
import { BsFillEyeFill, BsInfoCircle } from 'react-icons/bs';

import S from './styles.module.scss';

import Button from '@/components/Button';
import StyledLink from '@/components/Link';
import Loader from '@/components/Loader';
import TableView from '@/components/Table/Table';

import { getAllUsers, removeUser } from '@/services';
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
  const [token, setToken] = React.useState('');
  const handleClose = () => setValue(0);

  const { data, refetch, isLoading, isError, error } = useQuery({
    queryKey: ['users'],
    queryFn: () => {
      const token = localStorage.getItem('@token');
      if (token) {
        return getAllUsers(token);
      }
      return null;
    },
  });

  const columns: any = [
    {
      header: 'Nome',
      accessorKey: 'name',
    },
    {
      header: 'Função',
      accessorKey: 'roles',
      cell: (info: any) => {
        const value = info.getValue();
        return (
          <div className={S.wrapper}>
            {value?.map((v: any) => (
              <p className={S.roles} data-type={v.nome} key={v.id}>
                {formatType(v.nome)}
              </p>
            ))}
          </div>
        );
      },
    },
    {
      header: 'E-mail',
      accessorKey: 'email',
    },
    {
      header: () => (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          Ações
          <Tooltip title="Clique nos ícones para visualizar, editar ou remover">
            <IconButton
              size="small"
              style={{ marginLeft: '5px', color: 'white' }}
            >
              <BsInfoCircle />
            </IconButton>
          </Tooltip>
        </div>
      ),
      accessorKey: 'id',
      cell: (info: any) => {
        const value = info.getValue();
        return (
          <ul className={S.action} role="list">
            <li>
              <Link href={'usuarios/' + value}>
                <Tooltip title="Visualizar">
                  <IconButton aria-label="visualizar" size="small">
                    <BsFillEyeFill />
                  </IconButton>
                </Tooltip>
              </Link>
            </li>
            <li>
              <Link href={'usuarios/editar/' + value}>
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

  React.useEffect(() => {
    const token = localStorage.getItem('@token');
    if (!token) {
      redirect('/');
    }
    setToken(token);
  }, []);

  const mutation = useMutation({
    mutationFn: ({ token, value }: { token: string; value: number }) => {
      return removeUser(token, value);
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
          <div className={S.headerTitle}>
            <div className={S.back}>
              <Link href="/menu" className={S.link}>
                &lt; Voltar
              </Link>
            </div>
            <div>
              <h1 className={S.title}>Usuários</h1>
            </div>
            <div className={S.addButton}>
              <StyledLink
                href="usuarios/cadastrar"
                data-type="filled"
                text="Criar Usuario"
              />
            </div>
          </div>
        </div>
        <TableView columns={columns} data={data?.users} />
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
