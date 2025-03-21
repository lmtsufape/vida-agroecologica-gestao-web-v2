import { redirect } from 'next/navigation';
import React, { useState } from 'react';

import S from './styles.module.scss';

import Button from '@/components/Button';

export const SeeAta = ({ reuniaoId }: { reuniaoId: number }) => {
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState('');

  React.useEffect(() => {
    const token = localStorage.getItem('@token');
    if (!token) {
      redirect('/');
    }
    setToken(token);
  }, []);

  const downloadAta = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `http://127.0.0.1:8000/api/reunioes/${reuniaoId}/ata`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error('Failed to download ATA file');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ata_file.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error(
        `[downloadAta] Error downloading ATA file: ${(error as Error).message}`,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={S.btnAta}>
      <Button
        onClick={downloadAta}
        disabled={loading}
        type="submit"
        dataType="filled"
        style={{ backgroundColor: 'orange' }}
      >
        {loading ? 'Baixando...' : 'Ver ATA'}
      </Button>
    </div>
  );
};
