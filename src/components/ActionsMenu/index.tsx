import Link from 'next/link';
import React from 'react';

import { IoMenu } from 'react-icons/io5';

import { IconButton, Menu, MenuItem } from '@mui/material';

interface Action {
  icon: React.ReactNode;
  text: string;
  onClick?: () => void;
  href?: string;
  color?: string;
}

interface ActionsMenuProps {
  actions: Action[];
}

const ActionsMenu: React.FC<ActionsMenuProps> = ({ actions }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClickAction = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseAction = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        aria-label="mais ações"
        size="small"
        onClick={handleClickAction}
      >
        <IoMenu />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleCloseAction}>
        {actions.map((action, index) => (
          <MenuItem
            key={index}
            onClick={() => {
              if (action.onClick) action.onClick();
              handleCloseAction();
            }}
          >
            {action.href ? (
              <Link
                href={action.href}
                style={{
                  textDecoration: 'none',
                  color: action.color || 'inherit',
                }}
              >
                {action.icon} {action.text}
              </Link>
            ) : (
              <div style={{ color: action.color || 'inherit' }}>
                {action.icon} {action.text}
              </div>
            )}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default ActionsMenu;
