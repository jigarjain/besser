import * as Knex from 'knex';

async function createVisitorsAssignmentTable(knex: Knex) {
  await knex.schema.createTable('visitor_assignments', table => {
    table.increments('id').unsigned();
    table
      .integer('experiment_id')
      .references('id')
      .inTable('experiments')
      .onUpdate('RESTRICT')
      .onDelete('RESTRICT');
    table
      .integer('variation_id')
      .references('id')
      .inTable('variations')
      .onUpdate('RESTRICT')
      .onDelete('RESTRICT');
    table.enum('action', ['ASSIGNED', 'IGNORED']);
    table.unique(['experiment_id', 'variation_id', 'action']);
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
  // eslint-disable-next-line no-console
  console.log('Created `visitor_assignments` table');
}

async function dropVisitorsAssignmentTable(knex: Knex) {
  await knex.schema.dropTable('visitor_assignments');
  // eslint-disable-next-line no-console
  console.log('Dropped `visitor_assignments` table');
}

async function createVisitorGoalsTable(knex: Knex) {
  await knex.schema.createTable('visitor_goals', table => {
    table.increments('id').unsigned();
    table
      .integer('visitor_assignment_id')
      .references('id')
      .inTable('visitor_assignments')
      .onUpdate('RESTRICT')
      .onDelete('RESTRICT');
    table
      .integer('goal_id')
      .references('id')
      .inTable('goals')
      .onUpdate('RESTRICT')
      .onDelete('RESTRICT');
    table.string('device');
    table.string('browser');
    table.unique(['visitor_assignment_id', 'goal_id']);
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
  // eslint-disable-next-line no-console
  console.log('Created `visitor_goals` table');
}

async function dropVisitorGoalsTable(knex: Knex) {
  await knex.schema.dropTable('visitor_goals');
  // eslint-disable-next-line no-console
  console.log('Dropped `visitor_goals` table');
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
