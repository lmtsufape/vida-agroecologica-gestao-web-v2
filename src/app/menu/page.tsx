'use client';

import Authentication from '@/utils/session';
import MenuOptions from './components/menuButtons';
import S from './components/styles.module.scss';

const Home = () => {
  return (
    <main className={S.main}>
      <MenuOptions />
    </main>
  );
};
export default Authentication(Home);
