import React from 'react';
import S from './styles.module.scss';
import { SiFacebook, SiInstagram } from 'react-icons/si';
import { GoMail } from 'react-icons/go';
import UfapeLMTS from '@/assets/ufape-lmts.svg';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className={S.footer}>
      <ul role="list">
        <li>Logo</li>
        <li>
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
