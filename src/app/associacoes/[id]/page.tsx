import React from 'react';

import AssociacaoHome from '@/components/Associacao';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

const Page = async ({ params }: Props) => {
  const { id } = await params;
  return <AssociacaoHome id={id} />;
};

export default Page;
