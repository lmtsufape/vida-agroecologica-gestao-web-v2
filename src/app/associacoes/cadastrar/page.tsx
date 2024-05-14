/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { redirect, useRouter } from 'next/navigation';
import React from 'react';

import S from './styles.module.scss';

import Button from '@/components/Button';
import Input from '@/components/Input';
import { StyledSelect } from '@/components/Multiselect/style';
import MuiSelect from '@/components/Select';
import { Snackbar, Alert, AlertTitle } from '@mui/material';

import { getAllBairros } from '@/services';
import { createAssociacao } from '@/services/associations';
import { getPresidents } from '@/services/user';
import { Bairro } from '@/types/api';

export default function Home() {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [date, setDate] = React.useState('');
  const [telefone, setTelefone] = React.useState('');
  const [street, setStreet] = React.useState('');
  const [cep, setCEP] = React.useState('');
  const [number, setNumber] = React.useState('');
  const [complement, setComplement] = React.useState('');

  const [bairro, setBairro] = React.useState<Bairro[]>([]);
  const [selectedBairro, setSelectedBairro] = React.useState(1);

  const [presidents, setPresidents] = React.useState<[]>([]);
  const [selectedPresidents, setSelectedPresidents] = React.useState(2);

  const secretarioId = [3];

  const router = useRouter();

  const [errorMessage, setErrorMessage] = React.useState('');

  React.useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage('');
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  React.useEffect(() => {
    const token = localStorage.getItem('@token');
    if (!token) {
      redirect('/');
    }

    getPresidents(token)
      .then((response: any) => setPresidents(response.users))
      .catch((error: any) => console.log(error));
    getAllBairros(token)
      .then((response: { bairros: Bairro[] }) => setBairro(response.bairros))
      .catch((error: any) => console.log(error));
  }, []);

  const handleRegister: (e: React.FormEvent) => Promise<void> = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('@token');
      if (!token) {
        redirect('/');
      }
      await createAssociacao(
        {
          nome: name,
          email: email,
          telefone: telefone,
          data_fundacao: date,
          rua: street,
          cep: cep,
          numero: number,
          bairro_id: selectedBairro,
          secretarios_id: secretarioId,
          presidentes_id: [selectedPresidents],
        },
        token,
      );
      router.back();
    } catch (error: any) {
      console.log(error);
      if (error.response && error.response.status === 500) {
        setTimeout(() => {}, 4000);
      } else {
        setErrorMessage(
          'Erro ao cadastrar associação. Por favor, verifique os dados e tente novamente.',
        );
      }
    }
  };

  return (
    <main style={{ marginTop: '5rem' }}>
      <div className={S.container}>
        <h1>Cadastrar</h1>
        <p>
          <strong>Associação</strong>
        </p>
        <form className={S.form} onSubmit={handleRegister}>
          <h3>Dados</h3>
          <section>
            <div>
              <label htmlFor="nome">
                Nome<span>*</span>
              </label>
              <Input
                name="nome"
                type="text"
                placeholder="Nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="email">E-mail</label>
              <Input
                name="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
            <div>
              <label htmlFor="date">
                Data de Fundação<span>*</span>
              </label>
              <Input
                name="date"
                type="text"
                placeholder="DD-MM-AAAA"
                value={date}
                mask="date"
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <MuiSelect
              label="Presidentes"
              selectedNames={selectedPresidents}
              setSelectedNames={setSelectedPresidents}
            >
              {presidents?.map((item: { id: number; name: string }) => (
                <StyledSelect
                  key={item.id}
                  value={item.id}
                  sx={{ justifyContent: 'space-between' }}
                >
                  {item.name}
                </StyledSelect>
              ))}
            </MuiSelect>
          </section>
          <h3>Endereço</h3>
          <section>
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
            <div>
              <label htmlFor="cep">
                Cep<span>*</span>
              </label>
              <Input
                name="cep"
                type="text"
                placeholder="00000-000"
                value={cep}
                onChange={(e) => setCEP(e.target.value)}
                mask="zipCode"
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
