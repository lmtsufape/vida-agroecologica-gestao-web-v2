import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { GoMail } from 'react-icons/go';
import { SiFacebook, SiInstagram } from 'react-icons/si';

import S from './styles.module.scss';

import { Icons } from '@/assets';
import LMTS from '@/assets/lmts.svg';
import Ufape from '@/assets/ufape.svg';

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
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Link
              href="https://ufape.edu.br/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'white' }}
            >
              <Image className={S.ufape} src={Ufape} alt="ufape logo" />
            </Link>
            <Link
              href="http://www.lmts.ufape.edu.br/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'white' }}
            >
              <Image className={S.lmts} src={LMTS} alt="lmts logo" />
            </Link>
          </div>
        </li>
        <li className={S.socialNetwork}>
          <Link
            href="mailto:lmts@ufape.edu.br"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'white' }}
          >
            <GoMail className={S.email} />
          </Link>
          <Link
            href="https://www.facebook.com/LMTSUFAPE/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'white' }}
          >
            <SiFacebook />
          </Link>
          <Link
            href="https://www.instagram.com/lmts_ufape"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'white' }}
          >
            <SiInstagram />
          </Link>
        </li>
      </ul>
    </footer>
  );
};

export default Footer;
