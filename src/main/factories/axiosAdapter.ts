import { AxiosAdapter } from '@/infra/http/axiosAdapter';

export const makeAxiosAdapter = (): AxiosAdapter => {
  const telegramUrl = process.env.TELEGRAM_API;
  const botToken = process.env.BOT_TOKEN;

  const axiosAdapter = new AxiosAdapter(telegramUrl, botToken);

  return axiosAdapter;
};
