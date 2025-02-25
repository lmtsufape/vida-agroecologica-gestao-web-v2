import React from 'react';

import ReuniaoEditHome from '@/components/ReuniaoEdit';

type Props = {
  params: Promise<{
    id: number;
  }>;
};

const Page = async ({ params }: Props) => {
  const { id } = await params;
  return <ReuniaoEditHome id={id} />;
};

export default Page;
