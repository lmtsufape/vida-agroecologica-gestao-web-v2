import React from 'react';
import S from './styles.module.scss';

interface InputProps {
  name: string;
  type: string;
  placeholder: string;
  value: any;
  onChange?: (e?: any) => void;
}

const Input: React.FC<InputProps> = ({ name, type, ...props }) => {
  return <input id={name} {...props} className={S.input} />;
};
export default Input;
