import React from 'react';
import { type NextPage } from 'next';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import nextI18nConfig from '../../next-i18next.config.mjs';

import { Button } from '~/components/buttons/button';
import { AuthShowcase } from '~/containers/auth-showcase';
import { HomeAuthContainer } from '~/containers/pages/home/styles/home.styles';

const Home: NextPage = () => {
  const { data: sessionData } = useSession();
  const { t } = useTranslation();
  return (
    <HomeAuthContainer>
      <AuthShowcase />
      {sessionData && (
        <Link href="/chat">
          <Button>{t('navigation.chat')}</Button>
        </Link>
      )}
    </HomeAuthContainer>
  );
};

export default Home;

export const getServerSideProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'], nextI18nConfig)),
  },
});
