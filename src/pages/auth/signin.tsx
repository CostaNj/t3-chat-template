import { type GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { signIn, getCsrfToken, getProviders } from 'next-auth/react';
import { LoginButton, type TelegramAuthData } from '@telegram-auth/react';
import { TELEGRAM_PROVIDER_ID } from "~/constants/providers"

type SigninProps = {
  providers: Awaited<ReturnType<typeof getProviders>>;
  csrfToken?: string;
  botUsername: string;
}

/* eslint-disable */
const Signin = ({ providers, csrfToken, botUsername }: SigninProps) => {

  const { callbackUrl }  = useRouter().query
  const handleTelegramResponse = async (response: TelegramAuthData) => {
    console.log('response', response)
    const data: Record<string, string> = {
      ...response,
      auth_date: response?.auth_date?.toString(),
      id: response?.id?.toString()
    }
    console.log('data', data)
    await signIn(TELEGRAM_PROVIDER_ID, { callbackUrl: '/' }, data);
  }
  console.log('providers', providers)
  console.log('callbackUrl', callbackUrl)

  return (
    <div>
        <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
        {Object.values(providers || {}).map((provider) => {
          return (
            <div key={provider.name}>
              {provider.id === TELEGRAM_PROVIDER_ID ? (
                <>
                  <LoginButton onAuthCallback={handleTelegramResponse} botUsername={botUsername} showAvatar/>
                </>
              ) : (
                <>
                  {/* Render other providers */}
                  <button onClick={() => signIn(provider.id, {
                    callbackUrl: typeof callbackUrl === 'string' ? callbackUrl : '/'
                  })
                  }>
                    Sign in with {provider.name}
                  </button>
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
  const botUsername = process.env.BOT_USERNAME;
  return {
    props: {
      providers,
      csrfToken,
      botUsername,
    },
  };
}
