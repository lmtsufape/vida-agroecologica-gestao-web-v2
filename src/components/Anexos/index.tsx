import { redirect } from 'next/navigation';
import React, { useState } from 'react';

import S from './styles.module.scss';

import Button from '../Button';

import { api } from '@/services/api';

export const AnexosForm = ({ reuniaoId }: { reuniaoId: number }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [token, setToken] = useState('');

  React.useEffect(() => {
    const token = localStorage.getItem('@token');
    if (!token) {
      redirect('/');
    }
    setToken(token);
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!files.length) {
      setErrorMessage('Selecione pelo menos um anexo.');
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    for (const file of files) {
      formData.append('anexos[]', file);
    }

    try {
      await api.post(`/api/reunioes/${reuniaoId}/anexos`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          authorization: `Bearer ${token}`,
        },
      });

      setFiles([]);
      setIsLoading(false);
      setErrorMessage('');
    } catch (error) {
      setIsLoading(false);
      setErrorMessage('Ocorreu um erro ao enviar os anexos.');
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(Array.from(event.target.files || []));
  };

  return (
    <form onSubmit={handleSubmit} className={S.anexos}>
      <label>Selecione os arquivos:</label>
      <input type="file" name="anexos" multiple onChange={handleFileChange} />

      <Button type="submit" disabled={isLoading} dataType="filled">
        {isLoading ? 'Enviando anexos...' : 'Anexar Arquivos'}
      </Button>

      {errorMessage && <p className={S.error}>{errorMessage}</p>}
    </form>
  );
};
