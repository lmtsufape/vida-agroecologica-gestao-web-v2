/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { redirect } from 'next/navigation';
import React from 'react';

export default function Authentication(Component: any) {
  return function Authentication(props: any) {
    const [session, setSession] = React.useState<string | null>(null);

    React.useEffect(() => {
      const session = localStorage.getItem('@token');
      const rolesString = localStorage.getItem('@roles');
      const roles = rolesString ? JSON.parse(rolesString) : '';
      const filter = roles.map((item: { id: number }) => item.id);

      setSession(session);

      if (!session) {
        redirect('/');
      }
      // if (filter.includes(5) || filter.includes(4)) {
      //   redirect('/default');
      // }
    }, []);

    if (!session) {
      return null;
    }
    return <Component {...props} />;
  };
}
