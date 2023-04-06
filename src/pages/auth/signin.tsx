import { type GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { signIn, getCsrfToken, getProviders } from 'next-auth/react';
import { LoginButton, type TelegramAuthData } from '@telegram-auth/react';
import { TELEGRAM_PROVIDER_ID } from "~/constants/providers";
import { env } from "~/env.mjs";


type SigninProps = {
  providers: Awaited<ReturnType<typeof getProviders>>;
  csrfToken?: string;
  botUsername: string;
  isDevelop: boolean;
}

/* eslint-disable */
const Signin = ({ providers, csrfToken, botUsername, isDevelop }: SigninProps) => {

  const { callbackUrl }  = useRouter().query
  const handleTelegramResponse = async (response: TelegramAuthData) => {
    const data: Record<string, string> = {
      ...response,
      auth_date: response?.auth_date?.toString(),
      id: response?.id?.toString()
    }
    await signIn(TELEGRAM_PROVIDER_ID, { callbackUrl: '/' }, data);
  }

  return (
    <div>
        <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
        {Object.values(providers || {}).map((provider) => {
          return (
            <div key={provider.name}>
              {provider.id === TELEGRAM_PROVIDER_ID ? (
                <>
                  {
                    isDevelop ?
                      <button onClick={() => signIn(TELEGRAM_PROVIDER_ID, { callbackUrl: '/'}, {})}>
                        Sign in with {TELEGRAM_PROVIDER_ID}
                      </button> :
                      <LoginButton onAuthCallback={handleTelegramResponse} botUsername={botUsername} showAvatar/>
                  }
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
  const botUsername = env.BOT_USERNAME;
  const isDevelop = env.NODE_ENV === 'development';
  return {
    props: {
      providers,
      csrfToken,
      botUsername,
      isDevelop
    },
  };
}
