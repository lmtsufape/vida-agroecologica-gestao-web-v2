import Image from 'next/image';
import React from 'react';
import { GoMail } from 'react-icons/go';
import { SiFacebook, SiInstagram } from 'react-icons/si';

import S from './styles.module.scss';

import { Icons } from '@/assets';
import UfapeLMTS from '@/assets/ufape-lmts.svg';

const Footer = () => {
  return (
    <footer className={S.footer}>
      <ul>
        <li className={S.logo}>
          <Image
            src={Icons.LogoWhite}
            className={S.logoImg}
            alt="Logo Gestão"
          />{' '}
          <p>Gestão</p>
        </li>
        <li className={S.ufapelmtsWrapper}>
          <Image
            className={S.ufapeLmts}
            src={UfapeLMTS}
            alt="ufape e lmts logo"
          />
        </li>
        <li className={S.socialNetwork}>
          <GoMail className={S.email} />
          <SiFacebook />
          <SiInstagram />
        </li>
      </ul>
    </footer>
  );
};

export default Footer;
