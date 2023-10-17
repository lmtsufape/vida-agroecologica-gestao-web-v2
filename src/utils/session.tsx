'use client';

import { redirect } from 'next/navigation';
import React from 'react';

export default function Authentication(Component: any) {
  return function Authentication(props: any) {
    const session = localStorage.getItem('@token');
    React.useEffect(() => {
      if (!session) {
        redirect('/login');
      }
    }, []);

    if (!session) {
      return null;
    }
    return <Component {...props} />;
  };
}
