import { type DefaultSession } from "next-auth";
import { type UserRole } from "@prisma/client";

declare module 'next-auth/jwt' {
  interface JWT {
    id: string,
    role: UserRole;
  }
}

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: UserRole;
    } & DefaultSession["user"];
  }

  interface User {
    role: UserRole;
  }
}

declare module 'react-telegram-login';