import request from 'supertest';
import app from '../../src/app';
import { DB_TABLE } from '../../src/constants';
import db from '../../src/dbConnection';
// @ts-ignore
import experimentsData from '../../seed/experiments.json';

describe('Experiment API', () => {
  beforeAll(async () => {
    await db(DB_TABLE.EXPERIMENTS).insert(experimentsData);
  });

  afterAll(async () => {
    await db.raw(
      `truncate table ${DB_TABLE.EXPERIMENTS} RESTART IDENTITY CASCADE`
    );
  });

  describe('GET `/experiments`', () => {
    it('should fetch all experiments', async () => {
      const { body } = await request(app)
        .get('/experiments')
        .expect(200);

      const { experiments } = body.data;

      expect(experiments.length).toBe(experimentsData.length);
    });
  });

  describe('GET `/experiments/{experiment_id}`', () => {
    it('should fetch a correct experiment with given id', async () => {
      const expId = 2;
      const { body } = await request(app)
        .get(`/experiments/${expId}`)
        .expect(200);

      expect(body.data.experiment.name).toBe(experimentsData[expId - 1].name);
    });

    it('should also fetch deleted experiment', async () => {
      const expId = 4;
      const { body } = await request(app)
        .get(`/experiments/${expId}`)
        .expect(200);

      expect(body.data.experiment.name).toBe(experimentsData[expId - 1].name);
    });

    it('should throw 404 for invalid experiment_id', async () => {
      await request(app)
        .get('/experiments/404')
        .expect(404);
    });
  });

  describe('POST `/experiments`', () => {
    it('should create a new experiment', async () => {
      const data = {
        name: 'Experiment_new',
        traffic_alloc: 49,
        is_running: true
      };

      const { body } = await request(app)
        .post('/experiments')
        .send(data)
        .set('Accept', 'application/json')
        .expect(201);

      const expId = body.data.id;

      expect(expId).toBeTruthy();

      const { body: resBody } = await request(app).get(`/experiments/${expId}`);

      const experiment = resBody.data.experiment;

      expect(experiment).toMatchObject(data);
    });
  });

  describe('PUT `/experiments/{experiment_id}`', () => {
    it('should update an existing experiment', async () => {
      // Create new experiment
      const data = {
        name: 'Experiment_new',
        traffic_alloc: 49,
        is_running: true
      };

      const { body } = await request(app)
        .post('/experiments')
        .send(data)
        .set('Accept', 'application/json')
        .expect(201);

      const expId = body.data.id;

      // Update the experiment
      const updatedData = {
        name: 'Experiment_new_updated',
        traffic_alloc: 99,
        is_running: false
      };

      await request(app)
        .put(`/experiments/${expId}`)
        .send(updatedData)
        .set('Accept', 'application/json')
        .expect(200);

      // Fetch the updated experiment again
      const { body: updatedBody } = await request(app).get(
        `/experiments/${expId}`
      );

      const experiment = updatedBody.data.experiment;

      expect(experiment).toMatchObject(updatedData);
    });
  });
});
