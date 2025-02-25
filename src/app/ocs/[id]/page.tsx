import React from 'react';

import OcsHome from '@/components/Ocs';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

const Page = async ({ params }: Props) => {
  const { id } = await params;
  return <OcsHome id={id} />;
};

export default Page;
