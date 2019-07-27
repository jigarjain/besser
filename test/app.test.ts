import request from 'supertest';
import app from '../src/app';

describe('App', () => {
  it('should resolve successfully on GET /', done => {
    request(app)
      .get('/')
      .expect(200, done);
  });

  it('should throw error on GET /random', done => {
    request(app)
      .get('/random')
      .expect(404, done);
  });
});
