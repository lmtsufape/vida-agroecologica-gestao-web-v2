import React from 'react';

import ReuniaoHome from '@/components/Reuniao';

type Props = {
  params: Promise<{
    id: number;
  }>;
};

const Page = async ({ params }: Props) => {
  const { id } = await params;
  return <ReuniaoHome id={id} />;
};

export default Page;
