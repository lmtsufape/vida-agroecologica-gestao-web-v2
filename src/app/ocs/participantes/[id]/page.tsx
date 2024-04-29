/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { BiSolidTrashAlt, BiSolidEditAlt } from 'react-icons/bi';
import { BsFillEyeFill } from 'react-icons/bs';
import { Box, IconButton, Tooltip, Modal, Typography } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import Loader from '@/components/Loader';
import TableView from '@/components/Table/Table';
import { removeUser, getUsersByOCS } from '@/services';
import S from './styles.module.scss';
import Button from '@/components/Button';
import StyledLink from '@/components/Link';

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

const Home = ({ params }: { params: { id: string } }) => {
  const [token, setToken] = useState('');
  const [value, setValue] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const handleClose = () => setValue(0);

  const { data, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const token = localStorage.getItem('@token');
      if (token && params.id) {
        try {
          const response = await getUsersByOCS(token, params.id);
          setIsLoading(false);
          return response.users;
        } catch (error) {
          setIsError(true);
          setErrorMessage('Failed to fetch users');
          setIsLoading(false);
          return [];
        }
      }
      return [];
    },
  });

  const mutation = useMutation({
    mutationFn: async ({ token, value }: { token: string; value: number }) => {
      try {
        await removeUser(token, value);
        refetch();
        handleClose();
      } catch (error) {
        setIsError(true);
        setErrorMessage('Error while removing user');
      }
    },
  });

  useEffect(() => {
    const token = localStorage.getItem('@token');
    if (!token) {
      redirect('/');
    }
    setToken(token);
  }, []);

  const columns = [
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
                {v.nome}
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
      header: 'Ações',
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

  if (isLoading) return <Loader />;
  if (isError) return <p>Error: {errorMessage}</p>;

  if (!data || data.length === 0)
    return <p>Não existem usuários nessa organização de controle social.</p>;

  return (
    <div style={{ marginTop: '5rem' }}>
      <section className={S.dashboard}>
        <div className={S.header}>
          <h1>Agricultores da Organização</h1>
          <StyledLink
            href="usuarios/cadastrar"
            data-type="filled"
            text="+ Adicionar Agricultor"
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
};

export default Home;
