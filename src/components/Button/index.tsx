import React from 'react';

import S from './styles.module.scss';

type Props = {
  type: 'button' | 'submit' | 'reset';
  children: string | React.ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;
  disabled?: boolean;
  dataType?: string;
};

const Button = ({
  children,
  onClick,
  type,
  style,
  dataType,
  disabled,
}: Props): JSX.Element => {
  return (
    <button
      onClick={onClick}
      style={style}
      type={type}
      data-type={dataType}
      className={disabled ? S.disabled : S.button}
    >
      {children}
    </button>
  );
};
export default Button;
