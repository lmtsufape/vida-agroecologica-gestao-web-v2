/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Link from 'next/link';
import { redirect } from 'next/navigation';
import React, { useState } from 'react';
import { Menu, MenuItem } from '@mui/material';
import { IoMenu } from 'react-icons/io5';
import {
  BiSolidTrashAlt,
  BiSolidEditAlt,
  BiSolidFileImport,
} from 'react-icons/bi';
import { BsFillEyeFill, BsInfoCircle } from 'react-icons/bs';
import { MdAttachFile } from 'react-icons/md';

import S from './styles.module.scss';

import { AnexosForm } from '@/components/Anexos';
import { AtaForm } from '@/components/Ata';
import Button from '@/components/Button';
import StyledLink from '@/components/Link';
import Loader from '@/components/Loader';
import TableView from '@/components/Table/Table';

import { getAllReunioes, removeReuniao } from '@/services';
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
  const [modalId, setModalId] = useState<number | null>(null);
  const [modalType, setModalType] = useState<string>('');
  const [value, setValue] = React.useState(0);
  const [token, setToken] = React.useState('');
  const handleClose = () => setValue(0);
  const [infoModalOpen, setInfoModalOpen] = React.useState(false);
  const [textResponsive, setTextResponsive] = React.useState('Criar Reunião');

  React.useEffect(() => {
    const token = localStorage.getItem('@token');
    if (!token) {
      redirect('/');
    }
    setToken(token);
  }, []);

  React.useEffect(() => {
    const updateText = () => {
      setTextResponsive(window.innerWidth < 825 ? 'Criar' : 'Criar Reunião');
    };
    window.addEventListener('resize', updateText);
    updateText();
    return () => window.removeEventListener('resize', updateText);
  });

  const handleOpenModal = (id: number, type: string) => {
    setModalId(id);
    setModalType(type);
  };

  const handleCloseModal = () => {
    setModalId(null);
    setModalType('');
  };

  const handleOpenInfoModal = () => setInfoModalOpen(true);
  const handleCloseInfoModal = () => setInfoModalOpen(false);

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
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          Ações
          <Tooltip title="Clique nos ícones para visualizar, editar ou remover">
            <IconButton
              size="small"
              style={{ marginLeft: '5px', color: 'white' }}
              onClick={handleOpenInfoModal}
            >
              <BsInfoCircle />
            </IconButton>
          </Tooltip>
        </div>
      ),
      accessorKey: 'id',
      cell: (info: any) => {
        const value = info.getValue();
        const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(
          null,
        );
        const open = Boolean(anchorEl);

        const handleClickAction = (
          event: React.MouseEvent<HTMLButtonElement>,
        ) => {
          setAnchorEl(event.currentTarget);
        };

        const handleCloseAction = () => {
          setAnchorEl(null);
        };
        return (
          <div className={S.action}>
            {window.innerWidth > 768 ? (
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
            ) : (
              <>
                <IconButton
                  aria-label="mais ações"
                  size="small"
                  onClick={handleClickAction}
                >
                  <IoMenu />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleCloseAction}
                >
                  <MenuItem
                    onClick={() => {
                      handleCloseAction();
                      handleOpenModal(value, 'ata');
                    }}
                  >
                    <MdAttachFile style={{ marginRight: 8 }} /> Adicionar Ata
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleCloseAction();
                      handleOpenModal(value, 'anexos');
                    }}
                  >
                    <BiSolidFileImport style={{ marginRight: 8 }} /> Adicionar
                    Anexo
                  </MenuItem>
                  <MenuItem onClick={handleCloseAction}>
                    <Link
                      href={'reunioes/' + value}
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      <BsFillEyeFill style={{ marginRight: 8 }} /> Visualizar
                    </Link>
                  </MenuItem>
                  <MenuItem onClick={handleCloseAction}>
                    <Link
                      href={'reunioes/editar/' + value}
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      <BiSolidEditAlt style={{ marginRight: 8 }} /> Editar
                    </Link>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleCloseAction();
                      setValue(value);
                    }}
                  >
                    <BiSolidTrashAlt style={{ marginRight: 8, color: 'red' }} />{' '}
                    Remover
                  </MenuItem>
                </Menu>
              </>
            )}
          </div>
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
              <h1 className={S.title}>Reuniões</h1>
            </div>
            <div className={S.addButton}>
              <StyledLink
                href="reunioes/cadastrar"
                data-type="filled"
                text={textResponsive}
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
        <Modal
          open={infoModalOpen}
          onClose={handleCloseInfoModal}
          aria-labelledby="info-modal-title"
          aria-describedby="info-modal-description"
        >
          <Box sx={style}>
            <Typography id="info-modal-title" variant="h6" component="h2">
              Informações dos Ícones de Ação
            </Typography>
            <Typography id="info-modal-description" sx={{ mt: 2 }}>
              <ul>
                <li>
                  <BsFillEyeFill
                    style={{ verticalAlign: 'middle', marginRight: '5px' }}
                  />
                  <strong>Visualizar:</strong> Abre uma página de detalhes da
                  associação.
                </li>
                <li>
                  <BiSolidEditAlt
                    style={{ verticalAlign: 'middle', marginRight: '5px' }}
                  />
                  <strong>Editar:</strong> Permite modificar informações da
                  associação.
                </li>
                <li>
                  <BiSolidTrashAlt
                    style={{ verticalAlign: 'middle', marginRight: '5px' }}
                  />
                  <strong>Remover:</strong> Exclui a associação após
                  confirmação.
                </li>
                <li>
                  <MdAttachFile
                    style={{ verticalAlign: 'middle', marginRight: '5px' }}
                  />
                  <strong>Anexar Ata:</strong> Permite enexar um arquivo de ata
                  a reunião.
                </li>
                <li>
                  <BiSolidFileImport
                    style={{ verticalAlign: 'middle', marginRight: '5px' }}
                  />
                  <strong>Anexar Documentos:</strong> Permite anexar arquivos a
                  reunião.
                </li>
              </ul>
              <br />
            </Typography>
            <Button
              onClick={handleCloseInfoModal}
              type={'button'}
              dataType="filled"
            >
              Voltar
            </Button>
          </Box>
        </Modal>
      </div>
    </div>
  );
}
