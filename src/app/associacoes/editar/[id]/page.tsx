/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { redirect, useRouter } from 'next/navigation';
import React from 'react';

import S from './styles.module.scss';

import Button from '@/components/Button';
import Input from '@/components/Input';
import Loader from '@/components/Loader';
import { StyledSelect } from '@/components/Multiselect/style';
import MuiSelect from '@/components/Select';

import { getAllBairros } from '@/services';
import { editAssociacao, getAssociacao } from '@/services/associations';
import { getPresidents } from '@/services/user';
import { Associacao } from '@/types/api';
import { Alert, AlertTitle, Snackbar } from '@mui/material';

const Home = ({ params }: { params: { id: string } }) => {
  const [content, setContent] = React.useState<Associacao | null>(null);
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [date, setDate] = React.useState('');
  const [street, setStreet] = React.useState('');
  const [cep, setCEP] = React.useState('');
  const [number, setNumber] = React.useState('');
  const [complement, setComplement] = React.useState('');

  const [bairro, setBairro] = React.useState([]);
  const [selectedBairro, setSelectedBairro] = React.useState<any>();

  const [presidents, setPresidents] = React.useState<[]>([]);
  const [selectedPresidents, setSelectedPresidents] = React.useState(0);

  const [error, setError] = React.useState('');

  const router = useRouter();

  React.useEffect(() => {
    const token = localStorage.getItem('@token');
    if (!token) {
      redirect('/');
    }
    getAssociacao(token, params.id)
      .then((response: any) => setContent(response.associacao))
      .catch((error: any) => console.log(error));
    getPresidents(token)
      .then((response: any) => setPresidents(response.users))
      .catch((error: any) => console.log(error));
    getAllBairros(token)
      .then((response: any) => setBairro(response.bairros))
      .catch((error: any) => console.log(error));
  }, [params.id]);

  React.useEffect(() => {
    if (content) {
      setName(content.nome ?? '');
      setEmail(content.contato?.email ?? '');
      setPhone(content.contato?.telefone ?? '');
      setDate(content.data_fundacao ?? '');
      setStreet(content.endereco?.rua ?? '');
      setCEP(content.endereco?.cep ?? '');
      setNumber(content.endereco?.numero ?? '');
      setComplement(content.endereco?.complemento ?? '');
    }
  }, [content]);

  React.useEffect(() => {
    if (content && content.endereco?.bairro_id) {
      setSelectedBairro(content.endereco.bairro_id);
    }
  }, [content]);

  if (!content) {
    return <Loader />;
  }

  const presidentDefault = content.presidentes?.map((item: any) => item.id);

  const handleEditRegister = async (e: any) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('@token');
      if (!token) {
        redirect('/');
      }

      const requestData = {
        nome: name || content.nome,
        email: email || content?.contato?.email,
        telefone: phone || content?.contato?.telefone,
        data_fundacao: date || content?.data_fundacao,
        rua: street || content?.endereco?.rua,
        cep: cep || content?.endereco?.cep,
        numero: number || content?.endereco?.numero,
        complemento: complement || content?.endereco?.complemento,
        bairro_id: selectedBairro,
        secretarios_id: [1],
        presidentes_id:
          selectedPresidents > 0 ? [selectedPresidents] : presidentDefault,
      };

      await editAssociacao(requestData, token, params.id);
      router.back();
    } catch (error: any) {
      console.log(error.response?.data?.message);
      const errors = error.response?.data?.errors;
      if (errors !== undefined && errors !== null) {
        for (const key of Object.keys(errors)) {
          const errorMessage = errors[key][0];
          setTimeout(() => {
            setError(`${errorMessage}`);
            window.location.reload();
          }, 3000);
        }
      }
    }
  };

  return (
    <main style={{ marginTop: '5rem' }}>
      <div className={S.container}>
        <h1>Editar</h1>
        <p>
          <strong>{content.nome}</strong>
        </p>
        <form className={S.form} onSubmit={handleEditRegister}>
          <section>
            <div>
              <label htmlFor="nome">
                Nome<span>*</span>
              </label>
              <Input
                name="nome"
                type="text"
                placeholder={content.nome}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="email">E-mail</label>
              <Input
                name="email"
                type="email"
                placeholder={content.contato?.email ?? ''}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="telefone">Telefone</label>
              <Input
                name="telefone"
                type="text"
                placeholder={content.contato?.telefone ?? ''}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
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
                mask="date"
                placeholder={content.data_fundacao}
                value={date}
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
                placeholder={content.endereco?.rua ?? ''}
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
                placeholder={content.endereco?.cep ?? ''}
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
                placeholder={content.endereco?.numero ?? ''}
                value={number}
                onChange={(e) => setNumber(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="complement">Complemento</label>
              <Input
                name="complement"
                type="text"
                placeholder={content.endereco?.complemento ?? ''}
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
            </Button>
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
