'use client';
import React from 'react';
import S from './styles.module.scss';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const Navbar = () => {
  const params = usePathname();
  const logout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <>
      {!params.includes('/login') && !params.includes('/registrar') && (
        <header className={S.header}>
          <nav className={S.navbar}>
            <ul role="list">
              <li>Logo</li>
              <>
                <li>
                  <Link
                    href="/associacoes"
                    className={`${
                      params === '/associacoes' ? `${S.active}` : ''
                    }`}
                  >
                    Associações
                  </Link>
                </li>
                <li>
                  <Link
                    href="/usuarios"
                    className={`${params === '/usuarios' ? `${S.active}` : ''}`}
                  >
                    Usuários
                  </Link>
                </li>
                <li>
                  <Link
                    href="/ocs"
                    className={`${params === '/ocs' ? `${S.active}` : ''}`}
                  >
                    Organização de Controle Social
                  </Link>
                </li>
                <li>
                  <Link
                    href="/reunioes"
                    className={`${params === '/reunioes' ? `${S.active}` : ''}`}
                  >
                    Reuniões
                  </Link>
                </li>
                <li className={S.logout} onClick={logout}>
                  Sair
                </li>
              </>
            </ul>
          </nav>
        </header>
      )}
    </>
  );
};

export default Navbar;
