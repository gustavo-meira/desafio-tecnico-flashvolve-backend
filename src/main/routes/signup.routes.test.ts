import request from 'supertest';
import { app } from '../config/app';

jest.mock('../../infra/db/prisma/lib/db', () => ({
  prismaDB: {
    user: {
      async create () {
        await new Promise((resolve) => setTimeout(resolve, 1));

        return {
          id: 'any_id',
          name: 'any_name',
          email: 'any_email@email.com',
          password: 'any_password',
        };
      },
    },
  },
}));

describe('SignUp Routes', () => {
  it('Should return a 201 status code on success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      })
      .expect(201);
  });
});
