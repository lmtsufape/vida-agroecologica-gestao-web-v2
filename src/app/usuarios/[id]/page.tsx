import React from 'react';

import UsuarioHome from '@/components/Usuario';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

const Page = async ({ params }: Props) => {
  const { id } = await params;
  return <UsuarioHome id={id} />;
};

export default Page;
