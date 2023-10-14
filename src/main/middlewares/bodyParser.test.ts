import request from 'supertest';
import { app } from '../config/app';
import Chance from 'chance';

const chance = new Chance();

describe('BodyParser Middleware', () => {
  it('Should parse body as json', async () => {
    const name = chance.name();
    app.post('/test_body_parser', (req, res) => {
      res.send(req.body);
    });

    await request(app)
      .post('/test_body_parser')
      .send({ name })
      .expect({ name });
  });
});
