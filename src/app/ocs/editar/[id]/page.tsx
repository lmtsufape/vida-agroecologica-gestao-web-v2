'use client';

import React from 'react';
import S from './styles.module.scss';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { redirect, useRouter } from 'next/navigation';
import Loader from '@/components/Loader';
import { Alert, AlertTitle, Snackbar } from '@mui/material';
import { StyledSelect } from '@/components/Multiselect/style';
import MuiSelect from '@/components/Select';
import { editOCS, getAllBairros, getOCS, getAllAssociacoes } from '@/services';
import { OCS } from '@/types/api';

const Home = ({ params }: { params: { id: string } }) => {
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

  const [content, setContent] = React.useState<OCS | null>(null);
  const [error, setError] = React.useState('');

  const router = useRouter();

  React.useEffect(() => {
    const token = localStorage.getItem('@token');
    if (!token) {
      redirect('/login');
    }
    getOCS(token, params.id)
      .then((response: any) => setContent(response.ocs))
      .catch((error: any) => console.log(error));
    getAllAssociacoes(token)
      .then((response: any) => setAssociacoes(response.associacoes))
      .catch((error: any) => console.log(error));
    getAllBairros(token)
      .then((response: any) => setBairro(response.bairros))
      .catch((error: any) => console.log(error));
  }, []);

  if (!content) {
    return <Loader />;
  }

  console.log(content);

  let associacaoDefault = content?.associacao.id;
  let bairrosDefault = content?.endereco.bairro_id;

  console.log(associacaoDefault);
  console.log(bairrosDefault);

  const handleEditRegister = async (e: any) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('@token');
      if (!token) {
        redirect('/login');
      }

      const requestData = {
        cep: cep ? cep : content?.endereco?.cep,
        nome: name ? name : content.nome,
        cnpj: cnpj ? cnpj : content.cnpj,
        data_fundacao: date ? date : content.data_fundacao,
        email: email ? email : content?.contato?.email,
        telefone: telefone ? telefone : content?.contato?.telefone,
        rua: street ? street : content?.endereco?.rua,
        numero: street ? parseInt(street) : parseInt(content?.endereco?.numero),
        bairro_id: selectedAssociacoes ? selectedAssociacoes : bairrosDefault,
        associacao_id: selectedAssociacoes
          ? selectedAssociacoes
          : associacaoDefault,
      };
      await editOCS(requestData, token, params.id);
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
    <main>
      <div className={S.container}>
        <h1>
          Editar: <strong>{content.nome}</strong>
        </h1>
        <form onSubmit={handleEditRegister} className={S.form}>
          <h3>Dados OCS</h3>
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
                placeholder={content.contato.email}
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
                placeholder={content.cnpj}
                value={cnpj}
                onChange={(e) => setCNPJ(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="date">
                Data de Fundação<span>*</span>
              </label>
              <Input
                name="date"
                type="date"
                placeholder={content.data_fundacao}
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
                placeholder={content.contato.telefone}
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
                placeholder={content.endereco.rua}
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
                placeholder={content.endereco.cep}
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
                placeholder={content.endereco.numero}
                value={number}
                onChange={(e) => setNumber(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="complement">Complemento</label>
              <Input
                name="complement"
                type="text"
                placeholder={content.complemento}
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
