import React from 'react';

import S from './styles.module.scss';

const Default = () => {
  return (
    <div className={S.default} style={{ 'display': 'none' }}>
      <p>
        Seu cadastro ainda não foi aprovado para uso do aplicativo Vida
        Agroecológica Vendedor. Faça contato com o(a) presidente(a) da sua
        associação para liberação.
      </p>
    </div>
  );
};

export default Default;
