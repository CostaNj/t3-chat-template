import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
} from "next-auth";
import VkProvider, { VkProfile } from "next-auth/providers/vk";
import CredentialsProvider from 'next-auth/providers/credentials';
import { objectToAuthDataMap, AuthDataValidator } from '@telegram-auth/server';
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { env } from "~/env.mjs";
import { prisma } from "~/server/db";

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
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        //session.user.role = user.role
      }
      return session;
    },
  },
  adapter: PrismaAdapter(prisma),
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
      id: 'telegram-login',
      name: 'Telegram Login',
      credentials: {},
      async authorize(credentials, req) {
        const validator = new AuthDataValidator({ botToken: `${process.env.BOT_TOKEN}` });
        console.log('validator', validator)
        const data = objectToAuthDataMap(req.query || {});
        console.log('data', data)
        const user = await validator.validate(data);
        console.log('user', user)
        if (user.id && user.first_name) {
          return {
            id: user.id.toString(),
            name: [user.first_name, user.last_name || ''].join(' '),
            image: user.photo_url
          };
        }

        return null;
      },
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
};

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
