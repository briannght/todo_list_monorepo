import request from 'supertest';
import app from './app';
import { MOCK_DUTIES } from './constants/data';

describe('GET /duties', () => {
  it('should return all duties', async () => {
    return request(app)
      .get('/duties')
      .then((res) => {
        const statusCode = res.statusCode;
        const text = res.text;
        const json = JSON.parse(text);
        const filteredJson = json.map(({ id, created_at, ...args }) => args);

        expect(statusCode).toBe(200);
        expect(JSON.stringify(filteredJson)).toBe(JSON.stringify(MOCK_DUTIES));
      });
  });

  it('should create new duty', async () => {
    const data = {
      title: 'demo title',
      description: 'demo description',
      assignee: 'demo assignee',
      creator: 'demo creator',
      priority: 'high',
      status: 'todo',
    };

    return request(app)
      .post('/duties')
      .send(data)
      .then((res) => {
        const statusCode = res.statusCode;
        const text = res.text;
        const json = JSON.parse(text);
        const filteredJson = [json].map(({ id, created_at, ...args }) => args);

        expect(statusCode).toBe(201);
        expect(JSON.stringify(filteredJson)).toBe(JSON.stringify([data]));
      });
  });

  it('should update the first duty', async () => {
    const data = {
      title: 'demo title (update)',
      description: 'demo description (update)',
      assignee: 'demo assignee (update)',
      creator: 'demo creator (update)',
      priority: 'low',
      status: 'done',
    };

    return request(app)
      .put('/duties/1')
      .send(data)
      .then((res) => {
        const statusCode = res.statusCode;
        const text = res.text;
        const json = JSON.parse(text);
        const filteredJson = [json].map(({ id, created_at, ...args }) => args);

        expect(statusCode).toBe(200);
        expect(JSON.stringify(filteredJson)).toBe(JSON.stringify([data]));
      });
  });

  it('should delete the second duty', async () => {
    return request(app)
      .delete('/duties/2')
      .then((res) => {
        const statusCode = res.statusCode;
        expect(statusCode).toBe(204);
      });
  });
});
