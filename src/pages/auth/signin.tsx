import { GetServerSidePropsContext } from 'next';
import { signIn, getCsrfToken, getProviders } from 'next-auth/react';
import TelegramLoginButton from 'react-telegram-login';


type SigninProps = {
  providers: Awaited<ReturnType<typeof getProviders>>;
  csrfToken?: string;
  botUsername: string;
}

type TelegramResponse = {
  auth_date: number;
  first_name: string;
  hash: string;
  id: number;
  last_name: string;
  photo_url: string;
  username: string;
}

const TelegramProviderId = 'telegram-login'
const Signin = ({ providers, csrfToken, botUsername }: SigninProps) => {

  const handleTelegramResponse = async (response: TelegramResponse) => {
    console.log('response', response)
    const data: Record<string, string> = {
      ...response,
      auth_date: response?.auth_date?.toString(),
      id: response?.id?.toString()
    }
    console.log('data', data)
    await signIn(TelegramProviderId, { callbackUrl: '/' }, data);
  }

  return (
    <div>
        <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
        {Object.values(providers || {}).map((provider) => {
          return (
            <div key={provider.name}>
              {provider.id === TelegramProviderId ? (
                <>
                  <TelegramLoginButton dataOnauth={handleTelegramResponse} botName={botUsername} />
                </>
              ) : (
                <>
                  {/* Render other providers */}
                  <button onClick={() => signIn(provider.id)}>Sign in with {provider.name}</button>
                </>
              )}
            </div>
          );
        })}
    </div>
  );
};

export default Signin;

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
