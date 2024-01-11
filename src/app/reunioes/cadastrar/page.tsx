'use client';

import { redirect, useRouter } from 'next/navigation';
import React from 'react';

import S from './styles.module.scss';

import Button from '@/components/Button';
import Input from '@/components/Input';
import MultiSelect from '@/components/Multiselect';
import { StyledSelect } from '@/components/Multiselect/style';
import MuiSelect from '@/components/Select';

import {
  createReuniao,
  getAllAssociacoes,
  getAllOCS,
  getAllUsers,
} from '@/services';
import { User } from '@/types/api';
import { useQuery } from '@tanstack/react-query';

export default function Home() {
  const [titulo, setTitulo] = React.useState('');
  const [pauta, setPauta] = React.useState('');
  const [date, setDate] = React.useState('');
  const [tipo, setTipo] = React.useState('');

  const [selectedAssociacoes, setSelectedAssociacoes] = React.useState(0);
  const [selectedOcs, setSelectedOcs] = React.useState(0);
  const [selectedParticipantes, setSelectedParticipantes] = React.useState<
    string | string[]
  >([]);

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

  const router = useRouter();

  const handleRegister: (e: React.FormEvent) => Promise<void> = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('@token');
      if (!token) {
        redirect('/');
      }

      await createReuniao(
        {
          titulo,
          pauta,
          data: date,
          tipo,
          organizacao_id: selectedOcs,
          participantes: Array.isArray(selectedParticipantes)
            ? selectedParticipantes.map((id) => ({ id: Number(id) }))
            : [{ id: Number(selectedParticipantes) }],
          associacao_id: selectedAssociacoes,
        },
        token,
      );
      router.back();
    } catch (error) {
      console.log(error);
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
              <Input
                name="pauta"
                type="pauta"
                placeholder=""
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
                placeholder=""
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
                placeholder="DD-MM-YYYY"
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
                ?.filter((user: User) => {
                  return user?.roles?.some(
                    (role) =>
                      typeof role !== 'number' &&
                      typeof role !== 'string' &&
                      role.nome === 'consumidor',
                  );
                })
                .map((user: User) => (
                  <StyledSelect
                    key={user.id}
                    value={user.id}
                    sx={{ justifyContent: 'space-between' }}
                  >
                    {isLoading
                      ? 'Carregando...'
                      : user.name +
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
    </main>
  );
}
