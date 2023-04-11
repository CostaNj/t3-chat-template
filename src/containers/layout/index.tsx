import React from 'react';
import Head from 'next/head';

import { Container } from './styles/layout.styles';

type LayoutProps = {
  children: React.ReactElement;
};

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Head>
        <title>Jams</title>
        <meta name="description" content="Jams" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container>{children}</Container>
    </>
  );
};
