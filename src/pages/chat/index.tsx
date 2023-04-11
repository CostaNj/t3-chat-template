import { ChatPage } from '~/containers/pages/chat';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import nextI18nConfig from '../../../next-i18next.config.mjs';

export default ChatPage;

export const getServerSideProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'], nextI18nConfig)),
  },
});
