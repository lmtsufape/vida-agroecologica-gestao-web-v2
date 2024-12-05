/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Link from 'next/link';
import { redirect, useRouter } from 'next/navigation';
import React from 'react';

import S from './styles.module.scss';

import Button from '@/components/Button';
import Input from '@/components/Input';
import MultiSelect from '@/components/Multiselect';
import { StyledSelect } from '@/components/Multiselect/style';
import MuiSelect from '@/components/Select';

import {
  createOCS,
  getAllAssociacoes,
  getAllBairros,
  getAllUsers,
} from '@/services';
import { Bairro, User } from '@/types/api';
import { Alert, AlertTitle, Snackbar } from '@mui/material';
import { useQuery } from '@tanstack/react-query';

export default function Home() {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [cnpj, setCNPJ] = React.useState('');
  const [telefone, setTelefone] = React.useState('');
  const [street, setStreet] = React.useState('');
  const [cep, setCEP] = React.useState('');
  const [number, setNumber] = React.useState('');
  const [complement, setComplement] = React.useState('');

  const [selectedAssociacoes, setSelectedAssociacoes] = React.useState(0);
  const [selectedAgricultores, setSelectedAgricultores] = React.useState<
    string | string[]
  >([]);

  const [bairro, setBairro] = React.useState<Bairro[]>([]);
  const [selectedBairro, setSelectedBairro] = React.useState(0);

  const [error, setError] = React.useState('');

  const router = useRouter();

  React.useEffect(() => {
    const token = localStorage.getItem('@token');
    if (!token) {
      redirect('/');
    }

    getAllBairros(token)
      .then((response: { bairros: Bairro[] }) => setBairro(response.bairros))
      .catch((error: any) => console.log(error));
  }, []);

  const { data: associacoes } = useQuery({
    queryKey: ['associacoes'],
    queryFn: () => {
      const token = localStorage.getItem('@token');
      if (token) {
        return getAllAssociacoes(token);
      }
      return null;
    },
  });

  const { data: agricultores } = useQuery({
    queryKey: ['users'],
    queryFn: () => {
      const token = localStorage.getItem('@token');
      if (token) {
        return getAllUsers(token);
      }
      return null;
    },
  });

  const filterAgricultores = agricultores?.users?.filter((user: User) => {
    return user?.roles?.some(
      (role) =>
        typeof role !== 'number' &&
        typeof role !== 'string' &&
        role.nome === 'agricultor',
    );
  });

  const mapAgricultoresToIds = (
    selectedAgricultoresNames: string | string[],
    filterAgricultores: User[],
  ): number[] => {
    const selectedAgricultoresIds: number[] = [];
    filterAgricultores.forEach((agricultor) => {
      if (
        agricultor.id !== undefined &&
        selectedAgricultoresNames.includes(agricultor.name)
      ) {
        selectedAgricultoresIds.push(agricultor.id);
      }
    });
    return selectedAgricultoresIds;
  };

  const handleRegister: (e: React.FormEvent) => Promise<void> = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('@token');
      if (!token) {
        redirect('/');
      }

      const selectedAgricultoresIds = mapAgricultoresToIds(
        selectedAgricultores,
        filterAgricultores || [],
      );

      await createOCS(
        {
          nome: name,
          cnpj,
          email: email,
          telefone: telefone,
          rua: street,
          cep: cep,
          numero: number,
          associacao_id: selectedAssociacoes,
          bairro_id: selectedBairro,
          agricultores_id: selectedAgricultoresIds,
          complemento: complement,
        },
        token,
      );
      router.back();
    } catch (error: any) {
      if (error.response && error.response.data) {
        const apiErrors = error.response.data.errors;
        console.log('Erro retornado pela API:', apiErrors);
        setError(Object.values(apiErrors).flat().join(' | '));
      } else {
        console.error('Erro inesperado:', error.message);
        setError('Erro inesperado ao criar OCS.');
      }
    }
  };

  return (
    <main style={{ marginTop: '5rem' }}>
      <div className={S.container}>
        <div className={S.headerTitle}>
          <div>
            <Link href="/ocs" className={S.back}>
              &lt; Voltar
            </Link>
          </div>
          <div>
            <h2 className={S.title}>
              Cadastrar Organização Social de Controle
            </h2>
          </div>
        </div>
        <form onSubmit={handleRegister} className={S.form}>
          <h2>Dados da Associação:</h2>
          <section>
            <div>
              <label htmlFor="nome">
                Nome<span>*</span>
              </label>
              <Input
                name="nome"
                type="text"
                placeholder="Insira o nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="email">E-mail</label>
              <Input
                name="email"
                type="email"
                placeholder="contato@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="cnpj">
                CNPJ<span>*</span>
              </label>
              <Input
                name="cnpj"
                type="text"
                placeholder="00.000.000/0000-00."
                value={cnpj}
                onChange={(e) => setCNPJ(e.target.value)}
                mask="cnpj"
              />
            </div>
            <div>
              <label htmlFor="telefone">Telefone</label>
              <Input
                name="telefone"
                type="text"
                placeholder="(99) 99999-9999"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                mask="phone"
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
                  {item.nome}
                </StyledSelect>
              ))}
            </MuiSelect>
            <MultiSelect
              label="Agricultores"
              selectedNames={selectedAgricultores}
              setSelectedNames={setSelectedAgricultores}
            >
              {filterAgricultores?.map((item) => (
                <StyledSelect
                  key={item.id}
                  value={item.name}
                  sx={{ justifyContent: 'space-between' }}
                >
                  {item.name}
                </StyledSelect>
              ))}
            </MultiSelect>
          </section>

          <h2>Endereço:</h2>
          <section>
            <div>
              <label htmlFor="cep">
                Cep<span>*</span>
              </label>
              <Input
                name="cep"
                type="text"
                placeholder="Cep"
                value={cep}
                onChange={(e) => setCEP(e.target.value)}
                mask="zipCode"
              />
            </div>
            <div>
              <label htmlFor="street">
                Rua<span>*</span>
              </label>
              <Input
                name="street"
                type="text"
                placeholder="Rua"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
              />
            </div>

            <MuiSelect
              label="Bairro"
              selectedNames={selectedBairro}
              setSelectedNames={setSelectedBairro}
            >
              {bairro?.map((item: { id: number; nome: string }) => (
                <StyledSelect
                  key={item.id}
                  value={item.id}
                  sx={{ justifyContent: 'space-between' }}
                >
                  {item.nome}
                </StyledSelect>
              ))}
            </MuiSelect>
            <div>
              <label htmlFor="number">
                Número<span>*</span>
              </label>
              <Input
                name="number"
                type="number"
                placeholder="Número"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="complement">Complemento</label>
              <Input
                name="complement"
                type="text"
                placeholder="Complemento"
                value={complement}
                onChange={(e) => setComplement(e.target.value)}
              />
            </div>
          </section>
          <div className={S.wrapperButtons}>
            <Button dataType="filled" type="submit">
              Cadastrar
            </Button>
          </div>
        </form>
      </div>
      <Snackbar
        open={error.length > 0}
        autoHideDuration={6000}
        onClose={() => setError('')}
      >
        <Alert onClose={() => setError('')} severity="error" variant="filled">
          <AlertTitle>Erro!</AlertTitle>
          {error}
        </Alert>
      </Snackbar>
    </main>
  );
}
