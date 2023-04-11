import { type GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { signIn, getCsrfToken, getProviders } from 'next-auth/react';
import { LoginButton, type TelegramAuthData } from '@telegram-auth/react';
import { TELEGRAM_PROVIDER_ID } from '~/constants/providers';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import nextI18nConfig from '../../../next-i18next.config.mjs';
import { env } from '~/env.mjs';

import { Button } from '~/components/buttons/button';

type SigninProps = {
  providers: Awaited<ReturnType<typeof getProviders>>;
  csrfToken?: string;
  botUsername: string;
  isDevelop: boolean;
};

/* eslint-disable */
const Signin = ({
  providers,
  csrfToken,
  botUsername,
  isDevelop,
}: SigninProps) => {
  const router = useRouter();
  const { callbackUrl } = router.query;
  const { t } = useTranslation();
  const handleTelegramResponse = async (response: TelegramAuthData) => {
    const data: Record<string, string> = {
      ...response,
      auth_date: response?.auth_date?.toString(),
      id: response?.id?.toString(),
    };
    await signIn(TELEGRAM_PROVIDER_ID, { callbackUrl: '/' }, data);
  };

  return (
    <div>
      <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
      {Object.values(providers || {}).map(provider => {
        return (
          <div key={provider.name}>
            {provider.id === TELEGRAM_PROVIDER_ID ? (
              <>
                {isDevelop ? (
                  <Button
                    onClick={() =>
                      signIn(TELEGRAM_PROVIDER_ID, { callbackUrl: '/' }, {})
                    }
                  >
                    {t(`auth.providers.telegram`)}
                  </Button>
                ) : (
                  <LoginButton
                    onAuthCallback={handleTelegramResponse}
                    botUsername={botUsername}
                    showAvatar
                    lang={router.locale}
                  />
                )}
              </>
            ) : (
              <>
                {/* Render other providers */}
                <Button
                  onClick={() =>
                    signIn(provider.id, {
                      callbackUrl:
                        typeof callbackUrl === 'string' ? callbackUrl : '/',
                    })
                  }
                >
                  {t(`auth.providers.${provider.id}`, {
                    defaultValue: t('auth.providers.default'),
                  })}
                </Button>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Signin;
/* eslint-enable */

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const providers = await getProviders();
  const csrfToken = await getCsrfToken(context);
  const botUsername = env.BOT_USERNAME;
  const isDevelop = env.NODE_ENV === 'development';
  return {
    props: {
      ...(await serverSideTranslations(
        context.locale as string,
        ['common'],
        nextI18nConfig,
      )),
      providers,
      csrfToken,
      botUsername,
      isDevelop,
    },
  };
}
