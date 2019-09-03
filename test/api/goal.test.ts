import request from 'supertest';
import app from '../../src/app';
import { DB_TABLE } from '../../src/constants';
import db from '../../src/dbConnection';
import goalsData from '../../seed/goals.json';

describe('Goals API', () => {
  beforeAll(async () => {
    await db(DB_TABLE.GOALS).insert(goalsData);
  });

  afterAll(async () => {
    await db.raw(`truncate table ${DB_TABLE.GOALS} RESTART IDENTITY CASCADE`);
  });

  describe('GET `/goals`', () => {
    it('should fetch all goals', async () => {
      const { body } = await request(app)
        .get('/goals')
        .expect(200);

      const { goals } = body.data;

      expect(goals.length).toBe(goalsData.length);
    });
  });

  describe('GET `/goals/{goal_id}`', () => {
    it('should fetch a correct goal with given id', async () => {
      const goalId = 2;
      const { body } = await request(app)
        .get(`/goals/${goalId}`)
        .expect(200);

      expect(body.data.goal.name).toBe(goalsData[goalId - 1].name);
    });

    it('should also fetch deleted goal', async () => {
      const goalId = 3;
      const { body } = await request(app)
        .get(`/goals/${goalId}`)
        .expect(200);

      expect(body.data.goal.name).toBe(goalsData[goalId - 1].name);
    });

    it('should throw 404 for invalid goal_id', async () => {
      await request(app)
        .get('/goals/404')
        .expect(404);
    });
  });

  describe('POST `/goals`', () => {
    it('should create a new goal', async () => {
      const data = {
        name: 'goal_new'
      };

      const { body } = await request(app)
        .post('/goals')
        .send(data)
        .set('Accept', 'application/json')
        .expect(201);

      const goalId = body.data.id;

      expect(goalId).toBeTruthy();

      const { body: resBody } = await request(app).get(`/goals/${goalId}`);

      const goal = resBody.data.goal;

      expect(goal).toMatchObject(data);
    });
  });

  describe('PUT `/goals/{goal_id}`', () => {
    it('should update an existing goal', async () => {
      // Create new goal
      const data = {
        name: 'goal_new'
      };

      const { body } = await request(app)
        .post('/goals')
        .send(data)
        .set('Accept', 'application/json')
        .expect(201);

      const goalId = body.data.id;

      // Update the goal
      const updatedData = {
        name: 'goal_new_updated'
      };

      await request(app)
        .put(`/goals/${goalId}`)
        .send(updatedData)
        .set('Accept', 'application/json')
        .expect(200);

      // Fetch the updated goal again
      const { body: updatedBody } = await request(app).get(`/goals/${goalId}`);

      const goal = updatedBody.data.goal;

      expect(goal).toMatchObject(updatedData);
    });
  });
});
