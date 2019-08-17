import * as Knex from 'knex';
import { DB_TABLE } from '../src/constants';

async function createVisitorsAssignmentTable(knex: Knex) {
  await knex.schema.createTable(DB_TABLE.VISITOR_ASSIGNMENTS, table => {
    table.increments('id').unsigned();
    table
      .integer('experiment_id')
      .references('id')
      .inTable(DB_TABLE.EXPERIMENTS)
      .onUpdate('RESTRICT')
      .onDelete('RESTRICT');
    table
      .integer('variation_id')
      .references('id')
      .inTable(DB_TABLE.VARIATIONS)
      .onUpdate('RESTRICT')
      .onDelete('RESTRICT');
    table.enum('action', ['ASSIGNED', 'IGNORED']);
    table.unique(['experiment_id', 'variation_id', 'action']);
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
  // eslint-disable-next-line no-console
  console.log(`Created ${DB_TABLE.VISITOR_ASSIGNMENTS} table`);
}

async function dropVisitorsAssignmentTable(knex: Knex) {
  await knex.schema.dropTable(DB_TABLE.VISITOR_ASSIGNMENTS);
  // eslint-disable-next-line no-console
  console.log(`Dropped ${DB_TABLE.VISITOR_ASSIGNMENTS} table`);
}

async function createVisitorGoalsTable(knex: Knex) {
  await knex.schema.createTable(DB_TABLE.VISITOR_GOALS, table => {
    table.increments('id').unsigned();
    table
      .integer('visitor_assignment_id')
      .references('id')
      .inTable(DB_TABLE.VISITOR_ASSIGNMENTS)
      .onUpdate('RESTRICT')
      .onDelete('RESTRICT');
    table
      .integer('goal_id')
      .references('id')
      .inTable(DB_TABLE.GOALS)
      .onUpdate('RESTRICT')
      .onDelete('RESTRICT');
    table.string('device');
    table.string('browser');
    table.unique(['visitor_assignment_id', 'goal_id']);
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
  // eslint-disable-next-line no-console
  console.log(`Created ${DB_TABLE.VISITOR_GOALS} table`);
}

async function dropVisitorGoalsTable(knex: Knex) {
  await knex.schema.dropTable(DB_TABLE.VISITOR_GOALS);
  // eslint-disable-next-line no-console
  console.log(`Dropped ${DB_TABLE.VISITOR_GOALS} table`);
}

export async function up(knex: Knex): Promise<any> {
  await createVisitorsAssignmentTable(knex);
  await createVisitorGoalsTable(knex);
  // eslint-disable-next-line no-console
  console.log('All done');
}

export async function down(knex: Knex): Promise<any> {
  await dropVisitorGoalsTable(knex);
  await dropVisitorsAssignmentTable(knex);
  // eslint-disable-next-line no-console
  console.log('All done');
}
