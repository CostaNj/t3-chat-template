import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { Reset } from 'styled-reset'

import { api } from "~/utils/api";
import { Layout } from '~/containers/layout'

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
	  <>
		  <Reset/>
		  <SessionProvider session={session}>
			  <Layout>
				  <Component {...pageProps} />
			  </Layout>
		  </SessionProvider>
	  </>
  );
};

export default api.withTRPC(MyApp);
