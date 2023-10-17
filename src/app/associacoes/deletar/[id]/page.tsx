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

const Home = ({ params }: { params: { id: string } }) => {
  const [content, setContent] = React.useState<Associacao | null>(null);

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

  let presidentDefault = content?.presidentes?.map((item: any) => item.id);

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
        presidente: selectedNames.length > 0 ? selectedNames : presidentDefault,
      };
      await editAssociacao(requestData, token, params.id);
      router.back();
    } catch (error: any) {
      const errors = error.response.data.errors;
      // Check if the `errors` object is empty.
      if (Object.keys(errors).length === 0) {
        return;
      }
      // Iterate over the `errors` object and display the error message for each key.
      for (const key of Object.keys(errors)) {
        const errorMessage = errors[key][0];
        setError(`${errorMessage}`);
      }
    }
  };

  return <div></div>;
};

export default Home;
