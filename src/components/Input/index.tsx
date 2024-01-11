'use client';

import React from 'react';

import S from './styles.module.scss';

import { TextField } from '@mui/material';
import { useMask } from '@react-input/mask';

interface InputProps {
  name: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  mask?: string;
}

const getMaskTypesForText = (maskType: string | null) => {
  if (!maskType) {
    return {};
  }

  if (maskType === 'phone') {
    return {
      mask: '(__) _____-____',
      replacement: { _: /\d/ },
    };
  }

  if (maskType === 'cpf') {
    return {
      mask: '___.___.___-__',
      replacement: { _: /\d/ },
    };
  }

  if (maskType === 'zipCode') {
    return {
      mask: '_____-___',
      replacement: { _: /\d/ },
    };
  }

  return {};
};

const Input: React.FC<InputProps> = ({
  name,
  type,
  mask,
  onChange,
  value,
  ...props
}) => {
  const inputRef = useMask(getMaskTypesForText(mask ?? null));
  return (
    <TextField
      id={name}
      name={name}
      variant="outlined"
      {...props}
      value={value}
      onChange={onChange}
      type={type}
      {...(mask ? { inputRef: inputRef } : {})}
      className={S.input}
      fullWidth
    />
  );
};

export default Input;
