import * as Knex from 'knex';
import { DB_TABLE } from '../src/constants';

async function createExperimentsTable(knex: Knex) {
  await knex.schema.createTable(DB_TABLE.EXPERIMENTS, table => {
    table.increments('id').unsigned();
    table.string('name').notNullable();
    table.integer('traffic_alloc').defaultTo(100);
    table.boolean('is_running').defaultTo(true);
    table.boolean('is_deleted').defaultTo(false);
    table.timestamps(false, true);
  });
  // eslint-disable-next-line no-console
  console.log(`Created ${DB_TABLE.EXPERIMENTS} table`);
}

async function dropExperimentsTable(knex: Knex) {
  await knex.schema.dropTable(DB_TABLE.EXPERIMENTS);
  // eslint-disable-next-line no-console
  console.log(`Dropped ${DB_TABLE.EXPERIMENTS} table`);
}

async function createVariationsTable(knex: Knex) {
  await knex.schema.createTable(DB_TABLE.VARIATIONS, table => {
    table.increments('id').unsigned();
    table.string('name').notNullable();
    table.boolean('is_control').notNullable();
    table.boolean('is_active').defaultTo(true);
    table
      .integer('experiment_id')
      .references('id')
      .inTable(DB_TABLE.EXPERIMENTS)
      .onUpdate('RESTRICT')
      .onDelete('RESTRICT');
    table.timestamps(false, true);
  });
  // eslint-disable-next-line no-console
  console.log(`Created ${DB_TABLE.VARIATIONS} table`);
}

async function dropVariationsTable(knex: Knex) {
  await knex.schema.dropTable(DB_TABLE.VARIATIONS);
  // eslint-disable-next-line no-console
  console.log(`Dropped ${DB_TABLE.VARIATIONS} table`);
}

async function createGoalsTable(knex: Knex) {
  await knex.schema.createTable(DB_TABLE.GOALS, table => {
    table.increments('id').unsigned();
    table.string('name').notNullable();
    table.string('type').notNullable();
    table.boolean('is_deleted').defaultTo(false);
    table.timestamps(false, true);
  });
  // eslint-disable-next-line no-console
  console.log(`Created ${DB_TABLE.GOALS} table`);
}

async function dropGoalsTable(knex: Knex) {
  await knex.schema.dropTable(DB_TABLE.GOALS);
  // eslint-disable-next-line no-console
  console.log(`Dropped ${DB_TABLE.GOALS} table`);
}

export async function up(knex: Knex): Promise<any> {
  await createExperimentsTable(knex);
  await createVariationsTable(knex);
  await createGoalsTable(knex);
  // eslint-disable-next-line no-console
  console.log('All done !');
}

export async function down(knex: Knex): Promise<any> {
  await dropGoalsTable(knex);
  await dropVariationsTable(knex);
  await dropExperimentsTable(knex);
  // eslint-disable-next-line no-console
  console.log('All done !');
}
