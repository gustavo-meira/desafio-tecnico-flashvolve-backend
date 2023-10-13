import request from 'supertest';
import { app } from '../config/app';

describe('ContentType Middleware', () => {
  it('Should return content type as json', async () => {
    app.get('/test_content_type', (req, res) => {
      res.send();
    });

    await request(app)
      .get('/test_content_type')
      .expect('Content-Type', /json/);
  });
});
