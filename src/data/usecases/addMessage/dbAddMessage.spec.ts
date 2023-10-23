import { type AddMessageRepository } from '@/data/protocols/addMessageRepository';
import { type MessageModel } from '@/domain/models/message';
import { type AddMessageModel } from '@/domain/useCases/addMessage';
import Chance from 'chance';
import { DbAddMessage } from './dbAddMessage';
import { type AddChatRepository } from '@/data/protocols/addChatRepository';
import { type AddChatModel } from '@/domain/useCases/addChat';
import { type ChatModel } from '@/domain/models/chat';
import { type PostMessage } from '@/data/protocols/postMessage';

const chance = new Chance();

const messageData = {
  text: chance.string(),
  senderName: chance.name(),
  fromBot: chance.bool(),
  chatId: chance.integer({ min: 1000, max: 9999 }),
};

const messageToResponse: MessageModel = {
  ...messageData,
  id: chance.integer({ min: 1000, max: 9999 }),
  createdAt: chance.date(),
  updatedAt: chance.date(),
};

const chatData: AddChatModel = {
  id: messageData.chatId,
  lastMessage: messageData.text,
  name: messageData.senderName,
};

const chatToResponse: ChatModel = {
  ...chatData,
  createdAt: chance.date(),
  updatedAt: chance.date(),
};

const makePostMessage = (): PostMessage => {
  class PostMessageStub implements PostMessage {
    async postMessage (message: MessageModel): Promise<void> {
      await Promise.resolve();
    }
  }

  return new PostMessageStub();
};

const makeAddChatRepository = (): AddChatRepository => {
  class AddChatRepositoryStub implements AddChatRepository {
    async add (chatData: AddChatModel): Promise<ChatModel> {
      return await Promise.resolve(chatToResponse);
    }
  }

  return new AddChatRepositoryStub();
};

const makeAddMessageRepository = (): AddMessageRepository => {
  class AddMessageRepositoryStub implements AddMessageRepository {
    async add (messageData: AddMessageModel): Promise<MessageModel> {
      return await Promise.resolve(messageToResponse);
    }
  }

  return new AddMessageRepositoryStub();
};

interface SutTypes {
  sut: DbAddMessage;
  addMessageRepositoryStub: AddMessageRepository;
  addChatRepositoryStub: AddChatRepository;
  postMessageStub: PostMessage;
}

const makeSut = (): SutTypes => {
  const addMessageRepositoryStub = makeAddMessageRepository();
  const addChatRepositoryStub = makeAddChatRepository();
  const postMessageStub = makePostMessage();
  const sut = new DbAddMessage(addMessageRepositoryStub, addChatRepositoryStub, postMessageStub);

  return {
    sut,
    addMessageRepositoryStub,
    addChatRepositoryStub,
    postMessageStub,
  };
};

describe('DbAddMessage UseCase', () => {
  it('Should call AddMessageRepository with correct values', async () => {
    const { sut, addMessageRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addMessageRepositoryStub, 'add');

    await sut.add(messageData);
    expect(addSpy).toHaveBeenCalledWith(messageData);
  });

  it('Should throw if AddMessageRepository throws', async () => {
    const { sut, addMessageRepositoryStub } = makeSut();
    jest.spyOn(addMessageRepositoryStub, 'add').mockRejectedValueOnce(new Error());

    const promise = sut.add(messageData);
    await expect(promise).rejects.toThrow();
  });

  it('Should return the created message on success', async () => {
    const { sut } = makeSut();

    const message = await sut.add(messageData);
    expect(message).toEqual(messageToResponse);
  });

  it('Should call AddChatRepository with correct values', async () => {
    const { sut, addChatRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addChatRepositoryStub, 'add');

    await sut.add(messageData);
    expect(addSpy).toHaveBeenCalledWith(chatData);
  });

  it('Should call postMessage if message is from bot', async () => {
    const { sut, postMessageStub } = makeSut();
    const postSpy = jest.spyOn(postMessageStub, 'postMessage');

    await sut.add({ ...messageData, fromBot: true });
    expect(postSpy).toHaveBeenCalledWith(messageToResponse);
  });

  it('Should not call postMessage if message is not from bot', async () => {
    const { sut, postMessageStub } = makeSut();
    const postSpy = jest.spyOn(postMessageStub, 'postMessage');

    await sut.add({ ...messageData, fromBot: false });
    expect(postSpy).not.toHaveBeenCalled();
  });

  it('Should throw if AddChatRepository throws', async () => {
    const { sut, addChatRepositoryStub } = makeSut();
    jest.spyOn(addChatRepositoryStub, 'add').mockRejectedValueOnce(new Error());

    const promise = sut.add(messageData);
    await expect(promise).rejects.toThrow();
  });

  it('Should throw if AddChatRepository throws', async () => {
    const { sut, addChatRepositoryStub } = makeSut();
    jest.spyOn(addChatRepositoryStub, 'add').mockRejectedValueOnce(new Error());

    const promise = sut.add(messageData);
    await expect(promise).rejects.toThrow();
  });
});
