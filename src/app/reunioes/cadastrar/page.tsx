'use client';

import { redirect, useRouter } from 'next/navigation';
import React from 'react';

import S from './styles.module.scss';

import Button from '@/components/Button';
import Input from '@/components/Input';
import MultiSelect from '@/components/Multiselect';
import { StyledSelect } from '@/components/Multiselect/style';
import MuiSelect from '@/components/Select';

import { createReuniao, getAllOCS, getAllUsers } from '@/services';
import { User } from '@/types/api';
import {
  Select,
  FormControl,
  MenuItem,
  Snackbar,
  Alert,
  AlertTitle,
  TextareaAutosize,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';

export default function Home() {
  const [titulo, setTitulo] = React.useState('');
  const [pauta, setPauta] = React.useState('');
  const [date, setDate] = React.useState('');
  const [tipo, setTipo] = React.useState('');
  const [selectedOcs, setSelectedOcs] = React.useState(0);
  const [selectedParticipantes, setSelectedParticipantes] = React.useState<
    string | string[]
  >([]);

  const [errorMessage, setErrorMessage] = React.useState('');

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

  const router = useRouter();

  const getParticipantIdByName = (
    participantName: string,
  ): number | undefined => {
    const selectedParticipant = usuarios?.users.find(
      (participant) => participant.name === participantName,
    );
    return selectedParticipant?.id;
  };

  const handleRegister: (e: React.FormEvent) => Promise<void> = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('@token');
      if (!token) {
        redirect('/');
        return;
      }

      if (selectedParticipantes.length < 2) {
        setErrorMessage('Selecione pelo menos duas pessoas para a reunião.');
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
        return;
      }

      const selectedParticipantIds = Array.isArray(selectedParticipantes)
        ? (selectedParticipantes
            .map((participant) => getParticipantIdByName(participant))
            .filter(Boolean) as number[])
        : [getParticipantIdByName(selectedParticipantes) as number];

      let organizacaoIdToSend: number | null = selectedOcs;
      if (selectedOcs === 0) {
        organizacaoIdToSend = null;
      }

      const requestBody = {
        titulo,
        pauta,
        data: date,
        tipo,
        organizacao_id: organizacaoIdToSend,
        participantes: selectedParticipantIds.map((id) => ({ name: '', id })),
        associacao_id: 1,
      };

      await createReuniao(requestBody, token);
      router.back();
    } catch (error) {
      console.log(`[createReuniao] Error:`);
      console.dir(error, { depth: null , colors: true });
      setErrorMessage('Erro ao criar reunião');
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }
  };

  return (
    <main style={{ marginTop: '5rem' }}>
      <div className={S.container}>
        <h1>Reuniões</h1>
        <form onSubmit={handleRegister} className={S.form}>
          <section>
            <div>
              <label htmlFor="nome">
                Título<span>*</span>
              </label>
              <Input
                name="titulo"
                type="text"
                placeholder="Informe o título"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="pauta">
                Pauta<span>*</span>
              </label>
              <TextareaAutosize
                className={S['custom-textarea']}
                id="pauta"
                placeholder="Digite a pauta"
                value={pauta}
                onChange={(e) => setPauta(e.target.value)}
                aria-label="Pauta"
                minRows={2}
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
                  onChange={(e) => setTipo(e.target.value)}
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
                placeholder="DD-MM-YYYY"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
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
                  {item.nome}
                </StyledSelect>
              ))}
            </MuiSelect>
            <MultiSelect
              label="Participantes"
              selectedNames={selectedParticipantes}
              setSelectedNames={setSelectedParticipantes}
            >
              {usuarios?.users
                ?.filter((user: User) => {
                  return user?.roles?.some(
                    (role) =>
                      (typeof role === 'object' &&
                        (role as { nome: string }).nome === 'presidente') ||
                      (role as { nome: string }).nome === 'agricultor',
                  );
                })
                .map((user: User) => (
                  <StyledSelect
                    key={user.id}
                    value={user.name}
                    sx={{ justifyContent: 'space-between' }}
                  >
                    {user.name +
                      ' | ' +
                      user.roles
                        ?.map((role) =>
                          typeof role !== 'number' && typeof role !== 'string'
                            ? role.nome
                            : '',
                        )
                        .join(', ')}
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
              Cadastrar
            </Button>
          </div>
        </form>
      </div>
      <Snackbar open={errorMessage.length > 0}>
        <Alert variant="filled" severity="error">
          <AlertTitle>Erro!</AlertTitle>
          {errorMessage}
        </Alert>
      </Snackbar>
    </main>
  );
}
