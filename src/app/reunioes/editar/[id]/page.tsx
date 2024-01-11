/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { redirect, useRouter } from 'next/navigation';
import React from 'react';

import S from './styles.module.scss';

import Button from '@/components/Button';
import Input from '@/components/Input';
import Loader from '@/components/Loader';
import MultiSelect from '@/components/Multiselect';
import MuiSelect from '@/components/Select';
import { StyledSelect } from '@/components/Select/style';

import {
  editReuniao,
  getAllAssociacoes,
  getAllOCS,
  getReuniao,
  getAllUsers,
} from '@/services';
import { Reunioes } from '@/types/api';
import { Alert, AlertTitle, Snackbar } from '@mui/material';
import { useQuery } from '@tanstack/react-query';

const Home = ({ params }: { params: { id: number } }) => {
  const [date, setDate] = React.useState('');
  const [tipo, setTipo] = React.useState('');
  const [titulo, setTitulo] = React.useState('');
  const [pauta, setPauta] = React.useState('');

  const [selectedAssociacoes, setSelectedAssociacoes] = React.useState(0);
  const [selectedOcs, setSelectedOcs] = React.useState<number>(0);
  const [selectedParticipantes, setSelectedParticipantes] = React.useState<
    string | string[]
  >([]);

  const [content, setContent] = React.useState<Reunioes | null>(null);
  const [error, setError] = React.useState('');

  const router = useRouter();

  const { data: associacoes, isLoading } = useQuery({
    queryKey: ['associacoes'],
    queryFn: () => {
      const token = localStorage.getItem('@token');
      if (token) {
        return getAllAssociacoes(token);
      }
      return null;
    },
  });

  const { data: ocs } = useQuery({
    queryKey: ['ocs'],
    queryFn: () => {
      const token = localStorage.getItem('@token');
      if (token) {
        return getAllOCS(token);
      }
      return null;
    },
  });

  const { data: usuarios } = useQuery({
    queryKey: ['users'],
    queryFn: () => {
      const token = localStorage.getItem('@token');
      if (token) {
        return getAllUsers(token);
      }
      return null;
    },
  });

  React.useEffect(() => {
    const token = localStorage.getItem('@token');
    if (!token) {
      redirect('/');
    }
    getReuniao(token, params.id)
      .then((response: any) => setContent(response.reuniao))
      .catch((error: any) => console.log(error));
  }, [params.id]);

  if (!content) {
    return <Loader />;
  }

  const organizacaoDefault = content?.organizacao_id;
  const participantesDefault = content?.participantes?.map(
    (participante) => participante.id,
  );
  const associacaoDefautl = content?.associacao_id;

  const handleEditRegister = async (e: any) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('@token');
      if (!token) {
        redirect('/');
      }

      const requestData = {
        titulo: titulo ?? content?.titulo,
        pauta: pauta ?? content?.pauta,
        tipo: tipo ?? content?.tipo,
        data: date ?? content?.data,
        organizacao_id: selectedOcs || organizacaoDefault,
        participantes: Array.isArray(selectedParticipantes)
          ? selectedParticipantes.map((id) => ({ id: Number(id) }))
          : [{ id: Number(selectedParticipantes) }] || participantesDefault,
        associacao_id: selectedAssociacoes || associacaoDefautl,
      };
      await editReuniao(requestData, token, params.id);
      router.back();
    } catch (error: any) {
      console.log(error);
      console.log(error.response?.data?.message);

      const errors = error.response?.data?.errors;
      // Check if the `errors` object is defined and not null.
      if (errors !== undefined && errors !== null) {
        // Iterate over the `errors` object and display the error message for each key.
        for (const key of Object.keys(errors)) {
          const errorMessage = errors[key][0];
          setError(`${errorMessage}`);
        }
      }
    }
  };

  return (
    <main style={{ marginTop: '5rem' }}>
      <div className={S.container}>
        <h1>Editar</h1>
        <p>
          <strong>{content.titulo}</strong>
        </p>
        <form onSubmit={handleEditRegister} className={S.form}>
          <section>
            <div>
              <label htmlFor="titulo">
                Titulo<span>*</span>
              </label>
              <Input
                name="titulo"
                type="titulo"
                placeholder={content.pauta}
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="pauta">
                Pauta<span>*</span>
              </label>
              <Input
                name="pauta"
                type="pauta"
                placeholder={content.pauta}
                value={pauta}
                onChange={(e) => setPauta(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="tipo">
                Tipo<span>*</span>
              </label>
              <Input
                name="tipo"
                type="text"
                placeholder={content.tipo}
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="data">
                Data<span>*</span>
              </label>
              <Input
                name="data"
                type="text"
                placeholder={content.data}
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <MuiSelect
              label="Associação"
              selectedNames={selectedAssociacoes}
              setSelectedNames={setSelectedAssociacoes}
            >
              {associacoes?.map((item) => (
                <StyledSelect
                  key={item.id}
                  value={item.id}
                  sx={{ justifyContent: 'space-between' }}
                >
                  {isLoading ? 'Carregando...' : item.nome}
                </StyledSelect>
              ))}
            </MuiSelect>
            <MuiSelect
              label="Organizacão de Controle Social"
              selectedNames={selectedOcs}
              setSelectedNames={setSelectedOcs}
            >
              {ocs?.ocs?.map((item) => (
                <StyledSelect
                  key={item.id}
                  value={item.id}
                  sx={{ justifyContent: 'space-between' }}
                >
                  {isLoading ? 'Carregando...' : item.nome}
                </StyledSelect>
              ))}
            </MuiSelect>
            <MultiSelect
              label="Participantes"
              selectedNames={selectedParticipantes}
              setSelectedNames={setSelectedParticipantes}
            >
              {usuarios?.users
                ?.filter(
                  (item) =>
                    !item.roles?.some(
                      (role) =>
                        typeof role !== 'number' &&
                        typeof role !== 'string' &&
                        role.nome === 'consumidor',
                    ),
                )
                .map((item) => (
                  <StyledSelect
                    key={item.id}
                    value={item.id}
                    sx={{ justifyContent: 'space-between' }}
                  >
                    {isLoading
                      ? 'Carregando...'
                      : item.name +
                        ' | ' +
                        item.roles?.map(
                          (item) =>
                            typeof item !== 'number' &&
                            typeof item !== 'string' &&
                            item.nome,
                        )}
                  </StyledSelect>
                ))}
            </MultiSelect>
          </section>
          <div className={S.wrapperButtons}>
            <Button
              onClick={() => router.back()}
              type="button"
              dataType="transparent"
            >
              Voltar
            </Button>{' '}
            <Button dataType="filled" type="submit">
              Editar
            </Button>
          </div>
        </form>
        <Snackbar open={error.length > 0} autoHideDuration={6000}>
          <Alert variant="filled" severity="error">
            <AlertTitle>Erro!</AlertTitle>
            {error}
          </Alert>
        </Snackbar>
      </div>
    </main>
  );
};

export default Home;
