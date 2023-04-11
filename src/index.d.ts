import { type DefaultSession } from 'next-auth';
import { type UserRole } from '@prisma/client';

// ---------- common ----------

declare module 'react-telegram-login';

// ---------- next-auth ----------
declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: UserRole;
  }
}

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: UserRole;
    } & DefaultSession['user'];
  }

  interface User {
    role: UserRole;
  }
}

// ---------- i18next ----------

import 'react-i18next';
import 'i18next';

import type common from '../public/locales/en/common.json';

interface I18nNamespaces {
  common: typeof common;
}

declare module 'i18next' {
  interface CustomTypeOptions {
    returnNull: false;
    defaultNS: 'common';
    resources: I18nNamespaces;
  }
}
