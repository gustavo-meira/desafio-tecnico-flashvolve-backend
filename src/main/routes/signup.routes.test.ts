import request from 'supertest';
import { app } from '../config/app';
import Chance from 'chance';

const chance = new Chance();

const accountData = {
  name: chance.name(),
  email: chance.email(),
  password: chance.string(),
};

const accountDataWithId = {
  id: chance.guid(),
  ...accountData,
};

jest.mock('../../infra/db/prisma/lib/db', () => ({
  prismaDB: {
    user: {
      async create () {
        await new Promise((resolve) => setTimeout(resolve, 1));

        return accountDataWithId;
      },
    },
  },
}));

describe('SignUp Routes', () => {
  it('Should return a 201 status code on success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        ...accountData,
        passwordConfirmation: accountData.password,
      })
      .expect(201);
  });
});
