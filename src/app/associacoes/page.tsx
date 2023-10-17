'use client';

import StyledLink from '@/components/Link';
import React from 'react';
import { getAllAssociacoes, removeAssociacao } from '@/services/associations';
import { redirect } from 'next/navigation';
import S from './styles.module.scss';
import { BiSolidTrashAlt, BiSolidEditAlt } from 'react-icons/bi';
import { BsFillEyeFill } from 'react-icons/bs';
import Link from 'next/link';
import { Box, IconButton, Tooltip, Modal, Typography } from '@mui/material';
import Button from '@/components/Button';
import TableView from '@/components/Table/Table';

const style = {
  position: 'absolute' as 'absolute',
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
  const [value, setValue] = React.useState('');
  const handleClose = () => setValue('');
  const [content, setContent] = React.useState([]);

  const columns: any = [
    {
      header: 'Nome',
      accessorKey: 'nome',
    },
    {
      header: 'Código',
      accessorKey: 'codigo',
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

  React.useEffect(() => {
    const token = localStorage.getItem('@token');
    if (!token) {
      redirect('/login');
    }
    getAllAssociacoes(token)
      .then((response: any) => setContent(response.associacoes))
      .catch((error: any) => console.log(error));
  }, []);

  const handleDelete = () => {
    const token = localStorage.getItem('@token');
    if (!token) {
      redirect('/login');
    }

    removeAssociacao(token, value)
      .then((response: any) => {
        handleClose();
        redirect('/associacoes');
      })
      .catch((error: any) => console.log(error));
  };

  return (
    <div>
      <section className={S.dashboard}>
        <div className={S.header}>
          <h1>Associações</h1>
          <StyledLink
            href="associacoes/cadastrar"
            data-type="filled"
            text="+ Adicionar Nova Associação"
          />
        </div>
        <TableView columns={columns} data={content} />
      </section>
      <div>
        <Modal
          open={value > 0 ? true : false}
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
                onClick={handleDelete}
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
