import React from 'react';

import OcsParticipantsHome from '@/components/OcsParticipants';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

const Page = async ({ params }: Props) => {
  const { id } = await params;
  return <OcsParticipantsHome id={id} />;
};

export default Page;
