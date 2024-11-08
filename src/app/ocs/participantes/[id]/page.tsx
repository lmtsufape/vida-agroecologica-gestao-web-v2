/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { BiSolidTrashAlt } from 'react-icons/bi';

import S from './styles.module.scss';

import Button from '@/components/Button';
import Loader from '@/components/Loader';
import TableView from '@/components/Table/Table';


import { getAllUsers } from '@/services';
import {
  getUsersByOCS,
  vincularAgricultorOrganizacao,
  desvincularAgricultor,
} from '@/services/ocs';
import {
  Alert,
  AlertTitle,
  Box,
  Modal,
  MenuItem,
  Select,
  Typography,
  Tooltip,
  IconButton,
  Snackbar,
} from '@mui/material';


interface Column {
  header: string;
  accessorKey: string;
  cell?: (info: any) => JSX.Element;
}

const modalStyle = {
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

export default function OCSParticipants({
  params,
}: {
  params: { id: string };
}) {
  const [participants, setParticipants] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [availableUsers, setAvailableUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('@token');
    if (!token) {
      window.location.href = '/';
    } else {
      getUsersByOCS(token, params.id)
        .then((response) => setParticipants(response.users))
        .catch(() => setErrorMessage('Erro ao buscar os participantes.'))
        .finally(() => setIsLoading(false));
      getAllUsers(token)
        .then((response) => {
          const allUsers = response.users;
          const onlyAgricultores = allUsers.filter(
            (user: any) =>
              user.roles?.some((role: any) => role.nome === 'agricultor'),
          );
          setAvailableUsers(onlyAgricultores);
        })
        .catch(() =>
          setErrorMessage('Erro ao buscar os usuários disponíveis.'),
        );
    }
  }, [params.id]);

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

  const columns: Column[] = [
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
      header: 'Ações',
      accessorKey: 'id',
      cell: (info: any) => {
        const value = info.getValue();
        const token = localStorage.getItem('@token');

        const handleDesvincular = () => {
          if (token) {
            desvincularAgricultor(token, value)
              .then(() => {
                getUsersByOCS(token, params.id).then((response) =>
                  setParticipants(response.users),
                );
                setSuccessMessage('Agricultor desvinculado com sucesso.');
              })
              .catch(() =>
                setErrorMessage(
                  'Erro ao desvincular o agricultor da organização.',
                ),
              );
          }
        };

        return (
          <Tooltip title="Desvincular">
            <IconButton
              onClick={handleDesvincular}
              aria-label="Deletar"
              size="small"
            >
              <BiSolidTrashAlt />
            </IconButton>
          </Tooltip>
        );
      },
    },
  ];

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const handleVincularAgricultor = () => {
    const token = localStorage.getItem('@token');
    if (!token) {
      window.location.href = '/';
    } else if (selectedUser) {
      vincularAgricultorOrganizacao(token, selectedUser, params.id)
        .then(() => {
          getUsersByOCS(token, params.id).then((response) =>
            setParticipants(response.users),
          );
          setSuccessMessage('Agricultor vinculado com sucesso.');
          handleCloseModal();
        })
        .catch((error) => {
          if (
            error.response &&
            error.response.data &&
            error.response.data.message
          ) {
            setErrorMessage(error.response.data.message);
          } else {
            setErrorMessage(
              'Erro desconhecido ao vincular o agricultor à organização.',
            );
          }
        });
    }
  };

  if (isLoading) return <Loader />;
  if (errorMessage) {
    return (
      <Snackbar open={true}>
        <Alert variant="filled" severity="error">
          <AlertTitle>Erro!</AlertTitle>
          {errorMessage}
        </Alert>
      </Snackbar>
    );
  }

  return (
    <div style={{ marginTop: '5rem' }}>
      <section className={S.dashboard}>
        <div className={S.header}>
          <div className={S.headerTitle}>
            <div className={S.back}>
              <Link href="/ocs" className={S.link}>
                &lt; Voltar
              </Link>
            </div>
            <div>
              <h1 className={S.title}> Participantes da Organização </h1>
            </div>
            <div className={S.addButton}>
              <Button
                onClick={handleOpenModal}
                type={'button'}
                dataType="filled"
              >
                Adicionar Participante
              </Button>
            </div>
          </div>
        </div>
        <TableView columns={columns} data={participants} />
      </section>
      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-title" variant="h6">
            Adicionar Participante
          </Typography>
          <Select
            labelId="select-user-label"
            id="select-user"
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value as string)}
            fullWidth
          >
            {availableUsers.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {user.name}
              </MenuItem>
            ))}
          </Select>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginTop: '1rem',
            }}
          >
            <Button
              onClick={handleVincularAgricultor}
              type="button"
              style={{
                marginTop: '1rem',
                backgroundColor: '005247;',
                color: 'white',
              }}
              dataType="filled"
            >
              Adicionar
            </Button>
          </div>
        </Box>
      </Modal>
      {successMessage && (
        <Snackbar
          open={!!successMessage}
          autoHideDuration={6000}
          onClose={() => setSuccessMessage('')}
        >
          <Alert severity="success">{successMessage}</Alert>
        </Snackbar>
      )}
    </div>
  );
}
