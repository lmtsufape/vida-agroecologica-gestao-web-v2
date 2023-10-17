'use client';

import React from 'react';
import { createUser } from '@/services/user';
import S from './styles.module.scss';
import { MdManageAccounts } from 'react-icons/md';
import Button from '@/components/Button';
import Link from 'next/link';
import StyledLink from '@/components/Link';

const RegisterForm = () => {
  const [name, setName] = React.useState('laura');
  const [email, setEmail] = React.useState('laura@gmail.com');
  const [password, setPassword] = React.useState('12345678');
  const [telefone, setTelefone] = React.useState('(99) 99999-9979');
  const [cpf, setCpf] = React.useState('700.981.820-72');
  let [roles, setRoles] = React.useState(['4']);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUser({
        name,
        email,
        password,
        apelido: null,
        telefone,
        cpf,
        roles,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={S.registerForm}>
      <h1>
        <MdManageAccounts />
        Cadastrar
      </h1>
      <p className={S.loginMessage}>
        Já está registrado? <Link href="/login">Faça o login</Link>
      </p>
      <form onSubmit={handleRegister}>
        <div>
          <label htmlFor="nome">
            Nome<span>*</span>
          </label>
          <input
            id="nome"
            type="text"
            placeholder="nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="email">
            E-mail<span>*</span>
          </label>
          <input
            id="email"
            type="email"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">
            Senha<span>*</span>
          </label>
          <input
            id="password"
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="telefone">
            Telefone<span>*</span>
          </label>
          <input
            type="text"
            placeholder="telefone"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="cpf">
            CPF<span>*</span>
          </label>
          <input
            type="text"
            placeholder="cpf"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
          />
        </div>
        <input
          type="hidden"
          placeholder="roles"
          value={roles}
          onChange={(e) => setRoles(e.target.value.split(','))}
        />
        <div className={S.wrapperButtons}>
          <StyledLink href="/login" data-type="transparent" text="Voltar" />
          <Button data-type="filled" type="submit" text="Cadastrar" />
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
