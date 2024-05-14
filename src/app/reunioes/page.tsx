/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Link from 'next/link';
import { redirect } from 'next/navigation';
import React, { useState } from 'react';
import {
  BiSolidTrashAlt,
  BiSolidEditAlt,
  BiSolidFileImport,
} from 'react-icons/bi';
import { BsFillEyeFill, BsInfoCircle } from 'react-icons/bs';
import { MdAttachFile } from 'react-icons/md';

import S from './styles.module.scss';

import Button from '@/components/Button';
import StyledLink from '@/components/Link';
import Loader from '@/components/Loader';
import TableView from '@/components/Table/Table';

import { getAllReunioes, removeReuniao } from '@/services';
import { Box, IconButton, Tooltip, Modal, Typography } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AtaForm } from '@/components/Ata';
import { AnexosForm } from '@/components/Anexos';
import { Icons } from '@/assets';

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
  const [modalId, setModalId] = useState<number | null>(null);
  const [modalType, setModalType] = useState<string>('');
  const [value, setValue] = React.useState(0);
  const [token, setToken] = React.useState('');
  const handleClose = () => setValue(0);

  React.useEffect(() => {
    const token = localStorage.getItem('@token');
    if (!token) {
      redirect('/');
    }
    setToken(token);
  }, []);

  const handleOpenModal = (id: number, type: string) => {
    setModalId(id);
    setModalType(type);
  };

  const handleCloseModal = () => {
    setModalId(null);
    setModalType('');
  };

  const columns: any = [
    {
      header: 'Título',
      accessorKey: 'titulo',
    },
    {
      header: 'Status',
      accessorKey: 'status',
    },
    {
      header: 'Tipo',
      accessorKey: 'tipo',
      cell: (info: any) => {
        const value = info.getValue();
        const formattedType = formatType(value);
        return <span>{formattedType}</span>;
      },
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
              <Tooltip title="Adicionar Ata">
                <IconButton
                  onClick={() => handleOpenModal(value, 'ata')}
                  aria-label="Adicionar ata"
                  size="small"
                >
                  <MdAttachFile />
                </IconButton>
              </Tooltip>
            </li>
            <li>
              <Tooltip title="Adicionar Anexos">
                <IconButton
                  onClick={() => handleOpenModal(value, 'anexos')}
                  aria-label="Adicionar anexos"
                  size="small"
                >
                  <BiSolidFileImport />
                </IconButton>
              </Tooltip>
            </li>
            <li>
              <Link href={'reunioes/' + value}>
                <Tooltip title="Visualizar">
                  <IconButton aria-label="visualizar" size="small">
                    <BsFillEyeFill />
                  </IconButton>
                </Tooltip>
              </Link>
            </li>
            <li>
              <Link href={'reunioes/editar/' + value}>
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
      case 'ordinaria':
        return 'Ordinária';
      case 'extraordinaria':
        return 'Extraordinária';
      case 'multirao':
        return 'Mutirão';
      default:
        return type;
    }
  };

  const { data, isLoading, refetch, isError, error } = useQuery({
    queryKey: ['reunioes'],
    queryFn: () => {
      const token = localStorage.getItem('@token');
      if (token) {
        return getAllReunioes(token);
      }
      return null;
    },
  });

  const mutation = useMutation({
    mutationFn: ({ token, value }: { token: string; value: number }) => {
      return removeReuniao(token, value);
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
              <h1 className={S.title}>Associações</h1>
            </div>
            <div className={S.addButton}>
              <StyledLink
                href="reunioes/cadastrar"
                data-type="filled"
                text="Criar Reunião"
              />
            </div>
          </div>
        </div>
        <TableView columns={columns} data={data?.reunioes} />
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
        <div style={{ marginTop: '5rem' }}>
          <Modal
            open={modalType === 'ata' && modalId !== null}
            onClose={handleCloseModal}
          >
            <Box sx={style}>
              {modalId !== null && <AtaForm reuniaoId={modalId} />}
            </Box>
          </Modal>
          <Modal
            open={modalType === 'anexos' && modalId !== null}
            onClose={handleCloseModal}
          >
            <Box sx={style}>
              {modalId !== null && <AnexosForm reuniaoId={modalId} />}
            </Box>
          </Modal>
        </div>
      </div>
    </div>
  );
}
