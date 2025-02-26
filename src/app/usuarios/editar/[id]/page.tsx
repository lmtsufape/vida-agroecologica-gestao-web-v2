import React from 'react';

import UsuarioEditHome from '@/components/UsuarioEdit';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

const Page = async ({ params }: Props) => {
  const { id } = await params;
  return <UsuarioEditHome id={id} />;
};

export default Page;
