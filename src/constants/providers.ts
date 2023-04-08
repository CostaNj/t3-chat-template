import { type TelegramUserData } from "@telegram-auth/server";

export const TELEGRAM_PROVIDER_ID = 'telegram'

export const DEFAULT_AVATAR = 'https://static.thenounproject.com/png/5034901-200.png'
export const MOCK_TELEGRAM_USER: TelegramUserData = {
  id: 12345,
  first_name: 'Telegram User',
  photo_url: DEFAULT_AVATAR
}
