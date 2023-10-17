import { type AddMessageRepository } from '@/data/protocols/addMessageRepository';
import { type MessageModel } from '@/domain/models/message';
import { type AddMessageModel } from '@/domain/useCases/addMessage';
import Chance from 'chance';
import { DbAddMessage } from './dbAddMessage';

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
}

const makeSut = (): SutTypes => {
  const addMessageRepositoryStub = makeAddMessageRepository();
  const sut = new DbAddMessage(addMessageRepositoryStub);

  return {
    sut,
    addMessageRepositoryStub,
  };
};

describe('DbAddMessage UseCase', () => {
  it('Should call AddMessageRepository with correct values', async () => {
    const { sut, addMessageRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addMessageRepositoryStub, 'add');

    await sut.add(messageData);
    expect(addSpy).toHaveBeenCalledWith(messageData);
  });
});
