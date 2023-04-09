import React from 'react';
import { type NextPage } from 'next';
import Head from 'next/head';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

import { Button } from '~/components/buttons/button';
import { AuthShowcase } from '~/containers/auth-showcase';
import { HomeAuthContainer } from '~/containers/pages/home/styles/home.styles';

const Home: NextPage = () => {
  const { data: sessionData } = useSession();
  return (
    <>
      <Head>
        <title>Jams</title>
        <meta name="description" content="Jams" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <HomeAuthContainer>
        <AuthShowcase />
        {sessionData && (
          <Link href="/chat">
            <Button>Chat</Button>
          </Link>
        )}
      </HomeAuthContainer>
    </>
  );
};

export default Home;
