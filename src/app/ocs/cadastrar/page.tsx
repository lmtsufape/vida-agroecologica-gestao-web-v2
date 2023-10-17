'use client';

import React from 'react';
import S from './styles.module.scss';
import StyledLink from '@/components/Link';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { createOCS, getAllAssociacoes, getAllBairros } from '@/services';
import { redirect, useRouter } from 'next/navigation';
import MultiSelect from '@/components/Multiselect';
import { StyledSelect } from '@/components/Multiselect/style';
import { BsCheck2 as CheckIcon } from 'react-icons/bs';
import MuiSelect from '@/components/Select';

export default function Home() {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [cnpj, setCNPJ] = React.useState('');
  const [date, setDate] = React.useState('');
  const [telefone, setTelefone] = React.useState('');
  const [street, setStreet] = React.useState('');
  const [cep, setCEP] = React.useState('');
  const [number, setNumber] = React.useState('');
  const [complement, setComplement] = React.useState('');

  const [associacoes, setAssociacoes] = React.useState([]);
  const [selectedAssociacoes, setSelectedAssociacoes] = React.useState<any>();

  const [bairro, setBairro] = React.useState([]);
  const [selectedBairro, setSelectedBairro] = React.useState<any>();
  console.log(selectedAssociacoes);
  console.log(selectedBairro);

  console.log(bairro);

  const router = useRouter();

  React.useEffect(() => {
    const token = localStorage.getItem('@token');
    if (!token) {
      redirect('/login');
    }

    getAllAssociacoes(token)
      .then((response: any) => setAssociacoes(response.associacoes))
      .catch((error: any) => console.log(error));
    getAllBairros(token)
      .then((response: any) => setBairro(response.bairros))
      .catch((error: any) => console.log(error));
  }, []);

  const handleRegister: (e: React.FormEvent) => Promise<void> = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('@token');
      if (!token) {
        redirect('/login');
      }

      await createOCS(
        {
          nome: name,
          cnpj,
          email: email,
          telefone: telefone,
          rua: street,
          cep: cep,
          numero: number,
          data_fundacao: date,
          associacao_id: selectedAssociacoes,
          bairro_id: selectedBairro,
          complemento: complement,
        },
        token,
      );
      router.back();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main>
      <div className={S.container}>
        <h1>Cadastrar Organização Controle Social</h1>
        <form onSubmit={handleRegister} className={S.form}>
          <h3>Dados OCS</h3>
          <section>
            <div>
              <label htmlFor="nome">
                Nome<span>*</span>
              </label>
              <Input
                name="nome"
                type="text"
                placeholder="nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="email">
                E-mail<span>*</span>
              </label>
              <Input
                name="email"
                type="email"
                placeholder="email"
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
                placeholder="CNPJ"
                value={cnpj}
                onChange={(e) => setCNPJ(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="telefone">
                Data de Fundação<span>*</span>
              </label>
              <Input
                name="telefone"
                type="date"
                placeholder="Data"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="telefone">
                Telefone<span>*</span>
              </label>
              <Input
                name="telefone"
                type="text"
                placeholder="(99) 99999-9999"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
              />
            </div>
            <MuiSelect
              label="Associação"
              selectedNames={selectedAssociacoes}
              setSelectedNames={setSelectedAssociacoes}
            >
              {associacoes?.map((item: { id: number; nome: string }) => (
                <StyledSelect
                  key={item.id}
                  value={item.id}
                  sx={{ justifyContent: 'space-between' }}
                >
                  {item.nome}
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
                placeholder="Cep"
                value={cep}
                onChange={(e) => setCEP(e.target.value)}
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
    </main>
  );
}
