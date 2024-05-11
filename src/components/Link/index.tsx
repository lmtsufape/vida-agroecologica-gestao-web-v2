import Link from 'next/link';
import React from 'react';

import S from './styles.module.scss';

interface StyledLinkProps {
  text: string;
  href?: string;
  onClick?: () => void;
}

const StyledLink: React.FC<StyledLinkProps> = ({ text, href, onClick }) => {
  if (href) {
    return (
      <Link href={href} className={S.link}>
        {text}
      </Link>
    );
  }
  return (
    <button className={S.link} onClick={onClick}>
      {text}
    </button>
  );
};

export default StyledLink;
