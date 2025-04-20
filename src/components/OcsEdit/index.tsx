'use client';

import Link from 'next/link';
import { redirect, useRouter } from 'next/navigation';
import React, { ChangeEvent } from 'react';

import S from './styles.module.scss';

import Button from '@/components/Button';
import Input from '@/components/Input';
import Loader from '@/components/Loader';
import MultiSelect from '@/components/Multiselect';
import { StyledSelect } from '@/components/Multiselect/style';
import MuiSelect from '@/components/Select';

import {
  editOCS,
  getAllBairros,
  getOCS,
  getAllAssociacoes,
  getAllUsers,
} from '@/services';
import { OCS, User, Bairro } from '@/types/api';
import { fetchAddressFunction, ViaCepResponseData } from '@/utils/fetchAddress';
import { Alert, AlertTitle, Snackbar } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

type OcsEditHomeProps = {
  id: string;
};

const OcsEditHome = ({ id }: OcsEditHomeProps) => {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [cnpj, setCNPJ] = React.useState('');
  const [telefone, setTelefone] = React.useState('');
  const [street, setStreet] = React.useState('');
  const [cep, setCEP] = React.useState('');
  const [number, setNumber] = React.useState('');
  const [complement, setComplement] = React.useState('');

  const [selectedAssociacoes, setSelectedAssociacoes] = React.useState(1);

  const [bairro, setBairro] = React.useState<Bairro[]>([]);
  const [selectedBairro, setSelectedBairro] = React.useState(0);

  const [selectedAgricultores, setSelectedAgricultores] = React.useState<
    string | string[]
  >([]);

  const [content, setContent] = React.useState<OCS | null>(null);
  const [error, setError] = React.useState('');
  const [info, setInfo] = React.useState('');

  const router = useRouter();

  interface OCSResponse {
    ocs: OCS;
  }

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

  React.useEffect(() => {
    const token = localStorage.getItem('@token');
    if (!token) {
      redirect('/');
    }
    getOCS(token, id)
      .then((response: OCSResponse) => setContent(response.ocs))
      .catch((error) => console.log(error));
    getAllBairros(token)
      .then((response) => setBairro(response))
      .catch((error) => console.log(error));
  }, [id]);

  React.useEffect(() => {
    if (content) {
      setName(content.nome ?? '');
      setEmail(content.contato?.email ?? '');
      setCNPJ(content.cnpj ?? '');
      setTelefone(content.contato?.telefone ?? '');
      setStreet(content.endereco?.rua ?? '');
      setCEP(content.endereco?.cep ?? '');
      setNumber(content.endereco?.numero ?? '');
      setComplement(content.endereco?.complemento ?? '');
      setSelectedBairro(content.endereco?.bairro_id ?? 0);
      setSelectedAssociacoes(content.associacao_id ?? 1);
    }
  }, [content]);

  if (!content) {
    return <Loader />;
  }

  const associacaoDefault = content?.associacao_id;
  const bairrosDefault = content?.endereco?.bairro_id;
  const agricultoresDefault = content?.agricultores_id;

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

  const handleEditRegister = async (e: React.FormEvent) => {
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
      const requestData = {
        cep: cep || content?.endereco?.cep,
        nome: name || content.nome,
        cnpj: cnpj || content.cnpj,
        email: email || content?.contato?.email,
        telefone: telefone || content?.contato?.telefone,
        rua: street || content?.endereco?.rua,
        numero: number || content?.endereco?.numero,
        complemento: complement || content?.endereco?.complemento,
        bairro_id: selectedBairro ?? bairrosDefault,
        agricultores_id: selectedAgricultoresIds || agricultoresDefault,
        associacao_id: selectedAssociacoes || associacaoDefault,
      };
      await editOCS(requestData, token, id);
      router.back();
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error?.response?.data) {
          const apiErrors = error?.response?.data?.errors;
          console.log(`[editOCS] Erro retornado pela API: ${apiErrors}`);
          setError(Object.values(apiErrors).flat().join(' | '));
        } else {
          console.error(
            `[editOCS] Erro na requisição: ${JSON.stringify(error?.message)}`,
          );
          setError('Erro na requisição ao editar OCS.');
        }
      } else if (error instanceof Error) {
        console.error(
          `[editOCS] Erro genérico: ${JSON.stringify(error?.message)}`,
        );
        setError('Erro genérico ao editar OCS.');
      } else {
        console.error(`[editOCS] Erro desconhecido: ${JSON.stringify(error)}`);
        setError('Erro desconhecido ao editar OCS.');
      }
    }
  };

  const handleCEPChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const target = e.target as HTMLInputElement;
    let cepValue = target.value.replace(/\D/g, '');

    if (cepValue.length > 5) {
      cepValue = cepValue.slice(0, 5) + '-' + cepValue.slice(5, 8);
    }

    setCEP(cepValue);
    if (cepValue.replace('-', '').length === 8) {
      fetchAddressFunction(cepValue.replace('-', ''))
        .then((response: ViaCepResponseData) => {
          setStreet(response.logradouro ?? '');
          setComplement(response.complemento ?? '');
        })
        .catch((error) => {
          console.debug(error);
          if (
            error instanceof Error &&
            error?.message === 'CEP não encontrado.'
          ) {
            setInfo('CEP não encontrado.');
            resetCEPData();
          } else {
            setError('Erro ao buscar o CEP.');
            resetCEPData();
          }
        });
    }
  };

  const resetCEPData = () => {
    setStreet('');
    setComplement('');
    setCEP('');
  };

  return (
    <main style={{ marginTop: '5rem' }}>
      <div className={S.container}>
        <div className={S.headerContent}>
          <div className={S.headerTitle}>
            <div>
              <Link href="/menu" className={S.back}>
                &lt; Voltar
              </Link>
            </div>
            <div>
              <h1 className={S.title}>Associações</h1>
            </div>
          </div>
        </div>
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
              <label htmlFor="cnpj">
                CNPJ<span>*</span>
              </label>
              <Input
                name="cnpj"
                type="text"
                placeholder={
                  content?.cnpj
                    ? content.cnpj.replace(
                        /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
                        '$1.$2.$3/$4-$5',
                      )
                    : ''
                }
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
                placeholder={content.contato?.telefone ?? ''}
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                mask="phone"
              />
            </div>
            <div>
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
            </div>
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
                onChange={handleCEPChange}
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
            </Button>{' '}
            <Button dataType="filled" type="submit">
              Editar
            </Button>
          </div>
        </form>
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
        <Snackbar
          open={info.length > 0}
          autoHideDuration={6000}
          onClose={() => setInfo('')}
        >
          <Alert variant="filled" severity="info">
            <AlertTitle>Info</AlertTitle>
            {info}
          </Alert>
        </Snackbar>
      </div>
    </main>
  );
};

export default OcsEditHome;
