import React from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { Button } from '~/components/buttons/button';
import Image from 'next/image';
import {
  AuthorisedContainer,
  AuthShowcaseContainer,
} from '~/containers/auth-showcase/styles/auth-showcase.styles';
import { DEFAULT_AVATAR } from '~/constants/providers';
import { useTranslation } from 'next-i18next';

export const AuthShowcase: React.FC = () => {
  const { data: sessionData, status } = useSession();
  const [src, setSrc] = React.useState<string | null>(null);
  const { t } = useTranslation();

  console.log('sessionData', sessionData);
  if (status === 'loading') {
    console.log('loading');
    return null;
  }

  return (
    <AuthShowcaseContainer>
      {!sessionData && (
        <Button onClick={() => void signIn()}>{t('auth.signin')}</Button>
      )}
      {sessionData && (
        <AuthorisedContainer>
          {sessionData?.user?.image && (
            <Image
              alt="Avatar"
              src={src ?? sessionData?.user?.image}
              height={40}
              width={40}
              style={{
                objectFit: 'cover',
                borderRadius: 50,
              }}
              placeholder="blur"
              blurDataURL={DEFAULT_AVATAR}
              onError={() => setSrc(DEFAULT_AVATAR)}
            />
          )}
          <Button onClick={() => void signOut()}>{t('auth.signout')}</Button>
        </AuthorisedContainer>
      )}
    </AuthShowcaseContainer>
  );
};
