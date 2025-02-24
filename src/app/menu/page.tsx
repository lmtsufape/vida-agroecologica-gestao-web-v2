'use client';

import { FC } from 'react';

import S from './styles.module.scss';

import MenuOptions from '../../components/Menubuttons';

import Authentication from '@/utils/session';

const Home: FC = () => {
  return (
    <main
      className={S.main}
      style={{
        marginTop: '5rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <MenuOptions />
    </main>
  );
};

export default Authentication(Home);
