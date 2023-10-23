import { type MessageModel } from '@/domain/models/message';
import { AxiosAdapter } from './axiosAdapter';
import axios from 'axios';
import Chance from 'chance';

const chance = new Chance();

const url = chance.url();
const botToken = chance.string({ length: 12 });

const urlToPost = `${url}/bot${botToken}/sendMessage`;

const messageToSend: MessageModel = {
  id: chance.integer(),
  chatId: chance.integer(),
  fromBot: chance.bool(),
  senderName: chance.name(),
  text: chance.string(),
  createdAt: chance.date(),
  updatedAt: chance.date(),
};

jest.mock('axios', () => ({
  async post (): Promise<void> {
    await Promise.resolve();
  },
}));

const makeSut = (): AxiosAdapter => {
  const sut = new AxiosAdapter(url, botToken);

  return sut;
};

describe('Axios Adapter', () => {
  it('Should call axios with correct url and body', async () => {
    const sut = makeSut();
    const postSpy = jest.spyOn(axios, 'post');

    await sut.postMessage(messageToSend);
    expect(postSpy).toHaveBeenCalledWith(urlToPost, {
      chat_id: messageToSend.chatId,
      text: messageToSend.text,
    });
  });

  it('Should throw if axios throws', async () => {
    const sut = makeSut();
    jest.spyOn(axios, 'post').mockRejectedValueOnce(new Error());

    const promise = sut.postMessage(messageToSend);
    await expect(promise).rejects.toThrow();
  });
});
