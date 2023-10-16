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

describe('Auth Routes', () => {
  describe('POST /api/signup', () => {
    it('Should return a 201 status code on SignUp success', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          ...accountData,
          passwordConfirmation: accountData.password,
        })
        .expect(201);
    });

    it('Should return a 400 if no name is provided on SignUp', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          email: accountData.email,
          password: accountData.password,
          passwordConfirmation: accountData.password,
        })
        .expect(400);
    });

    it('Should return a 400 if no email is provided on SignUp', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: accountData.name,
          password: accountData.password,
          passwordConfirmation: accountData.password,
        })
        .expect(400);
    });

    it('Should return a 400 if no password is provided on SignUp', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: accountData.name,
          email: accountData.email,
          passwordConfirmation: accountData.password,
        })
        .expect(400);
    });

    it('Should return a 400 if no passwordConfirmation is provided on SignUp', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: accountData.name,
          email: accountData.email,
          password: accountData.password,
        })
        .expect(400);
    });

    it('Should return a 400 if passwordConfirmation fails on SignUp', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          ...accountData,
          passwordConfirmation: chance.string(),
        })
        .expect(400);
    });

    it('Should return a 400 if an invalid email is provided on SignUp', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          ...accountData,
          email: chance.string(),
        })
        .expect(400);
    });
  });
});
