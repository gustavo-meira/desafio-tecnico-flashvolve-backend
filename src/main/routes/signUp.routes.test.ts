import request from 'supertest';
import { app } from '../config/app';

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
