'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as React from 'react';
/*import { BiMenu } from 'react-icons/bi';*/

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

const Navbar = () => {
  const params = usePathname();
  const [userId, setUserId] = React.useState<string | null>(null);

  React.useEffect(() => {
    setUserId(localStorage.getItem('userId'));
  }, []);

  const perfil = () => {
    if (userId) {
      window.location.href = `/perfil/${userId}`;
    } else {
      alert('Usuário não identificado.');
    }
  };

  const [anchorElProfile, setAnchorElProfile] =
    React.useState<null | HTMLElement>(null);

  const handleOpenProfileMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElProfile(event.currentTarget);
  };

  /* ta gerando erro no lint essa parte o codigo
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null,
  );
  
  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    anchorElNav; o erro esta aqui pq nao esta atribuindo nada ao anchorElNav
    setAnchorElNav(event.currentTarget);
  };
  */

  const logout = () => {
    localStorage.clear();
    window.location.href = '/';
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
      <AppBar className={styles.navbar} position="absolute">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Link href={userId ? '/menu' : '/'}>
              <Image src={Icons.Logo} alt="Logo Gestão" />
            </Link>
            <h1>Gestão</h1>
            <Box
              sx={{
                flexGrow: 1,
                display: { xs: 'flex', md: 'none' },
                placeContent: 'end',
              }}
            >
              {/* no momento esse botao na apresenta nenhuma funcao
              <IconButton
                size="large"
                aria-label="opções de páginas de navegação"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenMenu}
              >
                <BiMenu className={styles.menu} />
              </IconButton>
              */}
            </Box>
            {params !== '/' && !params.includes('/registrar') && (
              <Box
                sx={{
                  display: { xs: 'none', md: 'flex' },
                  alignItems: 'center',
                  marginLeft: 'auto',
                }}
              >
                <IconButton
                  size="large"
                  aria-label="menu do perfil"
                  aria-controls="profile-menu"
                  aria-haspopup="true"
                  onClick={handleOpenProfileMenu}
                >
                  <Image src={Icons.Perfil} alt="Perfil" />
                </IconButton>
                <Menu
                  id="profile-menu"
                  anchorEl={anchorElProfile}
                  open={Boolean(anchorElProfile)}
                  onClose={() => setAnchorElProfile(null)}
                >
                  <MenuItem onClick={perfil}> Perfil</MenuItem>
                  <MenuItem onClick={logout}>Sair</MenuItem>
                </Menu>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>
    </ThemeProvider>
  );
};

export default Navbar;
