'use client';

import { redirect } from 'next/navigation';
import React, { useState } from 'react';

import S from './styles.module.scss';

import Button from '../Button';

import { api } from '@/services/api';

export const AtaForm = ({ reuniaoId }: { reuniaoId: number }) => {
  const [file, setFile] = useState<File | null>(null);
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

  const handleSubmit = async () => {
    if (!file) {
      setErrorMessage('Selecione um arquivo para anexar.');
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append('ata', file);

    try {
      await api.post(`/api/reunioes/${reuniaoId}/ata`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          authorization: `Bearer ${token}`,
        },
      });

      setFile(null);
      setIsLoading(false);
      setErrorMessage('');
    } catch (error) {
      setIsLoading(false);
      setErrorMessage('Ocorreu um erro ao anexar o arquivo.');
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={S.anexos}>
      <label>
        Selecione o arquivo da <strong>ata</strong>:
      </label>
      <input type="file" name="ata" onChange={handleFileChange} />

      <Button type="submit" disabled={isLoading} dataType="filled">
        {isLoading ? 'Anexando...' : 'Anexar ata'}
      </Button>

      {errorMessage && <p className={S.error}>{errorMessage}</p>}
    </form>
  );
};
