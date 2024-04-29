'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as React from 'react';
import { BiMenu } from 'react-icons/bi';

import styles from './styles.module.scss';

import { Icons } from '@/assets';
import {
  AppBar,
  Box,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  createTheme,
  ThemeProvider,
} from '@mui/material';

const pages = [
  {
    name: 'Associações',
    path: '/associacoes',
    roles: ['administrador', 'presidente'],
  },
  {
    name: 'Usuários',
    path: '/usuarios',
    roles: ['administrador', 'presidente'],
  },
  {
    name: 'Organização de Controle Social',
    path: '/ocs',
    roles: ['administrador', 'presidente'],
  },
  {
    name: 'Reuniões',
    path: '/reunioes',
    roles: ['administrador', 'secretario', 'presidente'],
  },
];

const Navbar = () => {
  const params = usePathname();

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null,
  );

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorElNav(null);
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  const [role, setRole] = React.useState('');

  React.useEffect(() => {
    const roles = localStorage.getItem('@roles');
    if (roles) {
      const parsedRoles = JSON.parse(roles);
      if (parsedRoles.length > 0) {
        setRole(parsedRoles[0].nome);
      }
    }
  }, []);

  const visiblePages = pages.filter((page) => page.roles.includes(role));

  const renderMenuItems = () => {
    return visiblePages.map((page) => (
      <MenuItem
        key={page.name}
        onClick={handleCloseMenu}
        className={styles.menuItem}
      >
        <Link
          className={`${params === `${page.path}` ? `${styles.active}` : ''}`}
          href={`${page.path}`}
        >
          {page.name}
        </Link>
      </MenuItem>
    ));
  };

  return (
    <ThemeProvider
      theme={createTheme({
        components: {
          MuiMenu: {
            styleOverrides: {
              root: {
                position: 'absolute',
              },
            },
          },
        },
      })}
    >
      {params !== '/' && !params.includes('/registrar') && (
        <AppBar className={styles.navbar} position="absolute">
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              <Link href="/menu">
                <Image src={Icons.LogoWhite} alt="Logo Gestão" />
              </Link>
              <Box
                sx={{
                  flexGrow: 1,
                  display: { xs: 'flex', md: 'none' },
                  placeContent: 'end',
                }}
              >
                <IconButton
                  size="large"
                  aria-label="opções de páginas de navegação"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleOpenMenu}
                >
                  <BiMenu className={styles.menu} />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorElNav}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseMenu}
                  sx={{
                    display: { xs: 'block', md: 'none' },
                  }}
                >
                  {renderMenuItems()}
                </Menu>
              </Box>
              <Box
                sx={{
                  flexGrow: 1,
                  display: { xs: 'none', md: 'flex' },
                  placeContent: 'center',
                }}
              >
                <ul className={styles.pagesList}>
                  {visiblePages.map((page) => (
                    <li
                      key={page.name}
                      className={styles.menuItem}
                      onClick={handleCloseMenu}
                    >
                      <Link
                        className={`${
                          params === `${page.path}` ? `${styles.active}` : ''
                        }`}
                        href={`${page.path}`}
                      >
                        {page.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </Box>
              <button onClick={logout} className={styles.logout}>
                Sair
              </button>
            </Toolbar>
          </Container>
        </AppBar>
      )}
    </ThemeProvider>
  );
};

export default Navbar;
