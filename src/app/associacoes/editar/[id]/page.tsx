import React from 'react';

import AssociacaoEditHome from '@/components/AssociacaoEdit';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

const Page = async ({ params }: Props) => {
  const { id } = await params;
  return <AssociacaoEditHome id={id} />;
};

export default Page;
