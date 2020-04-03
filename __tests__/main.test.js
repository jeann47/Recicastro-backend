/* eslint-disable no-undef */
import request from 'supertest';
// import factory from './util/factories';
import truncate from './util/truncate';
import app from '../src/app';

beforeEach(async () => {
  await truncate();
});

describe('init', () => {
  it('should work', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ ok: 'work' });
  });
});
