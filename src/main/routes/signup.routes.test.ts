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

  it('Should return a 400 if no name is provided', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        email: accountData.email,
        password: accountData.password,
        passwordConfirmation: accountData.password,
      })
      .expect(400);
  });

  it('Should return a 400 if no email is provided', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: accountData.name,
        password: accountData.password,
        passwordConfirmation: accountData.password,
      })
      .expect(400);
  });
});
