import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
} from "next-auth";
// import Cookies, { Cookie } from 'cookies'
// import { encode, decode } from 'next-auth/jwt'
import VkProvider, { VkProfile } from "next-auth/providers/vk";
import CredentialsProvider from 'next-auth/providers/credentials';
import { objectToAuthDataMap, AuthDataValidator } from '@telegram-auth/server';
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { env } from "~/env.mjs";
import { prisma } from "~/server/db";
import { TELEGRAM_PROVIDER_ID } from "~/constants/providers"
// import {session} from "next-auth/core/routes";
// import { generateSessionToken, fromDate } from '~/utils/auth'

const maxAge = 30 * 24 * 60 * 60 // 30 days
const adapter = PrismaAdapter(prisma)

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  type UserRole = 'user' | 'admin' | 'moderator' | 'vip'

  interface Session extends DefaultSession {
    user: {
      id: string;
      //role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    session({ session, user, token }) {
      if(session.user) {
        session.user.id = user?.id ?? token?.sub
      }
      return session;
    },
    // signIn: async ({ user, account, profile }) => {
    //   console.log('signIn!!!!!!!!!!!!!!!!!')
    //   console.log('------------------------')
    //   console.log('user', user)
    //   console.log('account', account)
    //   console.log('profile', profile)
    //   console.log('------------------------')
    //
    //   if(account?.type === 'credentials' && account?.provider === TELEGRAM_PROVIDER_ID && user) {
    //     const sessionToken = generateSessionToken()
    //     const sessionExpiry = fromDate(maxAge)
    //
    //     await adapter.createSession({
    //       sessionToken: sessionToken,
    //       userId: user.id,
    //       expires: sessionExpiry
    //     })
    //
    //     // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call
    //     const cookies = new Cookies(req,res)
    //
    //     // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    //     cookies.set('next-auth.session-token', sessionToken, {
    //       expires: sessionExpiry
    //     })
    //   }
    //   return true
    // },
  },
  adapter,
  providers: [
    VkProvider<VkProfile>({
      clientId: env.VK_CLIENT_ID,
      clientSecret: env.VK_CLIENT_SECRET,
      token: {
        url: 'https://oauth.vk.com/access_token',
        async request(ctx) {
          const { client, provider, params, checks } = ctx
          const tokens = await client.oauthCallback(provider.callbackUrl, params, checks)
          if(tokens?.user_id) {
            delete tokens.user_id
          }
          return { tokens }
        }
      }
    }),

    CredentialsProvider({
      id: TELEGRAM_PROVIDER_ID,
      name: 'Telegram Login',
      credentials: {},
      authorize: async (credentials, req) => {

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const validator = new AuthDataValidator({ botToken: env.BOT_TOKEN });
            console.log('validator', validator)
            const data = objectToAuthDataMap(req.query || {});
            console.log('data', data)
            const telegramUser = await validator.validate(data);
            console.log('user', telegramUser)
        if (telegramUser.id && telegramUser.first_name) {
          try {
            const user = await prisma.user.findFirst({
              where: {
                accounts: {
                  some: {
                    providerAccountId: {
                      equals: telegramUser?.id?.toString()
                    }
                  }
                }
              },
            })

            console.log('user', user)

            if(user) {
              return user
            }

            const newUser = await prisma.user.create({
              data: {
                name: telegramUser?.first_name,
                email: '',
                image: telegramUser?.photo_url
              },
            });

            if(!newUser) {
              return null
            }

            const newAccount = await prisma.account.create({
              data: {
                userId: newUser.id,
                type: "credentials",
                provider: "telegram",
                providerAccountId: telegramUser?.id?.toString(),
                email: ''
              },
            })

            return newAccount ? newUser : null
          } catch (e) {
            console.log('error', e)
            return null
          }
        } else {
          return null
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  jwt: {
    maxAge,
    // encode: async (params) => {
    //   const nextauth = req?.query?.nextauth
    //   if (nextauth?.includes('callback') && nextauth?.includes('credentials') && req.method === 'POST') {
    //     // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call
    //     const cookies = new Cookies(req,res)
    //
    //     // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    //     const cookie = cookies.get('next-auth.session-token')
    //
    //     // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    //     if(cookie) return cookie; else return '';
    //
    //   }
    //   // Revert to default behaviour when not in the credentials provider callback flow
    //   return encode(params)
    // },
    // decode: async (params) => {
    //   const nextauth = req?.query?.nextauth
    //   if (nextauth?.includes('callback') && nextauth?.includes('credentials') && req.method === 'POST') {
    //     return null
    //   }
    //
    //   // Revert to default behaviour when not in the credentials provider callback flow
    //   return decode(params)
    // }
  },
}

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
