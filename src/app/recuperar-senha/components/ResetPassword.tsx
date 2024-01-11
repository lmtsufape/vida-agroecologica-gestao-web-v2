'use client';
import React from 'react';

import Input from '@/components/Input';

export const ResetPassword = () => {
  const [email, setEmail] = React.useState('');
  return (
    <form>
      <div>
        <label htmlFor="email">E-mail</label>
        <Input
          placeholder="contato@email.com"
          name="email"
          type="email"
          value={email}
          onChange={(
            e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
          ) => setEmail(e.target.value)}
        />
      </div>
    </form>
  );
};
