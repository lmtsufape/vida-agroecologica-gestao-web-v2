import Link from 'next/link';
import React from 'react';

import S from './styles.module.scss';

const StyledLink: React.FC<{ text: string; href: string }> = ({
  text,
  ...props
}) => {
  return (
    <Link {...props} className={S.link}>
      {text}
    </Link>
  );
};
export default StyledLink;
