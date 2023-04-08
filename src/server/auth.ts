import { type GetServerSidePropsContext } from "next";
import { getServerSession, type NextAuthOptions } from "next-auth";
import VkProvider, { type VkProfile } from "next-auth/providers/vk";
import CredentialsProvider from 'next-auth/providers/credentials';
import { objectToAuthDataMap, AuthDataValidator, type TelegramUserData } from '@telegram-auth/server';
import { PrismaAdapter } from "@next-auth/prisma-adapter";

import { env } from "~/env.mjs";
import { prisma } from "~/server/db";
import { MOCK_TELEGRAM_USER, TELEGRAM_PROVIDER_ID } from "~/constants/providers"

const maxAge = 30 * 24 * 60 * 60 // 30 days
const adapter = PrismaAdapter(prisma)

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    session({ session, token }) {
      if(token) {
        session.user.id = token?.id
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        session.user.role = token?.role
      }
      return session;
    },
    jwt({ token, user}) {
      if(user) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        token.role = user?.role
        token.id = user?.id
      }
      return token
    },
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
      },
    }),
    CredentialsProvider({
      id: TELEGRAM_PROVIDER_ID,
      name: 'Telegram Login',
      credentials: {},
      authorize: async (credentials, req) => {

        let telegramUser: TelegramUserData

        if(env.NODE_ENV === "development") {
          telegramUser = MOCK_TELEGRAM_USER
        } else {
          //eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const validator = new AuthDataValidator({ botToken: env.BOT_TOKEN });
          const data = objectToAuthDataMap(req.query || {});
          telegramUser = await validator.validate(data);
        }

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

            if(user) {
              return user
            }

            const newUser = await prisma.user.create({
              data: {
                name: telegramUser?.first_name,
                email: null,
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
                email: '',
                access_token: env.BOT_TOKEN,
                expires_at: maxAge
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
  },
}

export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
