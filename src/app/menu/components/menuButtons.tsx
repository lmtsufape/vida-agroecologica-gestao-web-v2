import React from 'react';
import { TbHomeSearch } from 'react-icons/tb';
import { HiUsers } from 'react-icons/hi';
import { FaBuildingUser } from 'react-icons/fa6';
import { GrSchedules } from 'react-icons/gr';

import S from './styles.module.scss';
import Link from 'next/link';

const MenuOptions = () => {
  const menuOptions: Array<{ icon: any; name: string; route: string }> = [
    { icon: <TbHomeSearch />, name: 'Associação', route: '/associacoes' },
    { icon: <HiUsers />, name: 'Usuários', route: '/usuarios' },
    {
      icon: <FaBuildingUser />,
      name: 'Organização de Controle Social',
      route: '/ocs',
    },
    { icon: <GrSchedules />, name: 'Reuniões', route: '/reunioes' },
  ];
  return (
    <ul role="list" className={S.menuList}>
      {menuOptions.map((option) => (
        <li key={option.name} className={S.menuOption}>
          <Link href={option.route}>
            {option.icon}
            {option.name}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default MenuOptions;
