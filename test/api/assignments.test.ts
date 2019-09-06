import request from 'supertest';
import app from '../../src/app';
import { DB_TABLE } from '../../src/constants';
import db from '../../src/dbConnection';
import experimentsData from '../../seed/experiments.json';
import variationsData from '../../seed/variations.json';
import goalsData from '../../seed/goals.json';
import assignmentsData from '../../seed/visitor_assignments.json';

describe('Experiment API', () => {
  beforeAll(async () => {
    await db(DB_TABLE.EXPERIMENTS).insert(experimentsData);
    await db(DB_TABLE.VARIATIONS).insert(variationsData);
    await db(DB_TABLE.GOALS).insert(goalsData);
    await db(DB_TABLE.VISITOR_ASSIGNMENTS).insert(assignmentsData);
  });

  afterAll(async () => {
    await db.raw(
      `truncate table ${DB_TABLE.VISITOR_ASSIGNMENTS} RESTART IDENTITY CASCADE`
    );
    await db.raw(`truncate table ${DB_TABLE.GOALS} RESTART IDENTITY CASCADE`);
    await db.raw(
      `truncate table ${DB_TABLE.VARIATIONS} RESTART IDENTITY CASCADE`
    );
    await db.raw(
      `truncate table ${DB_TABLE.EXPERIMENTS} RESTART IDENTITY CASCADE`
    );
  });

  describe('POST `/visitors/{vid}/assignments`', () => {
    it('should fetch correct assignments for existing visitor', async () => {
      const visitor1_id = '123';

      const { body: body1 } = await request(app)
        .post(`/visitors/${visitor1_id}/assignments`)
        .expect(201);

      const { assignments: assignments1 } = body1.data;

      expect(assignments1.length).toBe(1);
      expect(assignments1[0].variation_name).toBe('Variation1_1');

      const visitor2_id = '456';

      const { body: body2 } = await request(app)
        .post(`/visitors/${visitor2_id}/assignments`)
        .expect(201);

      const { assignments: assignments2 } = body2.data;

      expect(assignments2.length).toBe(1);
      expect(assignments2[0].variation_name).toBe('Control_2');
    });

    it('should create new assignments for first time visitor', async () => {
      const visitor_id = '789';

      const { body } = await request(app)
        .post(`/visitors/${visitor_id}/assignments`)
        .expect(201);

      const { assignments } = body.data;

      /**
       * We cannot determine the length of assignments as they are purely based
       * on random distribution of experiment's traffic_alloc.
       * So instead we simply loop over received assignments to see if they match
       * our data set from seed
       */
      assignments.forEach((a: any) => {
        const exp = experimentsData[a.experiment_id - 1];
        const variation = variationsData[a.variation_id - 1];

        expect(a.experiment_name).toBe(exp.name);
        expect(a.variation_name).toBe(variation.name);
        expect(a.is_control).toBe(variation.is_control);
      });
    });
  });

  describe('POST `/visitors/{vid}/activate`', () => {
    /**
     * In this test, we make sure that calling `/activate` for experiments
     * which are already assigned should result in idempotent operation
     */
    it('should return existing assignments for already assigned experiments', async () => {
      // We have already created assignments for visitor 123 & 456 in our DB

      const visitor1_id = '123';

      const { body: body1 } = await request(app)
        .post(`/visitors/${visitor1_id}/activate?experiment_ids=1,2,3`)
        .expect(201);

      const { assignments: assignments1 } = body1.data;

      expect(assignments1.length).toBe(1);
      expect(assignments1[0].variation_name).toBe('Variation1_1');

      const visitor2_id = '456';

      const { body: body2 } = await request(app)
        .post(`/visitors/${visitor2_id}/activate?experiment_ids=1,2,3`)
        .expect(201);

      const { assignments: assignments2 } = body2.data;

      expect(assignments2.length).toBe(1);
      expect(assignments2[0].variation_name).toBe('Control_2');
    });

    it('should create new assignments for new visitor', async () => {
      const visitor_id = '789';

      const { body } = await request(app)
        .post(`/visitors/${visitor_id}/activate?experiment_ids=2,3,90`)
        .expect(201);

      const { assignments } = body.data;

      // As only 1 experiment is activated with traffic_alloc set as 100
      expect(assignments.length).toBe(1);
      expect(assignments[0].experiment_name).toBe('Experiment2');
      expect(
        assignments[0].variation_name === 'Variation1_2' ||
          assignments[0].variation_name === 'Control_2'
      ).toBe(true);
    });
  });

  describe('POST `/visitors/{vid}/track/{goal_id}`', () => {
    it('should do nothing when incorrect goal id is passed', async () => {
      const visitor_id = '123';
      const goalId = 888;

      await request(app)
        .post(`/visitors/${visitor_id}/track/${goalId}`)
        .expect(201);

      const { rowCount } = await db.raw(
        `SELECT * from ${DB_TABLE.VISITOR_GOALS}`
      );
      expect(rowCount).toBe(0);
    });

    it('should do nothing when incorrect visitor id is passed', async () => {
      const visitor_id = '9087';
      const goalId = 1;

      await request(app)
        .post(`/visitors/${visitor_id}/track/${goalId}`)
        .expect(201);

      const { rowCount } = await db.raw(
        `SELECT * from ${DB_TABLE.VISITOR_GOALS}`
      );
      expect(rowCount).toBe(0);
    });

    it('should correctly track goal for given visitor id', async () => {
      const visitor_id = '123';
      const goalId = 1;

      await request(app)
        .post(`/visitors/${visitor_id}/track/${goalId}`)
        .expect(201);

      const { rows } = await db.raw(`SELECT * from ${DB_TABLE.VISITOR_GOALS}`);
      expect(rows.length).toBe(1);
      expect(rows[0].goal_id).toBe(goalId);
      expect(rows[0].visitor_assignment_id).toBe(1);
    });
  });
});
