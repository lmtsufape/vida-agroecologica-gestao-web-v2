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
import { Select, FormControl, MenuItem } from '@mui/material';
import { Alert, AlertTitle, Snackbar } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

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
      .then((response) => setContent(response.reuniao))
      .catch((error) => console.log(error));
  }, [params.id]);

  React.useEffect(() => {
    if (content) {
      setTipo(content.tipo ?? '');
      setTitulo(content.titulo ?? '');
      setPauta(content.pauta ?? '');
      setSelectedAssociacoes(content.associacao_id ?? 0);
      setSelectedOcs(content.organizacao_id ?? 0);
      setSelectedParticipantes(
        content.participantes?.map((participante) =>
          String((participante as { id: number; name: string })?.name),
        ) ?? [],
      );
      const formattedDate = content?.data.split(' ')[0];
      setDate(formattedDate);
    }
  }, [content]);

  if (!content) {
    return <Loader />;
  }

  const organizacaoDefault = content?.organizacao_id;

  const associacaoDefautl = content?.associacao_id;

  const getParticipantIdByName = (
    participantName: string,
  ): number | undefined => {
    const selectedParticipant = usuarios?.users.find(
      (participant) => participant.name === participantName,
    );
    return selectedParticipant?.id;
  };

  let organizacaoIdToSend: number | null = selectedOcs;
  if (selectedOcs === 0) {
    organizacaoIdToSend = null;
  }

  const handleEditRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    // TODO Verificar tipagem
    e.preventDefault();
    try {
      const token = localStorage.getItem('@token');
      if (!token) {
        redirect('/');
      }

      const selectedParticipantIds = Array.isArray(selectedParticipantes)
        ? (selectedParticipantes
            .map((participant) => getParticipantIdByName(participant as string))
            .filter(Boolean) as number[])
        : [getParticipantIdByName(selectedParticipantes as string) as number];

      const requestData = {
        titulo: titulo ?? content?.titulo,
        pauta: pauta ?? content?.pauta,
        tipo: tipo ?? content?.tipo,
        data: date ?? content?.data,
        organizacao_id: organizacaoIdToSend ?? organizacaoDefault,
        participantes: selectedParticipantIds ?? [],
        associacao_id: selectedAssociacoes || associacaoDefautl,
      };
      await editReuniao(requestData, token, params.id);
      router.back();
    } catch (error) {
      console.dir(error, { depth: null, colors: true });
      if (error instanceof AxiosError) {
        console.log(`[editReuniao] ${JSON.stringify(error?.response?.data?.message)}`);
        const errors = error?.response?.data?.errors;
        if (errors !== undefined && errors !== null) {
          for (const key of Object.keys(errors)) {
            const errorMessage = errors[key][0];
            setTimeout(() => {
              setError(`${errorMessage}`);
              window.location.reload();
            }, 4000);
          }
        } else {
          setError(`${JSON.stringify(error)}`);
          setTimeout(() => {
            setError('');
            window.location.reload();
          }, 4000);
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
              <FormControl fullWidth>
                <Select
                  labelId="label"
                  id="tipo"
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value as string)}
                >
                  <MenuItem value="ordinaria">Ordinária</MenuItem>
                  <MenuItem value="extraordinaria">Extraordinária</MenuItem>
                  <MenuItem value="multirao">Mutirão</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div>
              <label htmlFor="data">
                Data<span>*</span>
              </label>
              <Input
                name="data"
                type="date"
                mask="date"
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
                    value={item.name}
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
