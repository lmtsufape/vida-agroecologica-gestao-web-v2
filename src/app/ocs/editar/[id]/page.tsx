import React from 'react';

import OcsEditHome from '@/components/OcsEdit';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

const Page = async ({ params }: Props) => {
  const { id } = await params;
  return <OcsEditHome id={id} />;
};

export default Page;
