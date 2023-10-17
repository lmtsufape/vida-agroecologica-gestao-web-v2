'use client';

import React from 'react';
import S from './styles.module.scss';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { redirect, useRouter } from 'next/navigation';
import { editAssociacao, getAssociacao } from '@/services/associations';
import { Associacao } from '@/types/api';
import Loader from '@/components/Loader';
import MultiSelect from '@/components/Multiselect';
import { getPresidents } from '@/services/user';
import { Alert, AlertTitle, Snackbar } from '@mui/material';
import { StyledSelect } from '@/components/Multiselect/style';
import { BsCheck2 as CheckIcon } from 'react-icons/bs';

const Home = ({ params }: { params: { id: string } }) => {
  const [content, setContent] = React.useState<Associacao | null>(null);
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [codigo, setCodigo] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [presidents, setPresidents] = React.useState([]);
  const [selectedPresidents, setSelectedPresidents] = React.useState<any[]>([]);
  const [error, setError] = React.useState('');

  const router = useRouter();

  React.useEffect(() => {
    const token = localStorage.getItem('@token');
    if (!token) {
      redirect('/login');
    }
    getAssociacao(token, params.id)
      .then((response: any) => setContent(response.associacao))
      .catch((error: any) => console.log(error));

    getPresidents(token)
      .then((response: any) => setPresidents(response.users))
      .catch((error: any) => console.log(error));
  }, []);

  if (!content) {
    return <Loader />;
  }

  let presidentDefault = content.presidentes?.map((item: any) => item.id);

  const handleEditRegister = async (e: any) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('@token');
      if (!token) {
        redirect('/login');
      }

      const requestData = {
        nome: name ? name : content.nome,
        codigo: codigo ? codigo : content.codigo,
        email: email ? email : content?.contato?.email,
        telefone: phone ? phone : content?.contato?.telefone,
        presidente:
          selectedPresidents.length > 0 ? selectedPresidents : presidentDefault,
      };
      await editAssociacao(requestData, token, params.id);
      router.back();
    } catch (error: any) {
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
    <main>
      <div className={S.container}>
        <h1>
          Editar: <strong>{content.nome}</strong>
        </h1>
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
              <label htmlFor="email">
                E-mail<span>*</span>
              </label>
              <Input
                name="email"
                type="email"
                placeholder={content?.contato?.email}
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
                placeholder={content?.contato?.telefone}
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
                type="number"
                placeholder={content.codigo}
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
              />
            </div>
            <MultiSelect
              label="Presidentes"
              selectedNames={selectedPresidents}
              setSelectedNames={setSelectedPresidents}
            >
              {presidents?.map((item: { id: string; name: string }) => (
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
