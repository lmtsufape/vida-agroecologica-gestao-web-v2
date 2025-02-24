import { redirect } from 'next/navigation';
import React, { useState, useEffect } from 'react';

import Button from '@/components/Button';

export const SeeAnexos = ({ reuniaoId }: { reuniaoId: number }) => {
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('@token');
    if (!token) {
      redirect('/');
    }
    setToken(token);
  }, []);

  const downloadAllAnexos = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://127.0.0.1:8000/api/reunioes/${reuniaoId}/anexos/download-all`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error('Failed to download all attachments');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reuniao_${reuniaoId}_anexos.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={downloadAllAnexos}
      disabled={loading}
      type="button"
      dataType="filled"
    >
      {loading ? 'Baixando...' : 'Baixar Todos os Anexos'}
    </Button>
  );
};
