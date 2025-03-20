/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react';
import { BiSolidTrashAlt, BiSolidEditAlt, BiUser } from 'react-icons/bi';
import { BsFillEyeFill, BsInfoCircle } from 'react-icons/bs';

import S from './styles.module.scss';

import ActionsMenu from '@/components/ActionsMenu';
import Button from '@/components/Button';
import StyledLink from '@/components/Link';
import Loader from '@/components/Loader';
import TableView from '@/components/Table/Table';

import { getAllOCS, removeOCS } from '@/services';
import {
  Box,
  IconButton,
  Tooltip,
  Modal,
  Typography,
  Snackbar,
  Alert,
  AlertTitle,
} from '@mui/material';
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
  const [errorMessage, setErrorMessage] = React.useState('');
  const [infoModalOpen, setInfoModalOpen] = React.useState(false);
  const [textResponsive, setTextResponsive] = React.useState(
    'Adicionar Nova Organização',
  );
  const [titleResponsive, setTitleResponsive] = React.useState(
    'Organização de Controle Social',
  );

  React.useEffect(() => {
    const token = localStorage.getItem('@token');
    if (!token) {
      redirect('/');
    }
    setToken(token);
  }, []);

  React.useEffect(() => {
    const updateText = () => {
      setTextResponsive(
        window.innerWidth < 825 ? 'Adicionar' : 'Adicionar Nova Organização',
      );
    };
    window.addEventListener('resize', updateText);
    updateText();
    return () => window.removeEventListener('resize', updateText);
  });

  React.useEffect(() => {
    const updateTextTitle = () => {
      setTitleResponsive(
        window.innerWidth < 825 ? 'OCS' : 'Organização de Controle Social',
      );
    };
    window.addEventListener('resize', updateTextTitle);
    updateTextTitle();
    return () => window.removeEventListener('resize', updateTextTitle);
  });

  const handleOpenInfoModal = () => setInfoModalOpen(true);
  const handleCloseInfoModal = () => setInfoModalOpen(false);

  const columns: any = [
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
              style={{ margin: '2px', color: 'white' }}
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
        const ocsActions = [
          {
            icon: <BsFillEyeFill style={{ marginRight: 8 }} />,
            text: 'Visualizar',
            href: `ocs/${value}`,
          },
          {
            icon: <BiSolidEditAlt style={{ marginRight: 8 }} />,
            text: 'Editar',
            href: `ocs/editar/${value}`,
          },
          {
            icon: <BiSolidTrashAlt style={{ marginRight: 8, color: 'red' }} />,
            text: 'Remover',
            onClick: () => setValue(value),
            color: 'red',
          },
          {
            icon: <BiUser style={{ marginRight: 8 }} />,
            text: 'Participantes',
            href: `/ocs/participantes/${value}`,
          },
        ];

        return (
          <div className={S.action}>
            {window.innerWidth > 768 ? (
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
                <li>
                  <Link href={'/ocs/participantes/' + value}>
                    <Tooltip title="Participantes">
                      <IconButton aria-label="Participantes" size="small">
                        <BiUser />
                      </IconButton>
                    </Tooltip>
                  </Link>
                </li>
              </ul>
            ) : (
              <ActionsMenu actions={ocsActions} />
            )}
          </div>
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
          <div className={S.headerTitle}>
            <div className={S.back}>
              <Link href="/menu" className={S.link}>
                &lt; Voltar
              </Link>
            </div>
            <div>
              <h1 className={S.title}>{titleResponsive} </h1>
            </div>
            <div className={S.addButton}>
              <StyledLink
                href="ocs/cadastrar"
                data-type="filled"
                text={textResponsive}
              />
            </div>
          </div>
        </div>
        <TableView columns={columns} data={data?.ocs ?? []} />
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
        <Snackbar
          open={errorMessage.length > 0}
          autoHideDuration={6000}
          onClose={() => setErrorMessage('')}
        >
          <Alert variant="filled" severity="error">
            <AlertTitle>Erro!</AlertTitle>
            {errorMessage}
          </Alert>
        </Snackbar>
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
                <strong>Remover:</strong> Exclui a associação após confirmação.
              </li>
              <li>
                <BiUser
                  style={{ verticalAlign: 'middle', marginRight: '5px' }}
                />
                <strong>Lista de Particpantes:</strong> Abre uma pagina com a
                listagem dos participantes.
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
  );
}
