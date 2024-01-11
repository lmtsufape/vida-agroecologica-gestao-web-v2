'use client';

import S from './components/styles.module.scss';

import MenuOptions from './components/menuButtons';

import Authentication from '@/utils/session';

const Home = () => {
  return (
    <main className={S.main} style={{ marginTop: '5rem' }}>
      <MenuOptions />
    </main>
  );
};
export default Authentication(Home);
