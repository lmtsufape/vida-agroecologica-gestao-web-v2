/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import { sendResetPasswordEmail } from '@/services';
import Input from '@/components/Input';
import Button from '@/components/Button';
import S from './styles.module.scss';

export const ResetPasswordRequest = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      await sendResetPasswordEmail(email);
      setMessage('Email de redefinição de senha enviado com sucesso.');
    } catch (error) {
      setMessage('Falha ao enviar o email de redefinição de senha.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={S.form}>
      <div className={S['form-group']}>
        <label htmlFor="email">E-mail</label>
        <Input
          placeholder="contato@email.com"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className={S['button-container']}>
        <Button type="submit" dataType="filled">
          Recuperar Senha
        </Button>
      </div>
      {message && <p>{message}</p>}
    </form>
  );
};
