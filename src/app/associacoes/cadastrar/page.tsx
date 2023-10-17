'use client';

import React from 'react';
import S from './styles.module.scss';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { createAssociacao } from '@/services/associations';
import { redirect, useRouter } from 'next/navigation';
import MultiSelect from '@/components/Multiselect';
import { getPresidents } from '@/services/user';
import { StyledSelect } from '@/components/Multiselect/style';
import { Presidente } from '@/types/api';
import { BsCheck2 as CheckIcon } from 'react-icons/bs';

export default function Home() {
  const [name, setName] = React.useState('associacao nova');
  const [email, setEmail] = React.useState('associacaonova@gmail.com');
  const [codigo, setCodigo] = React.useState('2423142');
  const [phone, setPhone] = React.useState('(99) 99739-8509');

  const [presidents, setPresidents] = React.useState<[]>([]);
  const [selectedPresidents, setSelectedPresidents] = React.useState<any[]>([]);

  const router = useRouter();

  React.useEffect(() => {
    const token = localStorage.getItem('@token');
    if (!token) {
      redirect('/login');
    }

    getPresidents(token)
      .then((response: any) => setPresidents(response.users))
      .catch((error: any) => console.log(error));
  }, []);

  const handleRegister: (e: React.FormEvent) => Promise<void> = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('@token');
      if (!token) {
        redirect('/login');
      }

      await createAssociacao(
        {
          nome: name,
          codigo,
          email,
          telefone: phone,
          presidente: selectedPresidents,
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
        <h1>
          Cadastrar: <strong>Associação</strong>
        </h1>
        <form className={S.form} onSubmit={handleRegister}>
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
              <label htmlFor="telefone">
                Telefone<span>*</span>
              </label>
              <Input
                name="telefone"
                type="text"
                placeholder="(99) 99999-9999"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="codigo">
                Código<span>*</span>
              </label>
              <Input
                name="codigo"
                type="text"
                placeholder="(99) 99999-9999"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
              />
            </div>
            <MultiSelect
              label="Presidentes"
              selectedNames={selectedPresidents}
              setSelectedNames={setSelectedPresidents}
            >
              {presidents?.map((item: Presidente) => (
                <StyledSelect
                  key={item.id}
                  value={item.id}
                  sx={{ justifyContent: 'space-between' }}
                >
                  {item.name}
                  {selectedPresidents.includes(item.name) ? (
                    <CheckIcon color="info" />
                  ) : null}
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
